import { Injectable } from '@angular/core';
declare let alertify: any;

@Injectable()
export class AlertService {
    constructor () {}

    confirm(mensaje: string) {
        alertify.confirm(mensaje,
            function(){
                alertify.success('Ok');
            },
            function(){
                alertify.error('Cancel');
            });
    }

    alert(mensaje: string){
        alertify.alert(mensaje, function(){
                alertify.success('OK');
            });
    }

    prompt(titleDialog: string,defaultValue: string){
        alertify.prompt(titleDialog, defaultValue,
            function(evt, value ){
                alertify.success('Ok: ' + value);
            },
            function(){
                alertify.error('Cancel');
            })
            ;
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