import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as SurveyEditor from 'surveyjs-editor';
import * as Survey from "survey-angular";
import 'bootstrap';

//Servicios
import { UserService } from '../../services';
import { SurveyService } from '../../services/survey.service';
import { PreguntasCustomService } from '../../services/preguntas-custom.service';
import { BloquePreguntasService } from '../../services/bloque-preguntas.service';

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
                bloquePreguntasService: BloquePreguntasService) {
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
                                        useTabsInElementEditor: true,
                                        // showState: true
                                    };
                this.editor = new SurveyEditor.SurveyEditor('surveyEditorContainer', editorOptions);
                this.editor.text = JSON.stringify(this.json);
                this.editor.saveSurveyFunc = this.saveMySurvey;
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
                                useTabsInElementEditor: true,
                            };
                this.editor = new SurveyEditor.SurveyEditor('surveyEditorContainer', editorOptions);
                this.editor.text = res.definicionJSON
                this.editor.saveSurveyFunc = this.saveMySurvey;
                this.editor.onQuestionAdded
                
                    });
            }
        });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/misencuestas';
        this.preguntasCustomService.getCustomQuestions(this.currentUser.idUsuario)
            .subscribe(res => {
                var customQuestions = JSON.parse(res.preguntaCustomJson)
                customQuestions.forEach(element => {
                    console.log("PREGUNTAS-CUSTOM")
                    console.log(element)
                    this.editor.toolbox.addItem(element);
                });  
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
}

    saveCustomQuestions() {
        var savedItems = this.editor.toolbox.copiedJsonText; //save into localstorage or your database
                    if(savedItems !== '[]'){
                        this.preguntasCustom = new PreguntasCustomModelClass(this.currentUser.idUsuario,savedItems);
                        this.preguntasCustomService.addCustomQuestions(this.preguntasCustom)
                            .subscribe( res => this.editor.toolbox.copiedJsonText = this.preguntasCustom.preguntaCustomJson );
                    }else{ console.log("-- No hay preguntas custom...") }
    }
    saveMySurvey = () => {
        this.surveySaved.emit(JSON.parse(this.editor.text));
        this.newSurvey = JSON.parse(this.editor.text);
        if (this.titulo)
            {   
                this.surveyService.saveSurvey(this.newSurvey,this.titulo)
                .subscribe(
                    data => {
                    this.muestraMensajeToast = true;
                    this.mensajeToast = "Su encuesta ha sido guardada exitosamente";
                    this.router.navigate([this.returnUrl]);
                    // survey => this.newSurvey
                    // this.surveySaved.emit({Survey: this.newSurvey});
                    // alert("Su encuesta se ha guardada satisfactoriamente.")
                    // this.router.navigate([this.returnUrl]);
                    },
                    error => {});
            }
        else {
            this.muestraMensajeToast = true;
            this.mensajeToast = "Debe ingresar un titulo a la encuesta";
        }
    }
}