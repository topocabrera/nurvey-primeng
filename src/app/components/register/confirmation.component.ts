import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, AbstractControl, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator } from './validators';
import { AlertService, UserService } from '../../services/index';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'confirmation',
  templateUrl: 'confirmation.html',
  styleUrls: ['./confirmation.css']
})

export class ConfirmationComponent {
  private sub: any;
  muestraMensajeToast: boolean;
  mensajeToast: string;

  loading = false;

  constructor(
    private route: ActivatedRoute,  
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private authenticationService: AuthenticationService) {
    this.alertService = this.alertService;
    this.authenticationService = authenticationService;
  }

  confirmation() {
    this.sub = this.route.params.subscribe(params => 
        {
            var token:string = params['token'];
            // var tokenToSend = token.substr(3);
            // console.log(tokenToSend)
            this.authenticationService.activarToken(token)
                .subscribe((res:any) =>{
                    var resp = res.json();
                    if(resp===true){
                      this.alertService.alert('Su usuario ha sido registrado con éxito.');
                      this.router.navigate(['/login']);
                    }else{
                      this.alertService.error('Ha ocurrido un error en la confirmación de su usuario.');
                    }
                });
        });
    
  }
}
