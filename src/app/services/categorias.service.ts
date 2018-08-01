import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { environment } from '../../environments/environment'
import 'rxjs';
import { CategoriaModelClass } from '../domain/CategoriaModelClass';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private serverRestAPIUrl: string;

  constructor(private http:Http) { 
    this.serverRestAPIUrl = environment.apiEndPoint + "/api/Categoria";
  }

  getAllCategories(){
    return this.http.get(this.serverRestAPIUrl)
    .map( res => res.json())
  }

  saveCategorie(categoria:CategoriaModelClass){
    let body = JSON.stringify(categoria);
    let headers = new Headers({
      'Content-Type' : 'application/json'
    });

    return this.http.post( this.serverRestAPIUrl, body , {headers} )
      .map( resp => {
        console.log(resp.json());
        return resp.json();
      });
  }
}
