import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { SurveyModelClass } from '../domain/SurveyModelClass';
import { environment } from '../../environments/environment'

import 'rxjs';
import { StringifyOptions } from 'querystring';

@Injectable()
export class ResultadoService {
    private http: Http;
    private serverRestAPIUrl: string;
    respuestasPosibles:any[];
    respuestasPosiblesPreguntaAgrupada:any[]

    constructor(http:Http) {
        this.http = http;
        this.serverRestAPIUrl = environment.apiEndPoint + "/api/Resultados/resultadosGraficos/";
    }


    getResultadosGeneral(idEncuesta: number, idPregunta: number){
        
        return this.http.get(this.serverRestAPIUrl + idEncuesta + "/" + idPregunta )
        .map(res => res.json());    
    }

    getResultadosEncuestasXUsuario(idUsuario: number){
        
        return this.http.get(this.serverRestAPIUrl + idUsuario )
        .map(res => res.json());    
    }

    getRespuestasPosibles(idEncuesta:number, idPregunta:number){        
        this.respuestasPosibles = [];
         
        return this.http.get(environment.apiEndPoint + "/api/Respuestas/"+idEncuesta+"/"+idPregunta)
            .map(resp => {
                for (let u of resp.json()) {                                   
                    this.respuestasPosibles.push(u)
                }                
            });
    }

    getSeparadoPorPreguntaAgrupada(idEncuesta:number, idPregunta:number,idPreguntaAgrupada:number,filtro:string){        
        this.respuestasPosiblesPreguntaAgrupada = [];        
        //console.log(environment.apiEndPoint + "/api/ResultadosPorCorte/"+idEncuesta+"/"+idPregunta+"/"+idPreguntaAgrupada+"/"+filtro);
        return this.http.get(environment.apiEndPoint + "/api/ResultadosPorCorte/"+idEncuesta+"/"+idPregunta+"/"+idPreguntaAgrupada+"/"+filtro)
        .map(res => res.json()); 
    }
}