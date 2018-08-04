import { Component, Input, Output, EventEmitter, OnInit, OnDestroy  } from '@angular/core';
import { ActivatedRoute, Router,NavigationEnd } from '@angular/router'

import * as Survey from 'survey-angular';
import * as jquery from 'jquery';
import 'bootstrap';

import { SurveyService } from './../../services/survey.service';
import { ClienteModelClass } from './../../domain/ClienteModelClass';
import { SurveyModelClass } from './../../domain/SurveyModelClass';
// import { EncuestaModelClass } from './../shared/models/EncuestaModelClass';


@Component({
    selector: 'respuestaEncuesta',
    templateUrl: './respuesta.component.html',
    styleUrls: ['./respuesta.component.css']
})
export class respuestaComponent implements OnInit, OnDestroy {
    surveyRender: object;
    id: number; 
    private sub: any;
    surveyService: SurveyService;
    private surveyModel: SurveyModelClass;
    encuestas: Array<SurveyModelClass>
    private respuesta: string;
    private tituloEncuesta:string;

    constructor(private route: ActivatedRoute,surveyService: SurveyService){
        this.surveyService = surveyService;
    }
  
    ngOnInit() {
         this.sub = this.route.params.subscribe(params => {
         this.id = +params['id']; // (+) converts string 'id' to a number
         if (this.id != null)
         {
            this.encuestas = [];
            var parm: string;
            parm = this.id.toString()
            var respuestaServicio = this.surveyService
            this.surveyService.getEncuestasById(parm)
            .subscribe((resp) => {
                let u = resp;
                this.tituloEncuesta = u.tituloEncuesta;
                const surveyModel = new Survey.ReactSurveyModel(u.definicionJSON);
                Survey.SurveyNG.render('surveyElement', { model: surveyModel });
                
                surveyModel.onComplete.add(function(result) {
                    console.log(result.data)
                    var item;
                    var listaRespuestas = [];
                    for (var type in result.data) {
                        item = {};
                        item.codigoPregunta = type;
                        item.descripcionRespuesta = result.data[type];
                        item.idEncuesta = parseInt(parm);
                        listaRespuestas.push(item);
                        // console.log(item);
                    }
                    var salida;
                    salida = {};   
                    salida.listaRespuestas = listaRespuestas; 
                    salida.encuestado = {};
                    
                    salida.encuestado.tiempoRespuesta = "2017-09-26T00:00:50";
                    salida.encuestado.ubicacion = "UTN-FRC";
                
                    // this.respuesta = JSON.stringify(salida);
                    // console.log("respuesta ->" + this.respuesta)
                    respuestaServicio.guardarRespuesta(salida)
                    .subscribe(
                        data => {
                             
                        },
                        error => {
                            
                        });
                    });
              });
             console.log("respuesta ->" + this.respuesta)
            //  this.surveyService.guardarRespuesta()
            
         }
         else{
            alert("else")
         }
         // In a real app: dispatch action to load the details here.
      });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
      }
  

    // selectEncuesta(encuesta){
    //     this.activeEncuesta = encuesta;
    //     console.log(this.activeEncuesta)
    //     this.surveyRender = JSON.parse(this.activeEncuesta.definicion)
    //     console.log(this.surveyRender)
    //     const surveyModel = new Survey.ReactSurveyModel(this.surveyRender);
    //     Survey.SurveyNG.render('surveyElement', { model: surveyModel });
        
    //     surveyModel.onComplete.add(function(result) {
    //         document.querySelector('#surveyResult').innerHTML = "result: " + JSON.stringify(result.data);
    //         console.log(result.data)
    //         }); 
    // }
    
}