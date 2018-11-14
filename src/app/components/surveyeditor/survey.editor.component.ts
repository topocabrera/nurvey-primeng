import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as SurveyEditor from 'surveyjs-editor';
import * as Survey from "survey-angular";
import 'bootstrap';
//import { MaterialModal } from '../material-modal/material-modal';


//Servicios
import { UserService } from '../../services';
import { SurveyService } from '../../services/survey.service';
import { PreguntasCustomService } from '../../services/preguntas-custom.service';
import { BloquePreguntasService } from '../../services/bloque-preguntas.service';
import { AlertService, AuthenticationService } from '../../services/index';

//Modelos
import { SurveyModelClass } from '../../domain/SurveyModelClass';
import { PreguntasCustomModelClass } from '../../domain/PreguntasCustomModelClass';

SurveyEditor.editorLocalization.currentLocale = "es";
/**
 * Componente principal del editor de encuestas basado en SurveyJS.
 *     En el se pueden crear las encuestas y colocar las preguntas.
 */
@Component({
    selector: 'editor',
     templateUrl: './survey.editor.component.html',
     styleUrls: ['./survey.css']  
})
export class SurveyEditorComponent  {
    private sub: any;
    currentUser:any = JSON.parse(localStorage.getItem('currentUser'));
    editor: SurveyEditor.SurveyEditor;
    id: number;
    titulo: string;
    question: SurveyEditor.SurveyQuestionEditor;
    surveyService: SurveyService;
    userService: UserService;
    preguntasCustomService: PreguntasCustomService;
    bloquePreguntasService: BloquePreguntasService;
    newSurvey: SurveyModelClass;
    returnUrl: string;
    muestraMensajeToast: boolean;
    mensajeToast: string;   
    preguntasCustom: PreguntasCustomModelClass;
    
    @Input() json: any;
    @Output() surveySaved: EventEmitter<Object> = new EventEmitter();

    /**
     * Metodo de inicio del componente
    **/ 
    constructor(surveyService: SurveyService, private route: ActivatedRoute, private router: Router, 
                userService: UserService, preguntasCustomService: PreguntasCustomService,
                bloquePreguntasService: BloquePreguntasService, private alertify: AlertService) {
        Survey.JsonObject.metaData.removeProperty("selectbase", "choicesUrl");
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.surveyService = surveyService;
        this.userService = userService;
        this.preguntasCustomService = preguntasCustomService;
        this.bloquePreguntasService = bloquePreguntasService;
        this.muestraMensajeToast = false;
        this.mensajeToast = "";

        var editorOptions = {};
        this.editor = new SurveyEditor.SurveyEditor("editorElement", editorOptions);
    }
    
