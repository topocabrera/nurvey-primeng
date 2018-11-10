import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/map';

export interface ContentToSend {
  destinatarios: string[];
  asunto: string;
  cuerpo: string;
  idUsuario: string;
  idEncuesta: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShareSurveyService {

  private serverRestAPIUrl: string;

  constructor(private http:Http) {
    this.serverRestAPIUrl = environment.apiEndPoint + "/api/ShareSurvey";
   }

   sendEmailsToShareSurvey(destinatarios,asunto,cuerpo,idUsuario,idEncuesta) {
     var contentToSend: ContentToSend = {
       destinatarios: [],
       asunto: '',
       cuerpo: '',
       idUsuario: '',
       idEncuesta: ''
     };

    destinatarios.forEach(element => {
      contentToSend.destinatarios.push(element.value);
    });
    contentToSend.asunto = asunto;
    contentToSend.cuerpo = cuerpo;
    contentToSend.idUsuario = idUsuario;
    contentToSend.idEncuesta = idEncuesta;

    console.log(contentToSend)

    let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8','Accept': 'application/json' }); 
    let options = new RequestOptions({
        method: 'POST',
        url: this.serverRestAPIUrl,
        headers: headers,
        body: JSON.stringify(contentToSend)
    });

    return this.http.post(this.serverRestAPIUrl, JSON.stringify(contentToSend), options)
   }

   getRegistrosEnvioEmails(idUsuario: string){
     return this.http.get(this.serverRestAPIUrl + '/registroEnvioEmails/'+ idUsuario)
        .map(resp => resp);
   }
}
