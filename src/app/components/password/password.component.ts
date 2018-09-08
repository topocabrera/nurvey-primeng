import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, AbstractControl, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator } from '../register/validators';
import { AlertService, UserService } from '../../services/index';
import { UserModelClass } from '../../domain/UserModelClass';

@Component({
    selector: 'password',
    // moduleId: module.id,
    templateUrl: 'password.html',
})

export class PasswordComponent {
    public form: FormGroup;
    public password1: AbstractControl;
    public password: AbstractControl;
    public repeatPassword: AbstractControl;
    public passwords: FormGroup;
    muestraMensajeToast: boolean;
    mensajeToast:string;
    currentUser: UserModelClass;
    users: UserModelClass[] = [];

    model: any = {};
    loading = false;

    /**
     * Constructor que inicializa los valores por defecto y ademas se validan los diferentes inputs
     * los cuales son contraseñas y se deben validar que sean minimo de 4 caracteres 
     * y que la contraseña y la que se repite sean las mismas
     * @param router
     * @param userService
     * @param fb
     */
    constructor(
        private router: Router,
        private userService: UserService,
        fb: FormBuilder) {
        this.form = fb.group({
            'password1': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            'passwords': fb.group({
                'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
                'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
            }, { validator: EqualPasswordsValidator.validate('password', 'repeatPassword') })
        });

        this.passwords = <FormGroup>this.form.controls['passwords'];
        this.password = this.passwords.controls['password'];
        this.password1 = this.form.controls['password1'];
        this.repeatPassword = this.passwords.controls['repeatPassword'];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        // this.router = this.router;
        // this.userService = this.userService;
        // this.alertService = this.alertService;
    }

    /**
     * Actualiza la contraseña por una nueva con los valores id, nombre e email originales de la sesion
     */
    actualizar() {
        const usuarioMod = new UserModelClass(
            this.currentUser.idUsuario,
            this.currentUser.nombreUsuario,
            this.currentUser.emailUsuario,
            this.model.passwordUsuario,
            this.currentUser.fechaAlta,
            this.currentUser.ultimaEncuesta,
            this.currentUser.encuestasCreadas)

        if (this.currentUser.passwordUsuario === this.model.passwordUsuario1) {
            this.userService.update(usuarioMod)
                .subscribe(
                    data => {
                        this.muestraMensajeToast = true;
                        this.mensajeToast = "Contraseña modificada correctamente";
                        //TODO: timeout para redireccionar
                        this.router.navigate(['/home']);    
                    });
        } else {
            this.muestraMensajeToast = true;
            this.mensajeToast = "Contraseña antigua incorrecta";
        }
    }
}