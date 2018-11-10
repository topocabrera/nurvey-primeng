//Model class custom questions
export class PreguntasCustomModelClass{
    idUsuario: number;
    preguntaCustomJson: string;

    constructor(idUsuario,preguntaCustomJson){
        this.idUsuario = idUsuario;
        this.preguntaCustomJson = preguntaCustomJson;
    }
}