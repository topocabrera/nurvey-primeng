import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router'

import { UserService } from '../../services/user.service';
import { UserModelClass } from '../../domain/UserModelClass';



@Component({
    selector: 'misUsuarios',
    templateUrl: './misusuarios.component.html',
    styleUrls: ['./misusuarios.component.css']
})
export class misUsuariosComponent implements OnInit {
    userService: UserService;
    users: UserModelClass[] = [];
    usersFiltrados: UserModelClass[] = [];
    currentUser: any = JSON.parse(localStorage.getItem('currentUser'));

    constructor(userService: UserService, private router: Router) {
        this.userService = userService
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    /** 
     * Inicializacion de pantalla: 
     * Carga de encuestas por usuario  
     * Seteo de encuesta como NO SELECCIONADA 
     */
    ngOnInit() {
        this.loadUsuarios();

    }

    /**
     * Cargar encuestas por usuarios
     */
    loadUsuarios() {
        this.userService.getAll().subscribe(users => {
            this.users = users;
            this.buscarUsuarios();
        });
    }

    buscarUsuarios() {
        this.usersFiltrados = [];
        this.users.forEach(user => {
            var busqueda = $("#nombre").val().toString().toLowerCase();
            if (user.nombreUsuario.toLowerCase().includes(busqueda)) {
                if (new Date(user.fechaAlta) < new Date('2001-01-01T00:00:00')) {
                    user.fechaAlta = null;
                }

                if (new Date(user.ultimaEncuesta) < new Date('2001-01-01T00:00:00')) {
                    user.ultimaEncuesta = null;
                }
                this.usersFiltrados.push(user);
                //console.log(this.usersFiltrados);
            }
        });

    }

}