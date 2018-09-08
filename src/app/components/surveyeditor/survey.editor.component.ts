
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as SurveyEditor from 'surveyjs-editor';
import * as Survey from "survey-angular";
import 'bootstrap';

import { SurveyService } from '../../services/survey.service';
import { SurveyModelClass } from '../../domain/SurveyModelClass';

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
    newSurvey: SurveyModelClass;
    returnUrl: string;
    muestraMensajeToast: boolean;
    mensajeToast: string;   
    
    @Input() json: any;
    @Output() surveySaved: EventEmitter<Object> = new EventEmitter();

    /**
     * Metodo de inicio del componente
    **/ 
    constructor(surveyService: SurveyService, private route: ActivatedRoute, private router: Router) {
        Survey.JsonObject.metaData.removeProperty("selectbase", "choicesUrl");
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.surveyService = surveyService;
        this.muestraMensajeToast = false;
        this.mensajeToast = "";
        console.log(Survey.JsonObject.metaData)
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
            // var esCreacion = isNaN(this.id)
            if(isNaN(this.id))
            {
                let editorOptions = {   showEmbededSurveyTab: false, 
                                        generateValidJSON : true, 
                                        showJSONEditorTab: false,
                                        questionTypes: ["text", "rating", "radiogroup", "dropdown"],
                                        showPropertyGrid: false,
                                        isRTL: true,
                                        designerHeight: "1200px",
                                        useTabsInElementEditor: true,
                                        showState: true
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
                                showJSONEditorTab: false
                            };
                this.editor = new SurveyEditor.SurveyEditor('surveyEditorContainer', editorOptions);
                this.editor.text = res.definicionJSON
                this.editor.saveSurveyFunc = this.saveMySurvey;
                this.editor.onQuestionAdded
                
                    });
            }
        });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/misencuestas';

        //Add all countries question into toolbox
        this.editor.toolbox.addItem(
        {
            name: "countries",
            isCopied: true,
            iconName: "icon-default",
            title: "Países",
            category: "Banco de preguntas",
            json: {
                    "type": "dropdown",
                    optionsCaption: "Elije un país...",
                    choicesByUrl: {
                                    url: "https://restcountries.eu/rest/v2/all"
                                  }
                  }
        });

        this.editor.toolbox.addItem(
            {   name:"mail",
                title:"Email",
                isCopied:true,
                iconName:"icon-default",
                json:{  
                    name:"mail",
                    title:"Ingrese su email:",
                    isRequired:true,
                    inputType:"email",
                    type:"text"
                },
                category:"Banco de preguntas"
            });
}
    saveMySurvey = () => {
        console.log(this.editor.text); // json puro
        console.log(JSON.stringify(this.editor.text)); //json stringify
        console.log(JSON.parse(this.editor.text)); // json parseado a Objeto para emitir
        this.surveySaved.emit(JSON.parse(this.editor.text));

        this.newSurvey = JSON.parse(this.editor.text);
        if(this.titulo === undefined){
            
        }
        var savedItems = this.editor.toolbox.copiedJsonText; //save into localstorage or your database
        console.log(savedItems)
        //....
        //Restored savedItems from localstorage or your database.
        this.editor.toolbox.copiedJsonText = savedItems;

        if (this.titulo)
            {   this.surveyService.saveSurvey(this.newSurvey,this.titulo)
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
                    error => {
                        
                    });
            }
        else {
            this.muestraMensajeToast = true;
            this.mensajeToast = "Debe ingresar un titulo a la encuesta";
        }
    }
}