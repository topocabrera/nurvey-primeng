import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CategoriaModelClass } from '../../domain/CategoriaModelClass';
import { CategoriasService } from '../../services/categorias.service';


@Component({
  selector: 'app-categoria-form',
  templateUrl: './categoria-form.component.html',
  styleUrls: ['./categoria-form.component.css']
})
export class CategoriaFormComponent implements OnInit {

  categoria:CategoriaModelClass = new CategoriaModelClass();

  constructor(private _categoriaService:CategoriasService) {}

  ngOnInit() {
  }

  confirmar(){
    this._categoriaService.saveCategorie( this.categoria )
    .subscribe( resp => {
      console.log(resp);
    });
  }
}
