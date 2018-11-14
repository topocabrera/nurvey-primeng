import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BloquePreguntasService {
  private http: Http;
  private serverRestAPIUrl: string;

  constructor(http: Http) {
      this.http = http;
      this.serverRestAPIUrl = environment.apiEndPoint + "/api/BloquePreguntas";
   }

  getAllBloquePreguntas() {
    return this.http.get(this.serverRestAPIUrl)
      .map((response: Response) => response.json());
  }
}