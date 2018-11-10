import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router'

import * as Survey from 'survey-angular';
import * as jquery from 'jquery';
import 'bootstrap';

import { SurveyService } from './../../services/survey.service';
import { ClienteModelClass } from './../../domain/ClienteModelClass';
import { SurveyModelClass } from './../../domain/SurveyModelClass';
// import { EncuestaModelClass } from './../shared/models/EncuestaModelClass';

declare var require: any

var CryptoJS = require("crypto-js");

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
    tituloEncuesta: string;

    constructor(private route: ActivatedRoute, surveyService: SurveyService) {
        this.surveyService = surveyService;
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id']; // (+) converts string 'id' to a number
            if (this.id != null) {
                //Desencriptado
                var bytes  = CryptoJS.DES.decrypt(this.id.toString(), 'Nurvey123');
                console.log(bytes)
                var plaintext = bytes.toString(CryptoJS.enc.Utf8);
                console.log(plaintext)
                this.id = plaintext;

                this.encuestas = [];
                let parm: string;
                parm = this.id.toString()
                const respuestaServicio = this.surveyService
                this.surveyService.getEncuestasById(parm)
                    .subscribe((resp) => {
                        const u = resp;
                        this.tituloEncuesta = u.tituloEncuesta;
                        const surveyModel = new Survey.ReactSurveyModel(u.definicionJSON);
                        surveyModel.completeText = 'Listo'
                        surveyModel.completedHtml = '<div class="headline-container"><div class="headline">' +
                            '<h3 class="hero-text-2"><span class="fas fa-check"> </span>' +
                            ' Gracias por responder la encuesta.</h3></div></div>' +
                            '<div class="cell-container">' +
                            '<img class="logo-fallback" src="assets/showcase/images/Logo Nurvey FINAL CURVAS-02.png" alt="For Org">' +
                            '<h3 class="topic-title">¿Quieres crear tus propias encuestas?</h3>' +
                            '<p class="hero-subtitle">Regístrate y comienza a generar encuestas para compartir con quien quieras.</p>' +
                            '<a class="large-btn solid-blue-btn" href="/register">Registrarse</a>' +
                            '</div>'
                        Survey.SurveyNG.render('surveyElement', { model: surveyModel });
                        surveyModel.onComplete.add(function (result) {
                            console.log(result.data)
                            let item;
                            const listaRespuestas = [];
                            for (const type in result.data) {
                                if (Array.isArray(result.data[type])) {
                                    for (resp in result.data[type]) {
                                        item = {};
                                        item.codigoPregunta = type;
                                        item.descripcionRespuesta = result.data[type][resp];
                                        item.idEncuesta = parseInt(parm);
                                        listaRespuestas.push(item);
                                    }
                                }
                                else {
                                    item = {};
                                    item.codigoPregunta = type;
                                    item.descripcionRespuesta = result.data[type];
                                    item.idEncuesta = parseInt(parm);
                                    listaRespuestas.push(item);
                                }
                            }
                            let salida;
                            salida = {};
                            salida.listaRespuestas = listaRespuestas;
                            salida.encuestado = {};

                            salida.encuestado.tiempoRespuesta = '2017-09-26T00:00:50';
                            salida.encuestado.ubicacion = 'UTN-FRC';

                            this.respuesta = JSON.stringify(salida);
                            console.log('respuesta ->')
                            console.log(this.respuesta)
                            respuestaServicio.guardarRespuesta(salida)
                                .subscribe(
                                    data => {

                                    },
                                    error => {

                                    });
                        });
                    });
                console.log('respuesta ->' + this.respuesta)
                //  this.surveyService.guardarRespuesta()

            }
            else {
                alert('else')
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
