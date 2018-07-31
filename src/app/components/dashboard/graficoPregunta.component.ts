import { Component, OnInit, Input } from '@angular/core';
import { SurveyService } from './../../services/survey.service';
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
    labelsGrafico = []; 
    seriesGrafico = [];
    ultimaActualizacion: string;
    cantidadTotalRespuestas : number;
    mostrarDetalleAgrupable:boolean;
    filtro:string[] = [];
    // Doughnut
    public doughnutChartLabels:string[] = [];
    public doughnutChartData:number[] = [];
    public doughnutChartType:string = 'doughnut';
    // Bar
    public barChartOptions:any = {
      scaleShowVerticalLines: false,
      responsive: true
    };
    public barChartLabels:string[] = [];
    public barChartType:string = 'bar';
    public barChartLegend:boolean = true;
  
    public barChartData:any[] = [
      // {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
      // {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
    ];

    constructor(private resultadoService: ResultadoService,surveyService: SurveyService){
        this.surveyService = surveyService;
        // this.resultadoService = resultadoService;
        this.mostrarDetalleAgrupable = false;
    }
    ngOnInit(){
        this.actualizarGrafico();
        // console.log(this.barChartData)
    }

    // events
    public chartClicked(e:any):void {
      console.log(e);
    }

    public chartHovered(e:any):void {
      console.log(e);
    }

      // events
    public chartBarClicked(e:any):void {
      console.log(e);
    }

    public chartBarHovered(e:any):void {
      console.log(e);
    }

    actualizarGrafico(){        
        this.resultadoService.getResultadosGeneral(this.idEncuesta,this.idPregunta)
        .subscribe((resp) => {        
          this.cantidadTotalRespuestas = resp.cantidadTotalRespuestas; 
          this.ultimaActualizacion = resp.ultimaActualizacion;
          for(var item = 0; item < resp.labels.length; item++){
            this.labelsGrafico.push(resp.labels[item]);
            var serie = resp.series[item];
            this.seriesGrafico.push({value:serie,className:"myclass"+(item+1), nombre:resp.labels[item]});
          }
          //carga datos para grafico de dona
          this.doughnutChartLabels = this.labelsGrafico; 
          for(var item = 0; item < this.seriesGrafico.length; item++){
            this.doughnutChartData.push(this.seriesGrafico[item].value)
          }
          // console.log("doughnutChartLabels: "+this.doughnutChartLabels)
          // console.log("doughnutChartData: "+this.doughnutChartData)

          // Chartist.Pie('#chart_'+this.idEncuesta+'_'+this.idPregunta, {            
          //   series: this.seriesGrafico
          // },{
          //   labelInterpolationFnc: function(value) {
          //     return value + '%';
          //   }
          // });          
        });

    }

    verFiltroPor(preguntaAgrupable,idEncuesta,idPregunta,agruparPor){
      
      // console.log(idPregunta)
      // console.log(preguntaAgrupable)
      // console.log(agruparPor)
      // for(var i = 0; i < preguntaAgrupable.length; i ++){
      //   var agruparPor = preguntaAgrupable[i].descripcion;
        
      //   var activo = $("#"+agruparPor+"_"+idEncuesta+"_"+idPregunta).is(":visible");
      // if (activo) {
      //   $("#"+agruparPor+"_"+idEncuesta+"_"+idPregunta).hide();
      // }else {        
        
      //   $("#"+agruparPor+"_"+idEncuesta+"_"+idPregunta).show();
      //   $("#"+agruparPor+"_"+idEncuesta+"_"+idPregunta).css("display","block");

    
      //   var idPreguntaAgrupable = preguntaAgrupable[i].idPregunta
        this.actualizarGraficoPreguntaAgrupada(agruparPor,this.idEncuesta,this.idPregunta,preguntaAgrupable[0].idPregunta); 
        //this.actualizarGraficoPreguntaAgrupada(agruparPor,this.idEncuesta,this.idPregunta,idPreguntaAgrupable,this.resultadoService)
        // this.resultadoService.getRespuestasPosibles(idEncuesta,preguntaAgrupable[i].idPregunta)
        // .subscribe((respuestasPosibles:any) => {  
          // console.log("respuestasPosibles: "+respuestasPosibles)
          // preguntaAgrupable.respuestasPosibles = respuestasPosibles;
        //   respuestasPosibles.forEach(element => {      
        //     // console.log(element);                                      
        //     setTimeout(this.actualizarGraficoPreguntaAgrupada, 1000, agruparPor,this.idEncuesta,this.idPregunta,idPreguntaAgrupable,this.resultadoService);     
        //   });
        // });
        //   }
        // }  
    }
    //     console.log(preguntaAgrupable.respuestasPosibles.length);

    //     /**/
        
    
    //   }
    // }

    actualizarGraficoPreguntaAgrupada(agruparPor,idEncuesta,idPregunta,idPreguntaAgrupable)
    {
    //  console.log(this.resultadoService.respuestasPosibles)
    this.mostrarDetalleAgrupable = true;
    var item4 = 0
    if(agruparPor === "Sexo"){
      this.filtro.push("Masculino","Femenino")
    }
    for(var item = 0; item < this.filtro.length; item++){
      
      this.resultadoService.getSeparadoPorPreguntaAgrupada(idEncuesta,idPregunta,idPreguntaAgrupable,this.filtro[item])
        .subscribe( (respuestasPosibles:any) => {
          
          var labels:string[] = [];
          var series = [];

          for(var item2 = 0; item2 < respuestasPosibles.labels.length; item2++){
            labels.push(respuestasPosibles.labels[item2]);    
            var serie = respuestasPosibles.series[item2];
            series.push({value:serie,className:"myclass"+(item2+1), nombre:respuestasPosibles.labels[item2]});
          }
          console.log(labels)
          console.log(series)

          this.barChartLabels = labels; 
          var data = [];
          for(var item3 = 0; item3 < series.length; item3++){
            data.push(series[item3].value)
          }
          console.log(this.filtro[item4])
          this.barChartData.push({data:data,label:this.filtro[item4]})
          item4 ++;
        });
    }
    console.log(this.barChartData)
        //api/ResultadosPorCorte/59/3/1/Femenino
    }
}
    
/*function mostrarAlgo(){
  
this.resultadoService.getRespuestasPosibles(idEncuesta,preguntaAgrupable.idPregunta)
        .subscribe((respuestasPosibles) => { 

        }]
  
  //var seriesGrafico = [];
  
}*/
