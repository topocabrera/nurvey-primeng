export class SurveyJSCustomQuestionsModelClass{
    constructor(
    public name: string = '',
    public title: string = '',
    public isCopied: boolean = true,
    public iconName: string = 'icon-default',
    public json: contenido = null,
    public category: string = '',
    public isEditable?: boolean
    ) {}
}

export class contenido {
    constructor(
    public name: string = '',
    public type: string = '',
    public title?: string,
    public rateValues?: number[],
    public choices?: choiceObject,
    public isRequired?: boolean,
    public elements?: string[]
    ) {}
}

export class choiceObject {
    constructor(
    public value: string = '',
    public text: string = ''
    ) {}
}

/**
 * _______________________
 * Gloss Ariox
 * _______________________
 * choices?: choiceObject -> objeto valor/texto editable por el usuario
 * elements?: string[] -> array string - definido por Nurvey - no editable por el usuario - contenido de bloques de preguntas
 */