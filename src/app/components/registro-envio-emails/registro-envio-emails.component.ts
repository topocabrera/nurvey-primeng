import { Component, OnInit } from '@angular/core';
import { ShareSurveyService } from '../../services/share-survey.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-registro-envio-emails',
  templateUrl: './registro-envio-emails.component.html',
  styleUrls: ['./registro-envio-emails.component.css']
})
export class RegistroEnvioEmailsComponent implements OnInit {
  p = 1;
  itemsPerPage = 10;
  currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
  registroEnvioEmail: any[] = [];
  destinatarios: any[] = [];
  isDesktop: boolean;
  isMobile: boolean;

  constructor(private shareSurveyService: ShareSurveyService, private deviceService: DeviceDetectorService,
    private router: Router, ) { }

  ngOnInit() {
    this.isMobile = this.deviceService.isMobile();
    this.isDesktop = this.deviceService.isDesktop();

    this.shareSurveyService.getRegistrosEnvioEmails(this.currentUser.idUsuario)
      .subscribe(res => {
        res.json().forEach(element => {
          this.registroEnvioEmail.push(element);
        });
      })
  }

  verDestinatarios(idRegistro) {
    console.log(idRegistro)
    this.destinatarios = [];
    this.registroEnvioEmail.forEach(element => {
      if (element.idRegistro === idRegistro) {
        this.destinatarios = JSON.parse(element.destinatarios);
      }
    });
  }

  verEstadisticas(idEncuesta) {
    this.router.navigate(['dashboard/' + idEncuesta]);
  }

  absoluteIndex(indexOnPage: number): number {
    return this.itemsPerPage * (this.p - 1) + indexOnPage;
  }

}
