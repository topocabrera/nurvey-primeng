import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModelClass } from '../../domain/UserModelClass';
import { UserService } from '../../services/user.service';
import { FormGroup, AbstractControl, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator } from '../register/validators';
import { TabViewModule } from 'primeng/tabview';
import { PanelModule } from 'primeng/panel';

@Component({
    selector: 'user-cmp',
    moduleId: module.id,
    templateUrl: 'user.component.html',
    styleUrls: ['./card.css']
})

export class UserComponent {

    currentUser: UserModelClass;
    users: UserModelClass[] = [];
    model: any = {};
    public name: AbstractControl;
    public email: AbstractControl;
    public form: FormGroup;

    constructor(private router: Router,
        private userService: UserService,
        fb: FormBuilder) {
        this.form = fb.group({
            'name': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            'email': ['', Validators.compose([Validators.required, EmailValidator.validate])]
        });
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.model = this.currentUser;
    }

    actualizar() {
        const usuarioMod = new UserModelClass(
            this.currentUser.idUsuario,
            this.model.nombreUsuario,
            this.model.emailUsuario,
            this.currentUser.passwordUsuario,
            this.currentUser.fechaAlta,
            this.currentUser.ultimaEncuesta,
            this.currentUser.encuestasCreadas,
            this.model.companyUsuario,
            this.model.ubicacionUsuario,
            this.currentUser.avatarUser,
        )
        this.userService.update(usuarioMod)
            .subscribe(
                data => {
                    localStorage.clear();
                    localStorage.setItem('currentUser', JSON.stringify(usuarioMod));
                    this.router.navigate(['/home']);
                });
    }

    actualizarFoto() {
        const usuarioMod = new UserModelClass(
            this.currentUser.idUsuario,
            this.currentUser.nombreUsuario,
            this.currentUser.emailUsuario,
            this.currentUser.passwordUsuario,
            this.currentUser.fechaAlta,
            this.currentUser.ultimaEncuesta,
            this.currentUser.encuestasCreadas,
            this.currentUser.companyUsuario,
            this.currentUser.ubicacionUsuario,
            this.model.avatarUser,
        )
        // $('#exampleModal').hide();
        // this.userService.update(usuarioMod)
        //     .subscribe(
        //         data => {
        //             this.router.navigate(['/user']);
        //         });
    }
}
