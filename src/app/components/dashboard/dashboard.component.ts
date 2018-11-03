import { Component, OnInit, Output, Input } from '@angular/core';
import { ResultadoService } from './../../services/resultados.service';
import * as Chartist from 'chartist';
import { SurveyService } from './../../services/survey.service';
import { PreguntasService } from './../../services/preguntas.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from './../../services/index';

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
    infoRespuestas: any;
    respuesta:any;
    infoVisible:boolean;
    cantidadRtas: number;
    constructor(resultadoService: ResultadoService, 
                surveyService: SurveyService, 
                preguntasService:PreguntasService,
                private activatedRouter:ActivatedRoute,
                private alertService: AlertService){
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
          //TAB info de preguntas
          this.preguntasService.getPreguntasEncuesta(idEncuesta)
              .subscribe(res => {
                this.loading = false 
                this.encuestaSeleccionada = true;
              });
          //TAB info de la encuesta
          this.surveyService.getEncuestasById(idEncuesta)
            .subscribe( res => {
              this.tituloEncuesta = res.tituloEncuesta;
              this.estadoEncuestaSeleccionada = res.estadoEncuesta;
              this.fechaEncuestaSeleccionada = res.fechaEncuesta;
            }); 
            //TAB info de cada respuesta (hacer por instancia de respuesta)
            this.resultadoService.getInfoRespuesta(idEncuesta,this.currentUser.idUsuario)
            .subscribe( res => this.infoRespuestas = res );

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
      this.infoVisible = false;
      var idEncuesta = $("#selectorEncuesta").val();
      if(idEncuesta == ""){
        //error
        // this.alert = true;
        this.loading = false;
        this.mensajeAlert = "Debe seleccionar una encuesta."
        this.estiloAlert = "alert-warning"
        this.alertService.alert(this.mensajeAlert);
      }else{
            //TAB info de preguntas
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
            //TAB info de la encuesta
            this.surveyService.getEncuestasById(idEncuesta)
            .subscribe( res => {
              this.tituloEncuesta = res.tituloEncuesta;
              this.estadoEncuestaSeleccionada = res.estadoEncuesta;
              this.fechaEncuestaSeleccionada = res.fechaEncuesta;
            });                  
            //TAB info de cada respuesta (hacer por instancia de respuesta)
            this.resultadoService.getInfoRespuesta(idEncuesta,this.currentUser.idUsuario)
            .subscribe( res => this.infoRespuestas = res);

            this.getPreguntasAgrupadas(idEncuesta);
            this.preguntasAgrupables = this.preguntasService.preguntasAgrupables;
            console.log(this.preguntasAgrupables)
            // var preguntaAgrupable = {idPregunta:1, descripcion:"Sexo",activo:false, respuestasPosibles:["Masculino","Femenino"]}
            // var preguntaAgrupableEdad = {idPregunta:2, descripcion:"Edad",activo:true, respuestasPosibles:["10-15","15-25","25-35"]}
            
          }
    }

    mostrarInfoRta(value:number) {
      this.cantidadRtas = this.infoRespuestas.length;
      if(value > 0 && value < this.infoRespuestas.length){
        this.respuesta = this.infoRespuestas[value-1];
        this.infoVisible = true;
      }else{
        console.log("value incorrecto")
      }
    }
}
