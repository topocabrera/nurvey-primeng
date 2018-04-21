import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { NgaModule } from './nga.module';

//import { RegisterComponent } from './register.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
   // NgaModule
  ],
  declarations: [
    //RegisterComponent
  ]
})
export class RegisterModule {}