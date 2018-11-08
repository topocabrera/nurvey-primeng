import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router'
import * as Survey from 'survey-angular';
import * as SurveyEditor from 'surveyjs-editor';
import { SurveyService } from './../../services/survey.service';
import { SurveyModelClass } from './../../domain/SurveyModelClass';
import { AlertService } from './../../services/index';

declare var $:any;
declare var require: any
declare let routerAlert: Router;

var CryptoJS = require("crypto-js");

@Component({
    selector: 'misEncuestas',
    templateUrl: './misencuestas.component.html',
    styleUrls: ['./misencuestas.component.css']
})


export class misEncuestasComponent implements OnInit {
    surveyRender: object;
    encuestas:SurveyModelClass[] = [];
    activeEncuesta;
    encuestaActiva: boolean;
    surveyService: SurveyService;
    testSurveyModel: SurveyEditor.SurveyEditor;
    currentUser:any = JSON.parse(localStorage.getItem('currentUser'));
    loading:boolean;
    mensajeAlert:string;
    estiloAlert:string;
    muestraMensajeToast: boolean;
    mensajeToast: string;
    tituloVistaPrevia: string;
    p: number = 1;
    itemsPerPage: number = 10;
    url: string;
    idEncuestaShare: number;

    encuesta = { 
        estadoEncuesta:"" 
    } 
 
    estados = [ 
        { 
            codigo: "CRE", 
            descripcion: "creada" 
        }, 
        { 
            codigo: "ARC", 
            descripcion: "archivada" 
        }, 
        { 
            codigo: "RES", 
            descripcion: "respondida" 
        }] 

    constructor(private _surveyService: SurveyService, 
                private router: Router,
                private alertService: AlertService,
                private route: ActivatedRoute,
                routerAlert: Router){
           this.loading = true;
           this.alertService = alertService;
           routerAlert = routerAlert;
    }

    /** 
     * Inicializacion de pantalla: 
     * Carga de encuestas por usuario  
     * Seteo de encuesta como NO SELECCIONADA 
     */ 
    ngOnInit() { 
        this.loadEncuestas(); 
        this.encuestaActiva = false; 
    } 


    /** 
     * Cargar encuestas por usuarios 
     */ 
    loadEncuestas(){ 
        this._surveyService.getEncuestas_x_Usuario(this.currentUser.idUsuario) 
          .subscribe(resp => {
            this.encuestas = resp;
            this.loading = false;
          }); 
    } 

    /** 
     * Busqueda de encuestas por titulo 
     */ 
    buscarEncuestas(termino:string,estado:string,fecha:string){
        console.log(termino+" "+estado+" "+fecha)
        this.loading = true;
        this.encuestas.splice(0,this.encuestas.length)
        var codigoFiltro:string="";
        if(termino==="" && estado===""){
            this._surveyService.getEncuestas_x_Usuario(this.currentUser.idUsuario) 
            .subscribe(resp => {
              this.encuestas = resp;
              this.loading = false;
            }); 
        }else{
            if(termino!="" && estado != ""){codigoFiltro="1"} //busca por termino y estado
            if(termino!="" && estado === ""){codigoFiltro="2"}//busca por termino
            if(termino==="" && estado != ""){codigoFiltro="3"}//busca por estado
        this._surveyService.getEncuestaPorFiltros(termino,estado,fecha,this.currentUser.idUsuario,codigoFiltro)
            .subscribe( (resp:any) => {
                console.log(resp)
                this.encuestas = resp;
                this.loading = false;
                if(this.encuestas.length === 0){
                    this.mensajeAlert = "No se registran encuestas con los filtros seleccionados."
                    // this.estiloAlert = "alert-warning"
                }
            });
        }
    } 

    /**
     * Mostrar vista previa de la encuesta creada.
     * @param encuesta encuesta seleccionada en la grilla
     */
    selectEncuesta(encuesta){
        this.activeEncuesta = encuesta;
        this.encuestaActiva = true;
        console.log(this.activeEncuesta)
        this.surveyRender = JSON.parse(this.activeEncuesta.definicionJSON) 
        console.log(this.surveyRender)
        const surveyModel = new Survey.ReactSurveyModel(this.surveyRender);

        Survey.SurveyNG.render('surveyElement', { model: surveyModel });

        surveyModel.onComplete.add(function(result) {
            document.querySelector('#surveyResult').innerHTML = "result: " + JSON.stringify(result.data);
            console.log(result.data)
            });
    }


    /** 
     * Ejecuta evento al seleccionar un estado del combobox.
     */ 
    selectEstado(estadoEncuesta){
        if (estadoEncuesta !== undefined)
        {
            for (var index = 0; index < this.estados.length; index++) 
            {
                if (this.estados[index].codigo === estadoEncuesta)
                {
                var descripcion = this.estados[index].descripcion;
                }
            } 
            this._surveyService.getEncuestaByEstado(descripcion,this.currentUser.idUsuario) 
            .subscribe(); 
        }
    }    

