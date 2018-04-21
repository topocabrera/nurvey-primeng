export class PreguntaModelClass{
    idEncuesta: number;
    idPregunta: number;
    idCategoria: number;
    idTipoPregunta: number;
    descripcion: string;
    name: string;    

    constructor(idEncuesta,idPregunta,idCategoria,idTipoPregunta,descripcion,name){
        this.idEncuesta = idEncuesta;
        this.idPregunta = idPregunta;
        this.idCategoria = idCategoria;
        this.idTipoPregunta = idTipoPregunta;
        this.descripcion = descripcion;
        this.name = name;        
    }
    
}