export class SurveyModelClass{
    idEncuesta: number;
    definicion: string;
    idCategoriaEncuesta: number;
    idUsuario: number;
    tituloEncuesta: string; 
    fechaEncuesta: string; 
    publicado: boolean; 
    estadoEncuesta: string; 

    constructor(){}

    public inicializate(tituloEncuesta,definicion,idCategoriaEncuesta,idUsuario,fechaEncuesta,publicado,estadoEncuesta){
        
        this.tituloEncuesta = tituloEncuesta;
        this.definicion = JSON.parse(definicion);
        this.idCategoriaEncuesta = idCategoriaEncuesta;
        this.idUsuario = idUsuario;
        this.fechaEncuesta = fechaEncuesta;
        this.publicado = publicado;
        this.estadoEncuesta = estadoEncuesta;
    }
}