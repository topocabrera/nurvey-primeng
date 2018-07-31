import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../../services/survey.service';
import { ResultadoService } from '../../services/resultados.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser:any = JSON.parse(localStorage.getItem('currentUser'));
  cantidadEncuestasAbiertas:number;
  cantidadEncuestasBorrador:number;
  cantidadRespuestas:number;
  encuestas:any[] = [];

  constructor(private _surveyService:SurveyService,
              private _resultadosService:ResultadoService) {
    
    this._surveyService.getEncuestasAbiertas(this.currentUser.idUsuario)
    .subscribe( res => {
      this.cantidadEncuestasAbiertas = res.length
    });

    this._surveyService.getEncuestasEnBorrador(this.currentUser.idUsuario)
    .subscribe( res => {
      this.cantidadEncuestasBorrador = res.length
    });

    this._resultadosService.getCantidadRespuestasXUsuario(this.currentUser.idUsuario)
    .subscribe( res => {
      this.cantidadRespuestas = res
    });

    this._surveyService.getEncuestas_x_Usuario(this.currentUser.idUsuario)
    .subscribe( (res:any) => {
      this.encuestas = res;
    });

   }

  ngOnInit() {
  }

}
