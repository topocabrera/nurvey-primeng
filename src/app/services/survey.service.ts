import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { SurveyModelClass } from '../domain/SurveyModelClass';
import { PreguntaModelClass } from '../domain/PreguntaModelClass';
import { environment } from '../../environments/environment';
// import { EncuestaModelClass } from '../models/EncuestaModelClass';

import 'rxjs/add/operator/map';
import { DatePipe } from '../../../node_modules/@angular/common';

@Injectable()
export class SurveyService {
private serverRestAPIUrl: string;
encuestas:any [] = [];
encuestasXusuario:any [] = []; 
currentUser: any; 

constructor( private http:Http) {
    this.serverRestAPIUrl = environment.apiEndPoint + "/api";
}

getEncuestas(){
    return this.http.get(this.serverRestAPIUrl + "/Encuesta")
    .map(res => res.json());
}

getEncuestasById(id: string){
     return this.http.get(this.serverRestAPIUrl + "/Encuesta/idEncuesta/" + id)
     .map(res => res.json());
}

saveSurvey(survey: SurveyModelClass, tituloParm:string) {
    
    interface surveyI {
        title: string;
        pages: string;
    }

    let surveyJson = JSON.stringify(survey)
    // let objSurvey: surveyI = JSON.parse(surveyJson)
    // objSurvey.title = tituloParm

    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    var displayDate = "1/1/0001 12:00:00 AM";
    var publicado = false;
    var estadoEncuesta = "CREADA"

    var surveyModel = new SurveyModelClass()
    surveyModel.inicializate(tituloParm,surveyJson,1,currentUser.idUsuario,displayDate,publicado,estadoEncuesta)

    let surveyJsonToPost = JSON.stringify(surveyModel)
    console.log(surveyJsonToPost)
    let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8','Accept': 'application/json' }); 
    let options = new RequestOptions({
        method: 'POST',
        url: this.serverRestAPIUrl + "/Encuesta",
        headers: headers,
        body: JSON.stringify(surveyModel)
    });

    return this.http.post(this.serverRestAPIUrl + "/Encuesta", surveyJsonToPost, options)
}

guardarRespuesta(parm: any){
    console.log("llega al servicio"+ parm)
    let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8','Accept': 'application/json' }); 
    let options = new RequestOptions({
        method: 'POST',
        url: this.serverRestAPIUrl + "/Respuestas",
        headers: headers,
        body: parm
    });

    return this.http.post(this.serverRestAPIUrl + "/Respuestas", parm, options)
}

getEncuestas_x_Usuario( id ){
    this.encuestas.splice(0,this.encuestas.length);
    return this.http.get(this.serverRestAPIUrl + "/Encuesta/idUsuario/" + id )
        .map((resp:any) => { 
            console.log(resp.json());
            return resp.json() });
}

/**
 * Obtengo las encuestas filtradas por el termino a través de método GET
 * @param termino parametro texto a filtrar
 */
getEncuestaByName(termino:string,id:number){
    this.encuestas.splice(0,this.encuestas.length)
    return this.http.get(this.serverRestAPIUrl + "/Encuesta/idUsuario/" + id )
    .map(resp => {
        // var re = "/"+termino+"/i";
        // var reg = new RegExp(termino,'gi');
        // console.log(reg)
        for (let u of resp.json()) {
            // var resultado = u.tituloEncuesta.search(reg)
            if (u.tituloEncuesta.search(termino) != -1)
            {this.encuestas.push(u);}
            // else {console.log("No coincide termino en titulo" + u.tituloEncuesta + " " +resultado);}
        }
        return this.encuestas;
    });
}

getEncuestaByEstado(estado,id){
    this.encuestas.splice(0)
    return this.http.get(this.serverRestAPIUrl + "/Encuesta/idUsuario/" + id )
    .map(resp => {
        var surveyModel = new SurveyModelClass();
        for (let u of resp.json()) {
            if (u.estadoEncuesta === estado)
            {
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
archivarEncuesta(idEncuesta, idUsuario){
    console.log("IdEncuesta: "+idEncuesta + " IdUsuario: "+idUsuario)
    // let url = this.serverRestAPIUrl + "/Encuesta?estadoEncuesta=archivada&idEncuesta="+idEncuesta+"&idUsuario="+idUsuario;
    let url = this.serverRestAPIUrl + "/Encuesta/actualizarEstado/archivada/"+idEncuesta+"/"+idUsuario;
    let body = "";
    let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8','Accept': 'application/json' }); 
    let options = new RequestOptions({
        method: 'PUT',
        headers: headers
    });
    return this.http.post(url,body,options)
}

/* Devuelve las encuestas del usuario que han sido respondidas.*/
getEncuestasRespondidas( id ){
    this.encuestas.splice(0,this.encuestas.length)
    return this.http.get(this.serverRestAPIUrl + "/Encuesta/idUsuario/" + id )
        .map(resp => {
            for (let u of resp.json()) {
                if (u.estadoEncuesta === "respondida"){
                this.encuestas.push(u)
                }
            }
            return this.encuestas;
          });
}

/* Devuelve las encuentas creadas por el usuario y que no han sido respondidas aun.*/
getEncuestasAbiertas( id ){
    this.encuestas.splice(0,this.encuestas.length)
    return this.http.get(this.serverRestAPIUrl + "/Encuesta/idUsuario/" + id )
        .map(resp => {
            for (let u of resp.json()) {
                if (u.publicado == true){
                this.encuestas.push(u)
                }
            }
            return this.encuestas;
          });
}

/* Devuelve las encuentas en borrador por el usuario, no han sido publicadas ni respondidas aun.*/
getEncuestasEnBorrador( id ){
    this.encuestas.splice(0,this.encuestas.length)
    return this.http.get(this.serverRestAPIUrl + "/Encuesta/idUsuario/" + id )
        .map(resp => {
            for (let u of resp.json()) {
                if (u.publicado == false && u.estadoEncuesta === "creada"){
                this.encuestas.push(u)
                }
            }
            return this.encuestas;
          });
}

/**Devuelve las encuestas del usuario y filtra por los parametros, para cargar la grilla de mis encuestas filtrada. */
getEncuestaPorFiltros(termino:string,estado:string,fecha:string,idUsuario:number){
    let encuestasFiltradas:any[] = [];
    return this.http.get(this.serverRestAPIUrl + "/Encuesta/idUsuario/" + idUsuario )
    .map( (resp:any) => {
        for (let u of resp.json()) {
            var tituloEncuesta = u.tituloEncuesta.toLowerCase();
            termino = termino.toLowerCase();
            var estadoEncuesta = u.estadoEncuesta.toLowerCase();
            estado = estado.toLowerCase();
            // var fechaEncuesta = new DatePipe(u.fechaEncuesta).transform(u.fechaEncuesta,'dd/MM/yyyy');
            // console.log(fechaEncuesta)
            // var fechaEncuestaParm = new DatePipe(fecha).transform(u.fechaEncuesta,'dd/MM/yyyy');
            if (tituloEncuesta.search(termino) > 0 && estadoEncuesta === estado )
            {
                encuestasFiltradas.push(u);
            }
        }
        return encuestasFiltradas;
    });
}

}