    ngOnInit() {

        var editorDefinition = SurveyEditor.SurveyQuestionEditorDefinition.definition["questionbase"];
        editorDefinition.tabs = []
        editorDefinition.tabs.push({ name: "enableIf", visible: false });
        editorDefinition.tabs.push({ name: "visibleIf", visible: false });
        console.log(Survey.JsonObject.metaData)
        this.sub = this.route.params.subscribe(params => 
        {
            this.id = +params['id']; // (+) converts string 'id' to a number
            if(isNaN(this.id))
            {
                let editorOptions = {   showEmbededSurveyTab: false, 
                                        generateValidJSON : true, 
                                        showJSONEditorTab: false,
                                        questionTypes: ["text", "rating", "radiogroup", "dropdown","checkbox", "panel"],
                                        showPropertyGrid: false,
                                        isRTL: true,
                                        designerHeight: "1200px",
                                        useTabsInElementEditor: true
                                        // showState: true
                                    };
                this.editor = new SurveyEditor.SurveyEditor('surveyEditorContainer', editorOptions);
                this.editor.text = JSON.stringify(this.json);
                this.editor.saveSurveyFunc = this.saveMySurvey;
                this.editor.toolbox.copiedItemMaxCount = 20;
            }             
            else
            {
                this.surveyService.getEncuestasById(this.id.toString()).subscribe(res => 
                    {
                        let editorOptions = 
                            {   showEmbededSurveyTab: false,
                                generateValidJSON : true,
                                showJSONEditorTab: false,
                                questionTypes: ["text", "rating", "radiogroup", "dropdown","checkbox"],
                                showPropertyGrid: false,
                                isRTL: true,
                                designerHeight: "1200px",
                                useTabsInElementEditor: true
                            };
                this.editor = new SurveyEditor.SurveyEditor('surveyEditorContainer', editorOptions);
                this.editor.text = res.definicionJSON
                this.editor.saveSurveyFunc = this.saveMySurvey;
                this.editor.onQuestionAdded
                this.editor.toolbox.copiedItemMaxCount = 20;
                    });
            }
        });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/misencuestas';
        this.preguntasCustomService.getCustomQuestions(this.currentUser.idUsuario)
            .subscribe(
            (res:any) => {
                if(res.status===200){
                    var data = res.json();
                    console.log(data)
                    var customQuestions = JSON.parse(data.preguntaCustomJson)
                    if (customQuestions){
                        JSON.parse(data.preguntaCustomJson).forEach(element => {
                            console.log("PREGUNTAS-CUSTOM")
                            console.log(element)
                            this.editor.toolbox.addItem(element);
                        });  
                    }
                }else{
                    console.log("No existen preguntas custom guardadas por el usuario logueado")
                    console.log(res.statusText)
                }
            },
            error => {
                console.log(error)
            });
        this.bloquePreguntasService.getAllBloquePreguntas()
            .subscribe(res => {
                var bloquePreguntas = JSON.parse(res.contenidoBloque)
                bloquePreguntas.forEach(element => {
                    console.log("BLOQUE-PREGUNTAS")
                    console.log(element)
                    this.editor.toolbox.addItem(element);
                });
            });
        this.editor.toolbox.allowExpandMultipleCategories = true;
        this.editor.toolbox.expandAllCategories();
        this.editor.toolbox.expandCategory('nurvey');
}

    saveCustomQuestions() {
        var savedItems = this.editor.toolbox.copiedJsonText; //save into localstorage or your database
                    if(savedItems !== '[]'){
                        var preguntasCustomAll = JSON.parse(savedItems);
                        var preguntasCustomUser = [];
                        var flagUser = false;
                        preguntasCustomAll.forEach(element => {
                            if(element.category === ""){
                                preguntasCustomUser.push(element);
                                flagUser=true;
                            }
                        });
                        if(flagUser){
                            this.preguntasCustom = new PreguntasCustomModelClass(this.currentUser.idUsuario,JSON.stringify(preguntasCustomUser));
                            console.log(this.preguntasCustom.preguntaCustomJson)
                        }
                        // else{
                        //     this.preguntasCustom = new PreguntasCustomModelClass(this.currentUser.idUsuario,JSON.stringify(preguntasCustomAll));
                        // }
                        // console.log(savedItems)
                        
                        this.preguntasCustomService.addCustomQuestions(this.preguntasCustom)
                            .subscribe( res => {
                                // this.editor.toolbox.copiedJsonText = this.preguntasCustom.preguntaCustomJson
                            } );

                        this.alertify.alert('Sus preguntas custom han sido guardadas exitosamente.')
                        
                    }else{ this.alertify.error('No hay preguntas custom para guardar.') }
    }
    saveMySurvey = () => {
        this.surveySaved.emit(JSON.parse(this.editor.text));
        this.newSurvey = JSON.parse(this.editor.text);
        if (this.titulo)
            {   
                this.surveyService.saveSurvey(this.newSurvey,this.titulo)
                .subscribe(
                    data => {
                    // this.muestraMensajeToast = true;
                    this.mensajeToast = 'La encuesta "'+ this.titulo +'" ha sido guardada exitosamente.';
                    this.alertify.alert(this.mensajeToast);
                    this.router.navigate([this.returnUrl]);
                    // survey => this.newSurvey
                    // this.surveySaved.emit({Survey: this.newSurvey});
                    // alert("Su encuesta se ha guardada satisfactoriamente.")
                    // this.router.navigate([this.returnUrl]);
                    },
                    error => {
                        this.alertify.error(error.toString())
                    });
            }
        else {
            // this.muestraMensajeToast = true;
            this.mensajeToast = "Debe ingresar un titulo para la encuesta.";
            this.alertify.alert(this.mensajeToast);
        }
    }
}