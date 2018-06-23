import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { HttpClient} from '@angular/common/http';
import { SurveyModelClass } from '../domain/SurveyModelClass';
// import { PreguntaModelClass } from '../models/PreguntaModelClass';
import { environment } from '../../environments/environment';
// import { EncuestaModelClass } from '../models/EncuestaModelClass';

import 'rxjs/add/operator/map';

//const SERVER_REST_API_URL = 'http://localhost:3000/surveys/';

@Injectable()
export class SurveyService {
    private serverRestAPIUrl: string;
    encuestas: any[] = [];
    encuestasXusuario: any[] = [];
    currentUser: any;

    constructor(private http: Http, private httpClient: HttpClient) {
        this.serverRestAPIUrl = environment.apiEndPoint + '/api';
    }

    getEncuestas() {
        return this.http.get(this.serverRestAPIUrl + '/Encuesta')
            .map(res => res.json());
    }

    getEncuestasById(id: string) {
        return this.http.get(this.serverRestAPIUrl + '/Encuesta/idEncuesta/' + id)
            .map(res => res.json());
    }

    saveSurvey(survey: SurveyModelClass, tituloParm: string) {

        interface surveyI {
            title: string;
            pages: string;
        }

        let surveyJson = JSON.stringify(survey)
        // let objSurvey: surveyI = JSON.parse(surveyJson)
        // objSurvey.title = tituloParm

        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        var displayDate = new Date().toLocaleDateString();
        var publicado = false;
        var estadoEncuesta = 'CREADA'

        var surveyModel = new SurveyModelClass()
        surveyModel.inicializate(tituloParm, surveyJson, 1, currentUser.idUsuario, displayDate, publicado, estadoEncuesta)

        let surveyJsonToPost = JSON.stringify(surveyModel)
        console.log(surveyJsonToPost)
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8', 'Accept': 'application/json' });
        let options = new RequestOptions({
            method: 'POST',
            url: this.serverRestAPIUrl + '/Encuesta',
            headers: headers,
            body: JSON.stringify(surveyModel)
        });

        return this.http.post(this.serverRestAPIUrl + '/Encuesta', surveyJsonToPost, options)
    }

    guardarRespuesta(parm: any) {
        console.log('llega al servicio' + parm)
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8', 'Accept': 'application/json' });
        let options = new RequestOptions({
            method: 'POST',
            url: this.serverRestAPIUrl + '/Respuestas',
            headers: headers,
            body: parm
        });

        return this.http.post(this.serverRestAPIUrl + '/Respuestas', parm, options)
    }

    getEncuestas_x_Usuario(id) {
        this.encuestas.splice(0)
        return this.http.get(this.serverRestAPIUrl + '/Encuesta/idUsuario/' + id)
            .map(resp => {
                var surveyModel = new SurveyModelClass();
                for (let u of resp.json()) {
                    this.encuestas.push(u)
                }
            });
    }

    /**
     * Obtengo las encuestas filtradas por el termino a través de método GET
     * @param termino parametro texto a filtrar
     */
    getEncuestaByName(termino, id) {
        // return this.http.get(this.serverRestAPIUrl + '/Encuesta?filtro='+termino)
        this.encuestas.splice(0)
        return this.http.get(this.serverRestAPIUrl + '/Encuesta/idUsuario/' + id)
            .map(resp => {
                var re = '/' + termino + '/i';
                var reg = new RegExp(termino, 'gi');
                var surveyModel = new SurveyModelClass();
                for (let u of resp.json()) {
                    var resultado = u.tituloEncuesta.search(reg)
                    if (u.tituloEncuesta.search(reg) != -1) { this.encuestas.push(u); }
                    else { console.log('No coincide termino en titulo' + u.tituloEncuesta + ' ' + resultado); }
                }
            });
    }

    getEncuestaByEstado(estado, id) {
        this.encuestas.splice(0)
        return this.http.get(this.serverRestAPIUrl + '/Encuesta/idUsuario/' + id)
            .map(resp => {
                var surveyModel = new SurveyModelClass();
                for (let u of resp.json()) {
                    if (u.estadoEncuesta === estado) {
                        this.encuestas.push(u)
                    }
                }
            });
    }

    /**
     * Actualizacion de estado de encuesta a ARCHIVADA a través de método PUT
     * @param idEncuesta id de Encuesta 
     * @param idUsuario id usuario logueado
     */
    archivarEncuesta(idEncuesta, idUsuario) {
        console.log('IdEncuesta: ' + idEncuesta + ' IdUsuario: ' + idUsuario)
        let url = this.serverRestAPIUrl + '/Encuesta?estadoEncuesta=archivada&idEncuesta=' + idEncuesta + '&idUsuario=' + idUsuario;
        let body = '';
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8', 'Accept': 'application/json' });
        let options = new RequestOptions({
            method: 'PUT',
            headers: headers
        });
        return this.http.post(url, body, options)
    }

    // getEncuestasByEstado(estado: string){ 
    //     return this.http.get(this.serverRestAPIUrl + '/Encuesta') 
    //     .map(res => { 
    //         this.encuestas = res.json(); 
    //         this.encuestas.forEach(element => { 
    //             if (element.idUsuario == this.currentUser.idUsuario && element.estadoEncuesta == estado){ 
    //                 for (var index = 0; index < this.encuestasXusuario.length; index++) { 
    //                     var element2 = this.encuestasXusuario[index]; 
    //                     if (element2.idEncuesta !== element.idEncuesta){ 
    //                         this.encuestasXusuario.splice(0); 
    //                         this.encuestasXusuario.push(element); 
    //                     } 
    //                 } 
    //             } 
    //         }); 
    //     }); 
    // }

    getEncuestasRespondidas(id) {
        this.encuestas.splice(0)
        return this.http.get(this.serverRestAPIUrl + '/Encuesta/idUsuario/' + id)
            .map(resp => {
                var surveyModel = new SurveyModelClass();
                for (let u of resp.json()) {
                    if (u.estadoEncuesta === 'respondida') {
                        this.encuestas.push(u)
                    }
                }
            });
    }
}