import { Component, OnInit } from '@angular/core';
import { UserModelClass } from '../../domain/UserModelClass';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    public loggedIn: boolean;
    public isAdmin: boolean;
    currentUser: UserModelClass;

    constructor() { }

    ngOnInit() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (this.currentUser === null || this.currentUser === undefined) {
            this.loggedIn = false;
        } else {
            this.loggedIn = true;
        }

        if (this.currentUser.idUsuario === 25) {
            this.isAdmin = true;
        } else {
            this.isAdmin = false;
        }
    }

}
