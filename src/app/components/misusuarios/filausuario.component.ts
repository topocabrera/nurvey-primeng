import { Component, Input, OnInit } from '@angular/core';

import { UserModelClass } from '../../domain/UserModelClass';
import { ResultadoService } from '../../services/resultados.service';

@Component({
    selector: 'filaUsuario',
    templateUrl: './filausuario.component.html'
})
export class filaUsuarioComponent implements OnInit {
    @Input() i: number;
    n: number;
    @Input() usuario: UserModelClass;
    resultadoService: ResultadoService;
    mostrarGrafico: boolean;
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabels: string[] = [];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;
    public barChartData: any[] = [];

    constructor(resultadoService: ResultadoService) {
        this.mostrarGrafico = false;
        this.resultadoService = resultadoService;
    }

    // events
    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }

    ngOnInit() {
        this.n = Number(this.i) + 1;
    }

     toggleGrafico() {
        this.mostrarGrafico = !this.mostrarGrafico;
        this.barChartLabels = [];
        this.barChartData = [];
        this.resultadoService.getResultadosEncuestasXUsuario(this.usuario.idUsuario)
        .subscribe((resp) => {
            const yearMonth: string[] = [];
                for (let item = 0; item < resp.labels.length; item++) {
                    yearMonth.push(resp.labels[item]);
                }
                this.barChartLabels = yearMonth;
                    const serie = resp.series;
                     this.barChartData.push({data: serie, label: 'Serie'});
             });
     }
}
