import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { AlertService, AuthenticationService } from '../../services/index';
import { UserModelClass } from '../../domain/UserModelClass';
import { EmailValidator } from '../register/validators';
import { Http, Headers } from '@angular/http';
import { NgClass } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

declare const FB: any;
declare const gapi: any;

@Component({
    selector: 'login',
    // moduleId: module.id,
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
    public auth2: any;


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

        // tslint:disable-next-line:no-unused-expression
        `FB.init({
            appId: '333440677425322',
            cookie: true,
            xfbml: true,
            version: 'v3.0'
        });`
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.emailUsuario, this.model.passwordUsuario)
            .subscribe(
                data => {
                    // this.router.navigate([this.returnUrl]);
                    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
                    this.currentUserEmitter.emit(this.currentUser.nombreUsuario)
                    window.location.href = ''
                    // this.router.navigate([""])
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    public attachSignin(element) {
        console.log('elemnt google', element);
        this.auth2.attachClickHandler(element, {},
            (googleUser) => {

                const profile = googleUser.getBasicProfile();
                console.log('Token || ' + googleUser.getAuthResponse().id_token);
                console.log('ID: ' + profile.getId());
                console.log('Name: ' + profile.getName());
                console.log('Image URL: ' + profile.getImageUrl());
                console.log('Email: ' + profile.getEmail());
                const response = {
                    email: profile.getEmail(),
                };
                console.log('response', response);
                this.authenticationService.loginSocial(response.email)
                    .subscribe(
                        data => {
                            console.log('entro al suscribeeee');
                            this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
                            this.currentUserEmitter.emit(this.currentUser.nombreUsuario)
                            window.location.href = ''
                        },
                        error => {
                            this.alertService.error(error);
                            this.loading = false;
                        });


            }, (error) => {
                alert(JSON.stringify(error, undefined, 2));
            });
    }

    // onSignInGoogle(googleUser) {
    //     const profile = googleUser.getBasicProfile();
    //     console.log('Profile', profile);
    //     const response = {
    //         email: profile.getEmail(),
    //     };
    //     console.log('response', response);
    //     this.authenticationService.loginSocial(response.email)
    //         .subscribe(
    //             data => {
    //                 // this.router.navigate([this.returnUrl]);
    //                 console.log('entro al suscribeeee');
    //                 this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    //                 this.currentUserEmitter.emit(this.currentUser.nombreUsuario)
    //                 window.location.href = ''
    //                 // this.router.navigate([""])
    //             },
    //             error => {
    //                 this.alertService.error(error);
    //                 this.loading = false;
    //             });
    // }
    // Implementar??
    // window.onbeforeunload = function (e) {
    // Se ejecuta esto antes de que se termine de descargar la página para desloggear
    // al que esté autenticado para que pueda elegir con qué se quiere loggear.
    //     gapi.auth2.getAuthInstance().signOut();
    // };

    statusChangeCallback(response) {
        console.log('statusChangeCallback');
        console.log(response);
        if (response.status === 'connected') {
            this.LoginFacebook();
        }
    }

    // This function is called when someone finishes with the Login
    // Button.  See the onlogin handler attached to it in the sample
    // code below.
    checkLoginState() {
        console.log('checkLoginState');
        FB.getLoginStatus(function (response) {
            this.statusChangeCallback(response);
        });
    }

    LoginFacebook() {
        FB.api('/me?fields=email', function (response) {
            console.log('fb respo', response);
            this.authenticationService.loginSocial(response)
                .subscribe(
                    data => {
                        console.log('entro al susc');
                        // this.router.navigate([this.returnUrl]);
                        this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
                        this.currentUserEmitter.emit(this.currentUser.nombreUsuario)
                        window.location.href = ''
                        // this.router.navigate([""])
                    },
                    error => {
                        this.alertService.error(error);
                        this.loading = false;
                    });
        });
    }
}
