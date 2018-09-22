export class UserModelClass {
    idUsuario: number;
    nombreUsuario: string;
    emailUsuario: string;
    passwordUsuario: string;
    fechaAlta: Date;
    ultimaEncuesta: Date;
    encuestasCreadas: number;
    companyUsuario: string;
    ubicacionUsuario: string;
    avatarUser: string;

    constructor(
        idUsuario,
        nombreUsuario,
        emailUsuario,
        passwordUsuario,
        fechaAlta,
        ultimaEncuesta,
        encuestasCreadas,
        companyUsuario,
        ubicacionUsuario,
        avatarUser
        ) {
        this.idUsuario = idUsuario;
        this.nombreUsuario = nombreUsuario;
        this.emailUsuario = emailUsuario;
        this.passwordUsuario = passwordUsuario;
        this.fechaAlta = fechaAlta;
        this.ultimaEncuesta = ultimaEncuesta;
        this.encuestasCreadas = encuestasCreadas;
        this.companyUsuario = companyUsuario;
        this.ubicacionUsuario = ubicacionUsuario;
        this.avatarUser = avatarUser;
    }
}
