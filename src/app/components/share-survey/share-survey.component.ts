import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SurveyService } from './../../services/survey.service';
import { AlertService } from './../../services/alert.service';
import { ShareSurveyService } from './../../services/share-survey.service';

declare var require: any
var CryptoJS = require("crypto-js");

@Component({
  selector: 'app-share-survey',
  templateUrl: './share-survey.component.html',
  styleUrls: ['./share-survey.component.css']
})
export class ShareSurveyComponent implements OnInit {
  private sub: any;
  htmlContent: string;
  asunto: string;
  destinatarios: string[];
  idEncuesta: string;
  titulo: string;
  urlEncuesta: string;
  currentUser:any = JSON.parse(localStorage.getItem('currentUser'));
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private surveyService: SurveyService,
    private alertService: AlertService,
    private shareSurveyService: ShareSurveyService
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(async params => {
      await this.surveyService.getEncuestasById(params['id'])
        .subscribe(res => {
          console.log(res)
          this.idEncuesta = params['id'];
          this.titulo = res.tituloEncuesta;
          var ciphertext = CryptoJS.DES.encrypt(this.idEncuesta.toString(), 'Nurvey123');
          this.urlEncuesta = 'https://nurvey-front-dev.herokuapp.com/respuesta/' + ciphertext.toString();

          this.htmlContent = '<body>' +
            '<div style=\'width: 100%; background-color: #00bf6f; display: table; margin: 0 auto; padding: 36px 0; text-align: center;\'>' +

            '<h1 style=\'text-align: center; color: #fff; display: table-cell; line-height: 3.625rem; vertical-align: middle;\'>' + this.titulo + '</h1></div>' +

            '<p style=\'text-align: center;\'><span style=\'color: rgb(102, 102, 102); font-family: Roboto, RobotoDraft, Helvetica, Arial, sans-serif; font-size: 13px; ' +

            'text-align: center; background-color: rgb(255, 255, 255);\'>Estamos realizando una encuesta y su respuesta nos resultar&aacute; de gran valor. Haga clic en el ' +

            'bot&oacute;n de abajo para comenzar la encuesta. Agradecemos su participaci&oacute;n.</span></p>' +

            '<p style=\'text-align: center;\'><span style=\'color: rgb(102, 102, 102); font-family: Roboto, RobotoDraft, Helvetica, Arial, sans-serif; font-size: 13px; text-align: center; ' +

            'background-color: rgb(255, 255, 255);\'><a href=\'' + this.urlEncuesta + '\' target=\'_blank\' style=\'background-color: #0069d9; text-decoration:none; font-size: 16px; ' +

            'display: inline-block; text-align: center; color: white; padding: .5rem 1rem; line-height: 1.5; border-radius: .3rem; border: none;\'>Comenzar la encuesta</a></span></p>' +

            '<p style=\'text-align: center;\'><span style=\'font-size:11px;\'><span style=\'color: rgb(102, 102, 102); font-family: Roboto, RobotoDraft, Helvetica, Arial, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);\'>No reenv&iacute;es este correo electr&oacute;nico ya que el enlace de la encuesta es exclusivo para ti.&nbsp;</span></span></p>' +

            '<p style=\'text-align: center;\'><span style=\'font-size:11px;\'>Desarrollado por Nurvey</span></p>' +

            '</body>'
        });
    });
  }

  enviar() {
    if (this.destinatarios && this.asunto) {
      this.shareSurveyService.sendEmailsToShareSurvey(this.destinatarios, this.asunto, this.htmlContent, this.currentUser.idUsuario, this.idEncuesta)
        .subscribe(res => {
          if(res.status===200)
          {
            this.alertService.alert("La encuesta "+this.titulo+" ha sido enviada exitosamente. Aquí puede hacer un seguimiento del envío y sus respuestas.");
            this.router.navigate(['registroenvios']); 
          }
        },
        error => {
          this.alertService.error(error);
        });
    }
    else {
      this.alertService.alert('Debe ingresar Destinatarios y Asunto.')
    }
  }

  validarFormatoEmail(emailParam) {
    const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const re = new RegExp(EMAIL_REGEXP);

    if (!re.test(emailParam.value)) {
      return {
        'validarFormatoEmail@': true
      };
    }

    return null;
  }

  public validators = [this.validarFormatoEmail];

  public errorMessages = {
    'validarFormatoEmail@': 'Debe ser una dirección de correo válida'
  };

}
