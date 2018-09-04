import { Component, OnInit, Output, Input } from '@angular/core';
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
    @Input() idTabSelected: string;
    resultadoService: ResultadoService;  
    nombreGrafico: string;
    preguntasEncuesta = [];     
    horaChartExposicionPoster : any;
    surveyService: SurveyService;
    preguntasService: PreguntasService;
    preguntasAgrupables:any[];
    currentUser:any = JSON.parse(localStorage.getItem('currentUser'));
    loading:boolean;
    alert:boolean;
    encuestaSeleccionada:boolean;
    mensajeAlert:string;
    estiloAlert:string;
    tituloEncuesta:string;
    fechaEncuestaSeleccionada: string;
    estadoEncuestaSeleccionada: string;
    
    constructor(resultadoService: ResultadoService, 
                surveyService: SurveyService, 
                preguntasService:PreguntasService,
                private activatedRouter:ActivatedRoute){
      this.resultadoService = resultadoService;      
      this.surveyService = surveyService;
      this.preguntasService = preguntasService;
      this.preguntasAgrupables = [];
      this.alert = false;
      this.mensajeAlert = "";
      this.estiloAlert = "";
  }  
    ngOnInit(){
      this.encuestaSeleccionada = false;
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

    ngOnChanges(){
      console.log(this.idTabSelected)
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
      if(idEncuesta == ""){
        //error
        this.alert = true;
        this.loading = false;
        this.mensajeAlert = "Debe seleccionar una encuesta."
        this.estiloAlert = "alert-warning"
      }else{
            this.preguntasService.getPreguntasEncuesta(idEncuesta)
                .subscribe(
                  res => {
                    this.loading = false;
                    this.alert = false;
                    this.encuestaSeleccionada = true;
                  }
                 ,error => {
                  this.loading = false;
                  this.alert = true;
                  this.encuestaSeleccionada = false;
                });
            this.surveyService.getEncuestasById(idEncuesta)
            .subscribe( res => {
              console.log(res)
              this.tituloEncuesta = res.tituloEncuesta;
              this.estadoEncuestaSeleccionada = res.estadoEncuesta;
              this.fechaEncuestaSeleccionada = res.fechaEncuesta;
            });                  

            this.resultadoService.getInfoRespuesta(idEncuesta,this.currentUser.idUsuario)
            .subscribe( res => {
              console.log(res)
            });

            this.getPreguntasAgrupadas(idEncuesta);
              //var preguntaAgrupable = {idPregunta:1, descripcion:"Sexo",activo:false, respuestasPosibles:["Masculino","Femenino"]}
              //var preguntaAgrupableEdad = {idPregunta:2, descripcion:"Edad",activo:true, respuestasPosibles:["10-15","15-25","25-35"]}
            this.preguntasAgrupables = this.preguntasService.preguntasAgrupables;
          }
    }
}
