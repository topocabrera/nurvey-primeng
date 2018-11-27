import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as SurveyEditor from 'surveyjs-editor';
import { BloquePreguntasService } from '../../services/bloque-preguntas.service';
import { AlertService, AuthenticationService } from '../../services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-bloque-preguntas-nurvey',
  templateUrl: './bloque-preguntas-nurvey.component.html',
  styleUrls: ['./bloque-preguntas-nurvey.component.css']
})
export class BloquePreguntasNurveyComponent implements OnInit {

  editor: SurveyEditor.SurveyEditor;
  
  @Input() json: any;

  constructor(
    private bloquePreguntasService: BloquePreguntasService,
    private alertService: AlertService,
    private router: Router) {
        var editorOptions = {};
        this.editor = new SurveyEditor.SurveyEditor("editorElement", editorOptions);
     }

  ngOnInit() {
    this.json = '{"pages":[{"name":"página1","elements":[{"type":"panel","name":"panel1","title":"Mi plantilla de Preguntas"}]}]}'
    let editorOptions = {   
        showEmbededSurveyTab: false, 
        generateValidJSON : true, 
        showJSONEditorTab: false,
        questionTypes: ["text", "rating", "radiogroup", "dropdown","checkbox"],
        showPropertyGrid: false,
        isRTL: true,
        useTabsInElementEditor: true
      };
      this.editor = new SurveyEditor.SurveyEditor('surveyEditorContainer', editorOptions);
      this.editor.text = this.json;
      this.editor.saveSurveyFunc = this.postBloquePregunta;
      // this.editor.onQuestionAdded = this.addedQuestion;
  }

  addedQuestion = (sender: SurveyEditor.SurveyEditor, options: any) => {}

  postBloquePregunta = () => {
      var newBloquePreg = JSON.parse(this.editor.text);
      // console.log(newBloquePreg.pages[0].elements[0])
      console.log(JSON.stringify(newBloquePreg.pages[0].elements[0]))
        this.bloquePreguntasService.postBloquePreguntas(JSON.stringify(newBloquePreg.pages[0].elements[0]))
        .subscribe(
            data => {
              this.alertService.alert('El bloque de preguntas "'+newBloquePreg.pages[0].elements[0].title+'" ha sido guardada exitosamente.');
              this.router.navigate(['/home']);
            },
            error => {
              this.alertService.error(error.toString())
            });
  }
}
