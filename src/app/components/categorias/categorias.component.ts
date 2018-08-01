import { Component, OnInit } from '@angular/core';
import { CategoriasService } from '../../services/categorias.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {

  categorias:any[] = [];

  constructor(private _categoriasService:CategoriasService) {
    this._categoriasService.getAllCategories()
    .subscribe( res => {
      this.categorias = res;
    });
   }

  ngOnInit() {
  }

}
