
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as SurveyEditor from 'surveyjs-editor';
import * as Survey from "survey-angular";
//import 'jquery';
import * as jquery from 'jquery';
import 'bootstrap';

import { SurveyService } from '../../services/survey.service';
import { SurveyModelClass } from '../../domain/SurveyModelClass';
// import { Survey } from '../../../../node_modules/survey-angular';

SurveyEditor.editorLocalization.currentLocale = "es";
// Survey  
//         .JsonObject
//         .metaData
//         .addProperty("questionbase", {name:"tuvieja",type:"boolean",category:"checks",isRequired:false});
//         // Change the order of name and title properties, remove the startWithNewLine property and add a tag property
//         SurveyEditor
//         .SurveyQuestionEditorDefinition
//         .definition["questionbase"]
//         .properties = [
//             "title",
//             "name", {
//                 name: "tuvieja",
//                 category: "checks"
//             }, {
//                 name: "visible",
//                 category: "checks"
//             }, {
//                 name: "isRequired",
//                 category: "checks"
//             }
//         ];
//         // make visibleIf tab the second after general for all questions
//         SurveyEditor
//         .SurveyQuestionEditorDefinition
//         .definition["questionbase"]
//         .tabs = [
//             {
//                 name: "visibleIf",
//                 index: 1
//             }
//         ];
//         // make visibleIf tab the second after general for all questions
//         SurveyEditor
//         .SurveyQuestionEditorDefinition
//         .definition["questionbase"]
//         .tabs = [
//             {
//                 name: "visibleIf",
//                 index: 1
//             }
//         ];

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
    titulo: string;
    editor: SurveyEditor.SurveyEditor;
    question: SurveyEditor.SurveyQuestionEditor;
    surveyService: SurveyService;
    newSurvey: SurveyModelClass;
    returnUrl: string;
    private sub: any;
    id: number;
    currentUser:any = JSON.parse(localStorage.getItem('currentUser'));
    @Input() json: any;
    @Output() surveySaved: EventEmitter<Object> = new EventEmitter();

    /**
     * Metodo de inicio del componente
    **/ 
    constructor(surveyService: SurveyService, private route: ActivatedRoute, private router: Router) {
        this.surveyService = surveyService;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log(Survey.JsonObject.metaData)
        
    }

    ngOnInit() {
        console.log("onInitSurveyEditor")
        
        // Survey.JsonObject.metaData.addProperty("questionbase", "corteDatos:boolean");
        // Survey.JsonObject.metaData.addProperty("questionbase", {name: "tipoCorte", choices: ["Sexo", "Edad", "Ubicacion"] });
        // console.log(Survey.JsonObject.metaData)

        // var editorDefinition = SurveyEditor.SurveyQuestionEditorDefinition.definition["questionbase"];

        // // The tabs and properties may be empty for an element type. It means that uses the definition from the parent class.
        // // For example questionbase is the base class for all questions.
        // if (!editorDefinition.tabs){
        // editorDefinition.tabs = []
        // //Add a new tab, that doesn't contains properties
        // // editorDefinition.tabs.push({ name: "enableIf", visible: false });
        // // editorDefinition.tabs.push({ name: "visibleIf", visible: false });
        // editorDefinition.tabs.push({ name: "corte_addition", title: "Corte de Datos", index: 15 });
        // console.log(editorDefinition.tabs)
        // // editorDefinition.properties = []; 
        // //Add three properties into this new tab. If tab is empty, then a property is shown in the first "general" tab.
        // editorDefinition.properties.push({ name: "name", tab: "corte_addition" });
        // // editorDefinition.properties.push({ name: "page", tab: "corte_addition" });
        // editorDefinition.properties.push({ name: "corteDatos", tab: "corte_addition" });
        // editorDefinition.properties.push({ name: "tipoCorte", tab: "corte_addition" });
        // console.log(editorDefinition.properties)
        // }        
        
        this.sub = this.route.params.subscribe(params => {
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
            // SurveyEditor.StylesManager.applyTheme("default");
            
            }             
        else{
            this.surveyService.getEncuestasById(this.id.toString()).subscribe(res => {
                let editorOptions = { showEmbededSurveyTab: false,
                                     generateValidJSON : true,
                                     showJSONEditorTab: false};
                this.editor = new SurveyEditor.SurveyEditor('surveyEditorContainer', editorOptions);
                this.editor.text = res.definicionJSON
                this.editor.saveSurveyFunc = this.saveMySurvey;
                this.editor.onQuestionAdded
            });
            }
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/misencuestas';

        // this.editor.toolbox.changeCategories([{ name: "text", category: "Preguntas Abiertas" },
        //                                      { name: "rating", category: "Preguntas Cerradas" }, 
        //                                      { name: "radiogroup", category: "Preguntas Cerradas" },
        //                                      { name: "dropdown", category: "Preguntas Cerradas" }
        //                                     ]);
        
        //Add all countries question into toolbox
        this.editor.toolbox.addItem(
            {name: "countries",
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


            // this.editor.toolbox.getItemByName("radiogroup").json = {
            //     "type": "radiogroup",
            //     choices: ["Blue", "Red"]
            
            // };


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

        if (this.titulo != undefined || this.titulo != null || this.titulo != ""){
        this.surveyService.saveSurvey(this.newSurvey,this.titulo)
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                survey => this.newSurvey
                this.surveySaved.emit({Survey: this.newSurvey});
                alert("Su encuesta se ha guardada satisfactoriamente.")
                this.router.navigate([this.returnUrl]);
                },
                error => {
                    
                });
        }
        else{
            alert("Debe ingresar un titulo a la encuesta.");
        }
    }
}