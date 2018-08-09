export class UserModelClass{
    idUsuario: number;
    nombreUsuario: string;
    emailUsuario: string;
    passwordUsuario: string;
    fechaAlta: Date;
    ultimaEncuesta: Date;
    encuestasCreadas: number;
    //repeatpasswordUsuario: string;
    
    constructor(idUsuario,nombreUsuario,emailUsuario,passwordUsuario,fechaAlta,ultimaEncuesta,encuestasCreadas){
        this.idUsuario = idUsuario;
        this.nombreUsuario = nombreUsuario;
        this.emailUsuario = emailUsuario;
        this.passwordUsuario = passwordUsuario;
        this.fechaAlta = fechaAlta;
        this.ultimaEncuesta = ultimaEncuesta;
        this.encuestasCreadas = encuestasCreadas;
       // this.repeatpasswordUsuario = passwordUsuario;
    }
}