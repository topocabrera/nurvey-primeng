// import {Component, OnInit} from '@angular/core';
// import { Car } from './domain/car';
// import { CarService} from './services/carservice'

import { Component, OnInit } from '@angular/core';
import {trigger,state,style,transition,animate} from '@angular/animations';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    animations: [
        trigger('overlayState', [
            state('hidden', style({
                opacity: 0
            })),
            state('visible', style({
                opacity: 1
            })),
            transition('visible => hidden', animate('400ms ease-in')),
            transition('hidden => visible', animate('400ms ease-out'))
        ]),
    
        trigger('notificationTopbar', [
          state('hidden', style({
            height: '0',
            opacity: 0
          })),
          state('visible', style({
            height: '*',
            opacity: 1
          })),
          transition('visible => hidden', animate('400ms ease-in')),
          transition('hidden => visible', animate('400ms ease-out'))
        ])
    ],
  })
  export class AppComponent implements OnInit{
      
      menuActive: boolean;
      
      activeMenuId: string;
      
      notification: boolean = false;
      
      ngOnInit() {
        setTimeout(()=>this.notification = true , 1000)
      }
      
      changeTheme(event: Event, theme: string) {
          let themeLink: HTMLLinkElement = <HTMLLinkElement> document.getElementById('theme-css');
          themeLink.href = 'assets/components/themes/' + theme + '/theme.css';
          event.preventDefault();
      }
      
      onMenuButtonClick(event: Event) {
          this.menuActive = !this.menuActive;
          event.preventDefault();
      }
      
      closeNotification(event) {
        this.notification = false;
        event.preventDefault();
      }
  }
  

// @Component({
//     selector: 'app-root',
//     templateUrl: './app.component.html',
//     styleUrls: ['./app.component.css'],
//     providers: [CarService]
// })
// export class AppComponent implements OnInit{
    
//     displayDialog: boolean;
    
//     car: Car = new PrimeCar();
    
//     selectedCar: Car;
    
//     newCar: boolean;
    
//     cars: Car[];

//     cols: any[];
    
//     constructor(private carService: CarService) { }
    
//     ngOnInit() {
//         this.carService.getCarsSmall().then(cars => this.cars = cars);

//         this.cols = [
//             { field: 'vin', header: 'Vin' },
//             { field: 'year', header: 'Year' },
//             { field: 'brand', header: 'Brand' },
//             { field: 'color', header: 'Color' }
//         ];
//     }
    
//     showDialogToAdd() {
//         this.newCar = true;
//         this.car = new PrimeCar();
//         this.displayDialog = true;
//     }
    
//     save() {
//         const cars = [...this.cars];
//         if (this.newCar) {
//             cars.push(this.car);
//         } else {
//             cars[this.findSelectedCarIndex()] = this.car;
//         }
//         this.cars = cars;
//         this.car = null;
//         this.displayDialog = false;
//     }
    
//     delete() {
//         const index = this.findSelectedCarIndex();
//         this.cars = this.cars.filter((val, i) => i != index);
//         this.car = null;
//         this.displayDialog = false;
//     }
    
//     onRowSelect(event) {
//         this.newCar = false;
//         this.car = this.cloneCar(event.data);
//         this.displayDialog = true;
//     }
    
//     cloneCar(c: Car): Car {
//         const car = new PrimeCar();
//         for (const prop in c) {
//             car[prop] = c[prop];
//         }
//         return car;
//     }
    
//     findSelectedCarIndex(): number {
//         return this.cars.indexOf(this.selectedCar);
//     }
// }

// export class PrimeCar implements Car {
    
//     constructor(public vin?, public year?, public brand?, public color?) {}
// }
