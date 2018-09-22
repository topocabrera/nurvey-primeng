import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { AlertService, AuthenticationService } from '../../services/index';
import { UserModelClass } from '../../domain/UserModelClass';
import { EmailValidator } from '../register/validators';
import { Http, Headers } from "@angular/http";
import { NgClass } from '@angular/common';
import { Observable } from "rxjs/Observable";
import 'rxjs/Rx';

@Component({
    selector: 'login',
    //moduleId: module.id,
    templateUrl: 'login.html',
    styleUrls: ['./login.css']

})

export class LoginComponent implements OnInit {
    public form: FormGroup;
    public email: AbstractControl;
    public password: AbstractControl;
    public isLoggedIn$: Observable<boolean>;
    public currentUser: UserModelClass;
    @Output() currentUserEmitter = new EventEmitter();

    nome: any = localStorage['app-appHeader'];
    model: any = {};
    loading = false;
    returnUrl: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private idle: Idle,
        private http: Http,
        fb: FormBuilder) {
        this.form = fb.group({
            'email': ['', Validators.compose([Validators.required, EmailValidator.validate])],
            'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
        });

        this.email = this.form.controls['email'];
        this.password = this.form.controls['password'];

        idle.setIdle(10);
        idle.setTimeout(1800);
        idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

        // idle.onTimeoutWarning.subscribe((countdown: number) => {
        //     alert('Timeout Warning - ' + countdown);
        // });

        idle.onTimeout.subscribe(() => {

            localStorage.clear();

            this.router.navigate(['/login', { sessionExpirate: 'true' }]);
        });

        idle.watch();

        this.isLoggedIn$ = this.authenticationService.isAuthenticated();
    }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
        localStorage.removeItem('currentUser');
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.emailUsuario, this.model.passwordUsuario)
            .subscribe(
                data => {
                    //this.router.navigate([this.returnUrl]);
                    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
                    this.currentUserEmitter.emit(this.currentUser.nombreUsuario)
                    window.location.href = ""
                    // this.router.navigate([""])
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    //     emiteLogueado(event){
    //         this.estaLogueado.emit({logueado: this.isLoggedIn$});
    // }
}

