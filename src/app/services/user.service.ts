import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions,RequestMethod, Response } from '@angular/http';

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
        return this.http.get(this.serverRestAPIUrl + '/Usuario')
        .map((response: Response) => response.json());
    }

    getByid(idUsuario: string) {
        return this.http.get(this.serverRestAPIUrl + '/Usuario/idUsuario/' + idUsuario)
        .map((response: Response) => response.json());
    }

    /**El segundo parametro password se envia nulo, validamos que el usuario a registrarse su mail no exista. */
    getByEmail(emailUsuario: string) {
        let parNull = null
        return this.http.get(this.serverRestAPIUrl + '/Usuario/autenticacion/' + emailUsuario + '/' + parNull)
        .map((response: Response) => response);
    }

    create(user: UserModelClass){
        let userJson = JSON.stringify(user)
        console.log(userJson);
        //let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8','Accept': 'application/json' }); 
        let headers = new Headers({ 'Content-Type': 'application/json; charset=UTF-8','Accept': 'application/json' });
        let options = new RequestOptions( {method: RequestMethod.Post, headers: headers });

        // let body = this.serializeObj(user);

        // let options = new RequestOptions({
        //     method: 'POST',
        //     url: this.serverRestAPIUrl + '/Usuario',
        //     headers: headers,
        //     body: JSON.stringify(user)
        //  });
         return this.http.post(this.serverRestAPIUrl + '/Usuario', userJson, options)
    }

    private serializeObj(obj) {
        var result = [];
        for (var property in obj)
            result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
    
        return result.join("&");
    }

    update(user: UserModelClass) {
        let userJson = JSON.stringify(user)
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8','Accept': 'application/json' }); 
        let options = new RequestOptions({
           method: 'PUT',
           url: this.serverRestAPIUrl + '/Usuario',
           headers: headers,
           body: JSON.stringify(user)});
        return this.http.put(this.serverRestAPIUrl + '/Usuario', userJson, options)
            .map(res => res);
    }

    delete(idUsuario: string) {
        return this.http.delete(this.serverRestAPIUrl + '/Usuario/idUsuario/' + idUsuario);
    }
}