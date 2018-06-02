import { Component, OnInit, Renderer, ViewChild, ElementRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AuthenticationService } from '../../services/authentication.service'
import { UserModelClass } from '../../domain/UserModelClass';
import { UserService } from '../../services/index';
import { Observable } from 'rxjs/Observable';

@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html',
    styleUrls: ['./navbar.css']
})

export class NavbarComponent implements OnInit {
    private listTitles: any[];
    location: Location;
    private nativeElement: Node;
    private toggleButton;
    private sidebarVisible: boolean;

    @Input() currentUser: UserModelClass;

    public loggedIn: boolean;
    model: any = {};

    @ViewChild("navbar-cmp") button;

    constructor(location: Location,
        private renderer: Renderer,
        private element: ElementRef,
        private userService: UserService,
        private authenticationService: AuthenticationService) {
        this.location = location;
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
    }

    ngOnInit() {
        var navbar: HTMLElement = this.element.nativeElement;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));


        if (this.currentUser === null || this.currentUser === undefined) {
            this.loggedIn = false;
        } else {
            this.loggedIn = true;
        }
    }

    login() {

        this.authenticationService.login(this.currentUser.emailUsuario, this.currentUser.passwordUsuario)
    }

    salir() {
        this.authenticationService.logout();
        localStorage.removeItem('currentUser');
    }

    sidebarToggle() {
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];

        if (this.sidebarVisible == false) {
            setTimeout(function () {
                toggleButton.classList.add('toggled');
            }, 500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
        }
    }
}
