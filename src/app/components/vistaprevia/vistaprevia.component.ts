import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router'
import { SurveyService } from '../../services/survey.service';
import { SurveyModelClass } from '../../domain/SurveyModelClass';
import * as Survey from 'survey-angular';

@Component({
  selector: 'app-vistaprevia',
  templateUrl: './vistaprevia.component.html',
  styleUrls: ['./vistaprevia.component.css']
})
export class VistapreviaComponent implements OnInit {

  encuesta:any;
  surveyRender:object;

  constructor(private activatedRoute:ActivatedRoute,
              private _surveyService:SurveyService) {
    
              this.activatedRoute.params.subscribe( params => {
                this._surveyService.getEncuestasById(params['id'])
                .subscribe( (resp) => {
                  this.encuesta = resp;
                  this.surveyRender = JSON.parse(this.encuesta.definicionJSON) 
                  console.log(this.surveyRender)
                  const surveyModel = new Survey.ReactSurveyModel(this.surveyRender);
                  surveyModel.completeText = "Confirmar"
                  surveyModel.pageNextText = "Siguiente"
                  surveyModel.pagePrevText = "Anterior"
                  surveyModel.completedHtml = "<h3>Vista previa finalizada!</h3>"
                  // surveyModel.css.text = "textShadow"
                  // $(".sv_complete_btn").addClass('botonCompletar');
                  Survey.SurveyNG.render('surveyElement', { model: surveyModel});
                  console.log(surveyModel.css);
                  console.log(surveyModel.geSurveyData());
                  surveyModel.onComplete.add(function(result) {
                      // document.querySelector('#surveyResult').innerHTML = "result: " + JSON.stringify(result.data);
                      console.log(result.data)
                      });
                    });
              });

             
              
   }

  ngOnInit() {
  }

}