     /** 
     * Mediante el servicio surveyService.archivarEncuesta permite modificar el estado de la encuesta a ARCHIVADA 
     * @param idEncuesta id de Encuesta 
     */ 
    archivarEncuesta(idEncuesta,i){ 
        var index = this.absoluteIndex(i);
        let idUsuario = this.currentUser.idUsuario; 
        if(this.encuestas[index].estadoEncuesta != "archivada"){
            this.alertService.confirm(
            'Archivar encuesta.',
            '¿ Desea archivar la encuesta "'+ this.encuestas[index].tituloEncuesta +'" ?',
            () => {
                this._surveyService.archivarEncuesta(idEncuesta,idUsuario) 
                .subscribe( 
                    res => { 
                        this.encuestas[index].estadoEncuesta = "archivada";
                    }
                )
            },
            () => {/*no hay accion al cancelar*/},
            'La encuesta ha sido archivada.');
        }else{
            this.alertService.warning("La encuesta ya está archivada.");
        }
    }

    /**
     * Redirije a pantalla de estadisticas de la encuesta seleccionada.
     * @param idEncuesta id de Encuesta
     */
    verEstadisticas(idEncuesta,i){
        var index = this.absoluteIndex(i);
        if(this.encuestas[index].estadoEncuesta === "respondida"){
            this.router.navigate(["dashboard/"+idEncuesta]); 
        }else {
            this.alertService.warning("La encuesta se encuentra en estado "+ this.encuestas[index].estadoEncuesta);
        }
    }

    /**
     * Redirije a pantalla de respuesta de la encuesta seleccionada.
     * @param idEncuesta id de Encuesta
     */
    responderEncuesta(idEncuesta,i){
        var index = this.absoluteIndex(i);
        this.idEncuestaShare = idEncuesta;
        var ciphertext = CryptoJS.DES.encrypt(idEncuesta.toString(), 'Nurvey123');
        this.url = 'https://nurvey-front-dev.herokuapp.com/respuesta/'+ciphertext.toString();

        // var bytes  = CryptoJS.Rabbit.decrypt(ciphertext.toString(), 'Nurvey123');
        // var plaintext = bytes.toString(CryptoJS.enc.Utf8);
        // console.log(plaintext);
        // if(this.encuestas[index].estadoEncuesta === "creada" || this.encuestas[index].estadoEncuesta === "respondida"){
        //     // this.alertService.confirm('Compartir respuestas.',
        //     // '¿ Desea iniciar la encuesta "'+ this.encuestas[i].tituloEncuesta +'" en estado de "Respondido" ?',
        //     // () => {this.router.navigate(["respuesta/"+idEncuesta]);},
        //     // () => {/*no hay accion al cancelar*/}, http://localhost:4200/respuesta/'+idEncuesta+'
        //     // 'La encuesta ha comenzado su estado de "Respondido".');
        //     this.alertService.shareModal('Compartir respuestas', '<hr/> URL: <a target="_blank" rel="noopener noreferrer" href="http://localhost:4200/respuesta/'+idEncuesta+'">http://localhost:4200/respuesta/'+idEncuesta+
        //                                  '</a><br/><hr/><button type="button" onclick="share()" class="btn btn-default">Via Email</button>');
        // }else {
        //     this.alertService.warning("La encuesta se encuentra en estado "+ this.encuestas[index].estadoEncuesta);
        // }
    }

    share(idEncuesta){
        this.router.navigate(["sharesurvey/"+idEncuesta]);
    }

    /**
     * Redirije a pantalla de editor de encuesta con la encuesta seleccionada como plantilla base 
     * para modificar su contenido y crear una nueva encuesta
     * @param idEncuesta id de Encuesta
     */
    clonarEncuesta(idEncuesta,i){
        var index = this.absoluteIndex(i);
        this.alertService.confirm('Duplicado de encuesta.',
        '¿ Desea duplicar la encuesta "'+ this.encuestas[index].tituloEncuesta +'" ?',
        () => {this.router.navigate(["editor/"+idEncuesta]);},
        () => {/*no hay accion al cancelar*/},
        'Se ha duplicado la encuesta.');
    }

    vistaPrevia(encuesta){
        console.log(encuesta)
        this.tituloVistaPrevia = encuesta.tituloEncuesta;
        var editorOptions = {
            showEmbededSurveyTab: false, 
            showJSONEditorTab: false,
            showApplyButtonInEditors: false
        };
        this.testSurveyModel = new SurveyEditor.SurveyEditor('surveyContainerInPopup',editorOptions);
        this.testSurveyModel.text = encuesta.definicionJSON;
        this.testSurveyModel.showTestSurvey();
        var x = document.getElementsByClassName('nav-item');
        for(var i=0, len=x.length; i<len; i++)
            { x[i].remove(); }
    }

    absoluteIndex(indexOnPage: number): number {
        return this.itemsPerPage * (this.p - 1) + indexOnPage;
      }

    copyClipboard() {
        /* Get the text field */
        var copyText = document.getElementById("modalSurveySubtitle");

        /* Copy the text inside the text field */
        document.execCommand("copy");
    }
}