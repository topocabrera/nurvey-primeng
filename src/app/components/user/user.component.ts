import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserModelClass } from '../../domain/UserModelClass';
import { UserService } from '../../services/user.service';
import { FormGroup, AbstractControl, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmailValidator } from '../register/validators';
import { AlertService } from '../../services/index';

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
    muestraMensajeToast: boolean;
    mensajeToast: string;

    constructor(private router: Router,
        private userService: UserService,
        private alertService: AlertService,
        fb: FormBuilder) {
        this.form = fb.group({
            'name': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            'email': ['', Validators.compose([Validators.required, EmailValidator.validate])]
        });
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.model = this.currentUser;
        this.alertService = alertService;
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
                response => {
                    if(response.status === 200){
                        localStorage.clear();
                        localStorage.setItem('currentUser', JSON.stringify(usuarioMod));
                        // this.muestraMensajeToast = true;
                        this.mensajeToast = 'Perfil actualizado correctamente';
                        this.alertService.alert(this.mensajeToast);
                    }
                },
                error => {
                    this.alertService.error(error);
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
