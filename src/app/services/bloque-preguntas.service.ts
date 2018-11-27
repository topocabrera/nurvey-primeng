import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { environment } from '../../environments/environment';
import { BloquePreguntasModelClass } from '../domain/BloquePreguntasModelClass';
import { SurveyJSCustomQuestionsModelClass } from '../domain/SurveyJSCustomQuestionsModelClass';

@Injectable({
  providedIn: 'root'
})
export class BloquePreguntasService {
  private http: Http;
  private serverRestAPIUrl: string;
  bloquePreguntas: BloquePreguntasModelClass;
  plantillaEditor: SurveyJSCustomQuestionsModelClass;

  constructor(http: Http) {
      this.http = http;
      this.serverRestAPIUrl = environment.apiEndPoint + "/api/BloquePreguntas";
   }

  getAllBloquePreguntas() {
    var contenido
    var plantillas:any = [];
    
    return this.http.get(this.serverRestAPIUrl)
      .map((response: Response) => {
       response.json().forEach(element => {
        this.plantillaEditor = new SurveyJSCustomQuestionsModelClass();
         contenido = JSON.parse(element.contenidoBloque)
         this.plantillaEditor.title = contenido.title
         this.plantillaEditor.name = contenido.name
         this.plantillaEditor.json = contenido
         this.plantillaEditor.category = 'nurvey'
         plantillas.push(this.plantillaEditor)
       });
       return plantillas
      });
  }

  postBloquePreguntas(bloquePregunta) {
    console.log(bloquePregunta)
    this.bloquePreguntas = new BloquePreguntasModelClass();
    this.bloquePreguntas.contenidoBloque = bloquePregunta;
    var postContent = JSON.stringify(this.bloquePreguntas);
    console.log(postContent)
    let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8','Accept': 'application/json' }); 
    let options = new RequestOptions({
        method: 'POST',
        url: this.serverRestAPIUrl,
        headers: headers,
        body: postContent
    });

    return this.http.post(this.serverRestAPIUrl, postContent, options)
  }

  getBloquePreguntasById(id) {
    return this.http.get(this.serverRestAPIUrl + '/idBloque/'+ id)
      .map((response: Response) => response.json());
  }
}