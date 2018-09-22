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
    mostrarRangosEdad:boolean;
    extremoSup:number;
    extremoInf:number;
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
  
    public barChartData:any[] = [];

    constructor(private resultadoService: ResultadoService,surveyService: SurveyService){
        this.surveyService = surveyService;
        // this.mostrarDetalleAgrupable = false;
    }
    ngOnInit(){
        this.actualizarGrafico();
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
        });
    }

    verFiltroPor(preguntaAgrupable,idEncuesta,idPregunta){
      this.barChartLabels = [];
      this.barChartData = [];
      this.filtro = [];
      var agruparPor = $("#selectorCorte").val();
      this.actualizarGraficoPreguntaAgrupada(agruparPor,this.idEncuesta,this.idPregunta,preguntaAgrupable[0].idPregunta);
      console.log(preguntaAgrupable)
      console.log(preguntaAgrupable[0].idPregunta)
    }

    seleccionAgrupado(descripcion:string){
      console.log(descripcion)
      if(descripcion === "Sexo"){
        this.filtro.push("Masculino","Femenino")
      }
      if(descripcion === "Edad"){
        this.filtro.push("FiltroEdad1","FiltroEdad2","FiltroEdad3","FiltroEdad4")
      }

    }

    handleChange(descripcion) {
      console.log("Selecciono: "+descripcion)

      // this.mostrarRangosEdad = true;
   }

    actualizarGraficoPreguntaAgrupada(agruparPor,idEncuesta,idPregunta,idPreguntaAgrupable)
    {
    // this.mostrarDetalleAgrupable = !this.mostrarDetalleAgrupable;
    var item4 = 0
    console.log(agruparPor)
    if(agruparPor === "Sexo"){
      this.filtro.push("Masculino","Femenino")
      this.mostrarRangosEdad = false;
      idPreguntaAgrupable = 1
    }
    if(agruparPor === "Edad"){
      this.mostrarRangosEdad = true;
      this.filtro.push("Cantidad");
      // ,"FiltroEdad2","FiltroEdad3","FiltroEdad4"
      idPreguntaAgrupable = 2
    }

    if(agruparPor === "Sexo"){
      for(var item = 0; item < this.filtro.length; item++){
        
        this.resultadoService.getSeparadoPorPreguntaAgrupada(idEncuesta,idPregunta,idPreguntaAgrupable,this.filtro[item])
          .subscribe( (respuestasPosibles:any) => {
            
            var labels:string[] = [];
            var series = [];
            var data = [];
            for(var item2 = 0; item2 < respuestasPosibles.labels.length; item2++){
              labels.push(respuestasPosibles.labels[item2]);    
              var serie = respuestasPosibles.series[item2];
              series.push({value:serie,className:"myclass"+(item2+1), nombre:respuestasPosibles.labels[item2]});
              // data.push(series[item2].value);
            }
            this.barChartLabels = labels;
            // this.barChartData.push({data:data,label:this.filtro});
            var data = [];
            for(var item3 = 0; item3 < series.length; item3++){
              data.push(series[item3].value)
            }
            // console.log(this.filtro[item4])
            this.barChartData.push({data:data,label:this.filtro[item4]})
            console.log(this.barChartData)
            item4 ++;
            this.mostrarDetalleAgrupable = true;
            console.log(this.filtro)
            console.log(series)
            console.log(this.barChartLabels)
            console.log(this.barChartData)
          });
      }
    }else{
      if(agruparPor === "Edad"){
        // for(var item = 0; item < this.filtro.length; item++){
          if(!this.extremoInf){this.extremoInf=18; this.extremoSup=29}
          this.resultadoService.getGraficosRespuestasPorEdad(idEncuesta,idPregunta,this.extremoInf,this.extremoSup)
            .subscribe((respuestasPosibles:any) => {
              console.log(respuestasPosibles)

              var labels:string[] = [];
              var series = [];
              var data = [];
              for(var item2 = 0; item2 < respuestasPosibles.labels.length; item2++){
                labels.push(respuestasPosibles.labels[item2]);    
                var serie = respuestasPosibles.series[item2];
                series.push({value:serie,className:"myclass"+(item2+1), nombre:respuestasPosibles.labels[item2]});
                // data.push(series[item2].value);
              }
              this.barChartLabels = labels;
              // this.barChartData.push({data:data,label:this.filtro});
              var data = [];
              for(var item3 = 0; item3 < series.length; item3++){
                data.push(series[item3].value)
              }
              // console.log(this.filtro[item4])
              this.barChartData.push({data:data,label:this.filtro[item4]})
              console.log(this.barChartData)
              item4 ++;
              this.mostrarDetalleAgrupable = true;
            });
        // }
      }
    }

    //   this.resultadoService.getResultadosGeneral(this.idEncuesta,this.idPregunta)
    // .subscribe((resp) => {        
    //   for(var item = 0; item < resp.labels.length; item++){
    //     this.barChartLabels.push(resp.labels[item]);
    //   }
    // });
        // console.log(this.barChartLabels)
        // console.log(this.barChartData)
        //api/ResultadosPorCorte/59/3/1/Femenino
    }

    valorRandoEdad(rango:string){
      // var radVal = $("input:radio[id=rango]:checked").val();
      console.log(rango)
      this.extremoInf = parseInt(rango.substring(0,2));
      this.extremoSup = parseInt(rango.substring(3,5));
    }
}