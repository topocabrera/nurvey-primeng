import { Component, OnInit } from '@angular/core';
import { ResultadoService } from './../../services/resultados.service';
import * as Chartist from 'chartist';
import { SurveyService } from './../../services/survey.service';
import { PreguntasService } from './../../services/preguntas.service';
import { ActivatedRoute } from '@angular/router';

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
    loading:boolean;

    constructor(resultadoService: ResultadoService, 
                surveyService: SurveyService, 
                preguntasService:PreguntasService,
                private activatedRouter:ActivatedRoute){
      this.resultadoService = resultadoService;      
      this.surveyService = surveyService;
      this.preguntasService = preguntasService;
      this.preguntasAgrupables = [];
  }  
    ngOnInit(){
      this.loadEncuestas();
      this.activatedRouter.params.subscribe( params => {
        if(params['id'] > 0 ){
          var idEncuesta = params['id'];
          this.preguntasService.getPreguntasEncuesta(idEncuesta)
              .subscribe(res => this.loading = false);              
          this.getPreguntasAgrupadas(idEncuesta);
          this.preguntasAgrupables = this.preguntasService.preguntasAgrupables;
        }
      });
                
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
      this.loading = true;
      var idEncuesta = $("#selectorEncuesta").val();
      this.preguntasService.getPreguntasEncuesta(idEncuesta)
          .subscribe(res => this.loading = false);              
      
      this.getPreguntasAgrupadas(idEncuesta);
        //var preguntaAgrupable = {idPregunta:1, descripcion:"Sexo",activo:false, respuestasPosibles:["Masculino","Femenino"]}
        //var preguntaAgrupableEdad = {idPregunta:2, descripcion:"Edad",activo:true, respuestasPosibles:["10-15","15-25","25-35"]}
      this.preguntasAgrupables = this.preguntasService.preguntasAgrupables;
      
    }
}
