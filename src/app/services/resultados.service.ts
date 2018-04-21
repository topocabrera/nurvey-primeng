import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { SurveyModelClass } from '../domain/SurveyModelClass';
import { environment } from '../../environments/environment'

import 'rxjs';

const SERVER_REST_API_URL = "http://localhost:3000/surveys/";

@Injectable()
export class ResultadoService {
    private http: Http;
    private serverRestAPIUrl: string;

    constructor(http:Http) {
        this.http = http;
        this.serverRestAPIUrl = environment.apiEndPoint + "/api";
    }


    getResultadosGeneral(idEncuesta: number, idPregunta: number){
        
        return this.http.get(this.serverRestAPIUrl + "/Resultados?idEncuesta="+idEncuesta+"&idPregunta="+idPregunta)
        .map(res => res.json());    
    }

    getResultadosEncuestasXUsuario(idUsuario: number){
        
        return this.http.get(this.serverRestAPIUrl + "/Resultados?idUsuario="+idUsuario)
        .map(res => res.json());    
    }

}