import { Injectable } from '@angular/core';
import { Router} from '@angular/router'
import 'rxjs/add/operator/toPromise'
declare let alertify: any;

@Injectable()
export class AlertService {
    public router: Router
    constructor (router: Router) {
        this.router = router;
    }

    confirm(title:string, mensaje: string, onok: (e) => any, oncancel: () => any, mensajeToast?:string) {
        alertify.confirm(title, mensaje, 
            (e) => {
            if(e.button.text === 'OK'){
                onok(e);
                if(mensajeToast){alertify.success(mensajeToast);}
            }}
            ,(r) =>{
            if(r.button.text === 'Cancel'){
                oncancel();
                alertify.error('Cancel');
            }
        });
    }

    alert(mensaje: string, mensajeToast?:string){
        alertify.alert(mensaje, function(){
                if(mensajeToast){alertify.success(mensajeToast);}
            });
    }

    prompt(titleDialog: string,defaultValue: string){
        alertify.prompt(titleDialog, defaultValue,
            function(evt, value ){
                alertify.success('Ok: ' + value);
            },
            function(){
                alertify.error('Cancel');
            });
    }

    shareModal(title:string, content: string){
        alertify.alert(title,content);
    }

    success(mensaje: string) {
        alertify.success(mensaje);
    }

    error(mensaje: string) {
        alertify.error(mensaje);
    }

    warning(mensaje: string){
        alertify.warning(mensaje);
    }
}