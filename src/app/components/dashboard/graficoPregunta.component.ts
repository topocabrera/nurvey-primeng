import { Component, OnInit, Input } from '@angular/core';
import { SurveyService } from './../../services/surveyservice';
import { ResultadoService } from '../../services/resultados.service';
import * as Chartist from 'chartist';

@Component({
    selector: 'grafico-pregunta',
    moduleId: module.id,
    templateUrl: 'graficoPregunta.component.html',
    styleUrls: ['graficoPregunta.component.css']
})

export class GraficoPreguntaComponent implements OnInit{            
    @Input() title: string;
    @Input() idEncuesta: number;
    @Input() idPregunta: number;
    @Input() preguntasAgrupables: any[] = [];
    surveyService: SurveyService;
    resultadoService: ResultadoService;
    labelsGrafico = []; 
    seriesGrafico = [];
    ultimaActualizacion: string;
    cantidadTotalRespuestas : number;
    

    constructor(resultadoService: ResultadoService,surveyService: SurveyService){
        this.surveyService = surveyService;
        this.resultadoService = resultadoService;
    }
    ngOnInit(){
        this.actualizarGrafico();
    }

    actualizarGrafico(){        

//        colorGenerador = 1;
        this.resultadoService.getResultadosGeneral(this.idEncuesta,this.idPregunta)
        .subscribe((resp) => {        
          this.cantidadTotalRespuestas = resp.cantidadTotalRespuestas; 
          this.ultimaActualizacion = resp.ultimaActualizacion;
          for(var item = 0; item < resp.labels.length; item++){
            this.labelsGrafico.push(resp.labels[item]);    
            var serie = resp.series[item];
            this.seriesGrafico.push({value:serie,className:"myclass"+(item+1), nombre:resp.labels[item]});
          }
          
          Chartist.Pie('#chart_'+this.idEncuesta+'_'+this.idPregunta, {            
            series: this.seriesGrafico
          },{
            labelInterpolationFnc: function(value) {
              return value + '%';
            }
          });          
        });

        //this.ultimaActualizacion = new Date().toLocaleString();        

    }

    
}
