import { Component, OnInit, Input, Renderer, ElementRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Location } from '@angular/common';
import { UserModelClass } from './domain/UserModelClass';
import { AuthenticationService } from './services/authentication.service'
import { UserService } from './services/index';
import { Observable } from 'rxjs/Observable';

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
export class AppComponent implements OnInit {

  currentUser: UserModelClass;
  location: Location;
  menuActive: boolean;
  activeMenuId: string;
  notification: boolean = false;
  public loggedIn: boolean;
  public isAdmin: boolean;

  ngOnInit() {
    setTimeout(() => this.notification = true, 1000)
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (this.currentUser === null || this.currentUser === undefined) {
        this.loggedIn = false;
        this.ocultarSideBar();
    } else {
        this.loggedIn = true;
    }

    if (this.currentUser.idUsuario === 25) {
      this.isAdmin = true;
  } else {
      this.isAdmin = false;
  }
  }

  changeTheme(event: Event, theme: string) {
    let themeLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('theme-css');
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

  ocultarSideBar(){
    $(document).ready(function () {
      // $('#sidebarCollapse').on('click', function () {
          $('#sidebar').toggleClass('active');
      // });
  });
  }
}
