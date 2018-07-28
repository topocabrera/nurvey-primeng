import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { UserModelClass } from '../domain/UserModelClass';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthenticationService {
    private http: Http;
    private serverRestAPIUrl: string;
    private isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    // private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    /**
     * constructor por parametros
     * this.serverRestAPIUrl contiene la ruta donde se encuentra la api
     * @param http modulo http
     */
    constructor(http: Http) { 
        this.http = http;
        this.serverRestAPIUrl = environment.apiEndPoint + "/api/Usuario/autenticacion/";
    }

    /**
     * loguea el usuario guardandola en la api corespondiente pasandole por parametros email y contraseña
     * Si el usuario es verdadero crea la sesión
     * Sino manda mensaje
     * Ejemplo
     * https://nurvey-back.herokuapp.com/api/Usuario/autenticacion/gaston@gmail.com/123456
     * @param emailUsuario 
     * @param passwordUsuario 
     */
    login(emailUsuario: string, passwordUsuario: string) {
        return this.http.get(this.serverRestAPIUrl + emailUsuario + '/' + passwordUsuario ) 
        .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user.idUsuario != 0) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    let userLogueado = localStorage.getItem('currentUser')
                    console.log(userLogueado)
                    this.isLoggedIn.next(true);
                }
                else
                {
                    alert("Usuario o contraseña incorrectos")
                }

                return user;
            });
    }

    /**
     * Bandera para saber si el usuario esta logueado o no
     */
    public isAuthenticated() {
        return this.isLoggedIn.asObservable();
      }
      
      
    // get isLoggedIn() {
    //     return this.loggedIn.asObservable();
    // }

      /**
       * Deslogueo de usuario borrando la sesion
       */
    logout() {
        // remove user from local storage to log user out
       localStorage.removeItem('currentUser');
       this.isLoggedIn.next(false);
    }
}