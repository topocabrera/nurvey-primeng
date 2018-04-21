export class ClienteModelClass{
    idCliente: number;
    nombreCliente: string;
    apellidoCliente: string;
    emailCliente: string;
    idTipoCliente: number;
    idUsuarioCliente: number;

    constructor(idCliente,nombreCliente,apellidoCliente,emailCliente,idTipoCliente,idUsuarioCliente){
        this.idCliente = idCliente;
        this.nombreCliente = nombreCliente;
        this.apellidoCliente = apellidoCliente;
        this.emailCliente = emailCliente;
        this.idTipoCliente = idTipoCliente;
        this.idUsuarioCliente = idUsuarioCliente;
    }
}