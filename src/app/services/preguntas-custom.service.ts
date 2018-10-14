import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { UserModelClass } from '../domain/UserModelClass';
import { PreguntasCustomModelClass } from '../domain/PreguntasCustomModelClass';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PreguntasCustomService {
    private http: Http;
    private serverRestAPIUrl: string;
    currentUser: UserModelClass;

    constructor(http: Http) {
        this.http = http;
        this.serverRestAPIUrl = environment.apiEndPoint + "/api/PreguntasCustom";
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
     }

     addCustomQuestions( customQuestions: PreguntasCustomModelClass ) {
      let customQuestionBody = JSON.stringify(customQuestions);
      console.log(customQuestionBody)
      let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8','Accept': 'application/json' }); 
      let options = new RequestOptions({
         method: 'POST',
         url: this.serverRestAPIUrl,
         headers: headers,
         body: customQuestionBody 
      });
      return this.http.post(options.url, customQuestionBody, options)
          .map( res => { return res.json() }); 
  }

  getCustomQuestions(idUsuario: string) {
      return this.http.get(this.serverRestAPIUrl + '/idUsuario/' + idUsuario)
        .map((response: Response) => response);
  }
}
