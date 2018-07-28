import { Component, OnInit, Input } from '@angular/core';
import { SurveyModelClass } from './../../domain/SurveyModelClass';

@Component({
    selector: 'filtrodash',
    moduleId: module.id,
    templateUrl: 'filtrodash.component.html',
    styleUrls: ['filtrodash.component.css']
})

export class FiltrodashComponent implements OnInit{        
    preguntasEncuesta = []; 
    preguntasAgrupables = []; 
    @Input() encuestas: Array<SurveyModelClass>;

    constructor(){
      
    }
    ngOnInit(){        
        console.log(this.encuestas);
        this.preguntasEncuesta.push({id:1,descripcion:"Encuesta 1"});
        this.preguntasEncuesta.push({id:2,descripcion:"Encuesta 2"});
        this.preguntasEncuesta.push({id:3,descripcion:"Encuesta 3"});
        this.preguntasEncuesta.push({id:4,descripcion:"Encuesta 4"});

        this.preguntasAgrupables.push({id:1,descripcion:"Sexo"});
        this.preguntasAgrupables.push({id:2,descripcion:"Edad"});
        this.preguntasAgrupables.push({id:3,descripcion:"Nivel Socio Economico"});        
    }
}
