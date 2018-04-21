import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { UserModelClass } from '../domain/UserModelClass';
import { environment } from '../../environments/environment';

@Injectable()
export class UserService {
    private http: Http;
    private serverRestAPIUrl: string;
    currentUser: UserModelClass;

    constructor(http: Http) {
        this.http = http;
        this.serverRestAPIUrl = environment.apiEndPoint + "/api";
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
     }

    getAll() {
        return this.http.get(this.serverRestAPIUrl + '/Usuario').map((response: Response) => response.json());
    }

    getByid(idUsuario: string) {
        return this.http.get(this.serverRestAPIUrl + '/Usuario?idUsuario=' + idUsuario).map((response: Response) => response.json());
    }

    getByEmail(emailUsuario: string) {
        return this.http.get(this.serverRestAPIUrl + '/Usuario?emailUsuario=' + emailUsuario + '&passwordUsuario=')
        .map((response: Response) => response.json());
    }

    create(user: UserModelClass) {
        let userJson = JSON.stringify(user)
       // console.log(userJson);
        let userLog = this.serverRestAPIUrl + '/Usuario?emailUsuario=' + user.emailUsuario + '&passwordUsuario='
         let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8','Accept': 'application/json' }); 
         let options = new RequestOptions({
            method: 'POST',
            url: this.serverRestAPIUrl + '/Usuario',
            headers: headers,
            body: JSON.stringify(user)
         });
         let userLogueado = localStorage.getItem('currentUser')
             console.log(userLogueado);
             return this.http.post(this.serverRestAPIUrl + '/Usuario', userJson, options);
             
        //  if (user.emailUsuario !=  userLog )
        //  {
        //     let userLogueado = localStorage.getItem('currentUser')
        //     console.log(userLogueado);
        //     return this.http.post(this.serverRestAPIUrl + '/Usuario', userJson, options);
        //  }
        //  else
        //  {
        //      alert("Email ya existente")
        //  }
    }

    update(user: UserModelClass) {
        let userJson = JSON.stringify(user)
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8','Accept': 'application/json' }); 
        let options = new RequestOptions({
           method: 'PUT',
          // url: this.serverRestAPIUrl + '/Usuario',
           headers: headers,
          // body: JSON.stringify(userJson)
        });
        console.log(options);
        return this.http.put(this.serverRestAPIUrl + '/Usuario', userJson, options)
            .map(res => res.json());
    }

    delete(idUsuario: string) {
        return this.http.delete(this.serverRestAPIUrl + '/Usuario?idUsuario=' + idUsuario);
    }
}