import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, AbstractControl, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator } from './validators';
import { AlertService, UserService } from '../../services/index';

@Component({
  selector: 'register',
  // moduleId: module.id,
  templateUrl: 'register.html',
  styleUrls: ['./register.css']
})

export class RegisterComponent {
  public form: FormGroup;
  public name: AbstractControl;
  public email: AbstractControl;
  public password: AbstractControl;
  public repeatPassword: AbstractControl;
  public passwords: FormGroup;
  muestraMensajeToast: boolean;
  mensajeToast: string;

  model: any = {};
  loading = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    fb: FormBuilder) {
    this.form = fb.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'email': ['', Validators.compose([Validators.required, EmailValidator.validate])],
      'passwords': fb.group({
        'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
      }, { validator: EqualPasswordsValidator.validate('password', 'repeatPassword') })
    });

    console.log(this.passwords);
    this.name = this.form.controls['name'];
    this.email = this.form.controls['email'];
    this.passwords = <FormGroup>this.form.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];
    this.alertService = this.alertService;
    
  }


  register() {
    this.loading = true;
    this.userService.getByEmail(this.model.emailUsuario)
      .subscribe(
        data => {
          if (data.status===204) {
            this.userService.create(this.model)
              .subscribe(
                data => {
                  this.mensajeToast = 'Se ha enviado un mail a su correo con la confirmacion de su cuenta.';
                  this.alertService.alert(this.mensajeToast);
                  this.router.navigate(['/login']);
                },
                error => {
                  this.alertService.error(error.statusText);
                  this.mensajeToast = error;
                  this.loading = false;
                });
          } else {
            this.muestraMensajeToast = true;
            this.mensajeToast = 'El email ya existe, por favor ingrese otro email.';
            this.alertService.alert(this.mensajeToast);
          }
        }
      )
  }
}
