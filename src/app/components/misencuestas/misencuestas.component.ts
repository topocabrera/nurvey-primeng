import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router'
import * as Survey from 'survey-angular';

import { SurveyService } from './../../services/survey.service';
import { ClienteModelClass } from './../../domain/ClienteModelClass';
import { SurveyModelClass } from './../../domain/SurveyModelClass';
//import { EncuestaModelClass } from './../shared/models/EncuestaModelClass';

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
    // termino:string ="";
    currentUser:any = JSON.parse(localStorage.getItem('currentUser'));
    loading:boolean;
    mensajeAlert:string;
    estiloAlert:string;

    
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
                private router: Router){
           this.loading = true;
        // this.surveyService = SurveyService;
        // this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
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


        // if(termino.length > 0){
        // this._surveyService.getEncuestaByName(termino,this.currentUser.idUsuario)
        // .subscribe( (data:any) => {
        //     console.log(data)
        //     this.encuestas = data;
        //     this.loading = false;
        // });
        // }else{
        //     this.loading = false;
        // }
        
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
    archivarEncuesta(idEncuesta){ 
        let idUsuario = this.currentUser.idUsuario; 
        this._surveyService.archivarEncuesta(idEncuesta,idUsuario) 
            .subscribe( 
                res => { 
                    alert("La encuesta ha sido archivada.") 
                } 
            ) 
    }

    /**
     * Redirije a pantalla de estadisticas de la encuesta seleccionada.
     * @param idEncuesta id de Encuesta
     */
    verEstadisticas(idEncuesta){
        this.router.navigate(["dashboard",idEncuesta]);
    }

    /**
     * Redirije a pantalla de respuesta de la encuesta seleccionada.
     * @param idEncuesta id de Encuesta
     */
    responderEncuesta(idEncuesta){
        this.router.navigate(["respuesta/"+idEncuesta]); 
    }

    /**
     * Redirije a pantalla de editor de encuesta con la encuesta seleccionada como plantilla base 
     * para modificar su contenido y crear una nueva encuesta
     * @param idEncuesta id de Encuesta
     */
    clonarEncuesta(idEncuesta){
        this.router.navigate(["editor/"+idEncuesta]);
    }
    
    
}