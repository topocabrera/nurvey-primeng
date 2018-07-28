
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as SurveyEditor from 'surveyjs-editor';
//import 'jquery';
import * as jquery from 'jquery';
import 'bootstrap';

import { SurveyService } from '../../services/surveyservice';
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
    titulo: string;
    editor: SurveyEditor.SurveyEditor;
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
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id']; // (+) converts string 'id' to a number
            // var esCreacion = isNaN(this.id)
            if(isNaN(this.id))
            {
            let editorOptions = { showEmbededSurveyTab: false, generateValidJSON : true, showJSONEditorTab: false};
            this.editor = new SurveyEditor.SurveyEditor('surveyEditorContainer', editorOptions);
            this.editor.text = JSON.stringify(this.json);
            this.editor.saveSurveyFunc = this.saveMySurvey;
            }             
        else{
            this.surveyService.getEncuestasById(this.id.toString()).subscribe(res => {
                let editorOptions = { showEmbededSurveyTab: false, generateValidJSON : true, showJSONEditorTab: false};
                this.editor = new SurveyEditor.SurveyEditor('surveyEditorContainer', editorOptions);
                this.editor.text = res.definicionJSON
                this.editor.saveSurveyFunc = this.saveMySurvey;
            });
            }
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/misencuestas';
    }

    

    saveMySurvey = () => {
        console.log(this.editor.text); // json puro
        console.log(JSON.stringify(this.editor.text)); //json stringify
        console.log(JSON.parse(this.editor.text)); // json parseado a Objeto para emitir
        this.surveySaved.emit(JSON.parse(this.editor.text));

        this.newSurvey = JSON.parse(this.editor.text);
        if(this.titulo === undefined){
            
        }

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