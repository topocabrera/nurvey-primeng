import { Component, OnInit } from '@angular/core';
import { ResultadoService } from './../../services/resultados.service';
import * as Chartist from 'chartist';
import { SurveyService } from './../../services/survey.service';
import { PreguntasService } from './../../services/preguntas.service';

declare var $:any;
declare var labelsGrafico:any;
declare var seriesGrafico:any;

@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.css']
})

export class DashboardComponent implements OnInit{
    resultadoService: ResultadoService;  
    nombreGrafico: string;
    preguntasEncuesta = [];     
    horaChartExposicionPoster : any;
    surveyService: SurveyService;
    preguntasService: PreguntasService;
    preguntasAgrupables:any[];
    currentUser:any = JSON.parse(localStorage.getItem('currentUser'));

    constructor(resultadoService: ResultadoService, surveyService: SurveyService, preguntasService:PreguntasService){
      this.resultadoService = resultadoService;      
      this.surveyService = surveyService;
      this.preguntasService = preguntasService;
      this.preguntasAgrupables = [];
  }  
    ngOnInit(){
      this.loadEncuestas();                              
                
    }

    loadEncuestas(){
        this.surveyService.getEncuestasRespondidas(this.currentUser.idUsuario)
          .subscribe(); 
    }

    onChange(idEncuesta) {      
      this.preguntasService.getPreguntasEncuesta(idEncuesta)
          .subscribe();              
    }

    getPreguntasAgrupadas(idEncuesta){
      this.preguntasService.getPreguntasAgrupablesEncuesta(idEncuesta)
          .subscribe();              
    }

    seleccionarEncuesta(){
      var idEncuesta = $("#selectorEncuesta").val();
      this.preguntasService.getPreguntasEncuesta(idEncuesta)
          .subscribe();              
      
      this.getPreguntasAgrupadas(idEncuesta);
        //var preguntaAgrupable = {idPregunta:1, descripcion:"Sexo",activo:false, respuestasPosibles:["Masculino","Femenino"]}
        //var preguntaAgrupableEdad = {idPregunta:2, descripcion:"Edad",activo:true, respuestasPosibles:["10-15","15-25","25-35"]}
      this.preguntasAgrupables = this.preguntasService.preguntasAgrupables;
    }
}
