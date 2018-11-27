import { Component, OnInit } from '@angular/core';
import { PreguntasCustomService } from '../../services/preguntas-custom.service';
import { PreguntasService } from '../../services/preguntas.service';
import { PreguntasCustomModelClass } from '../../domain/PreguntasCustomModelClass';
import { SurveyJSCustomQuestionsModelClass, contenido, choiceObject } from '../../domain/SurveyJSCustomQuestionsModelClass';
import { AlertService } from '../../services/index';
import { DeviceDetectorService } from 'ngx-device-detector';


@Component({
  selector: 'app-mispreguntascustom',
  templateUrl: './mispreguntascustom.component.html',
  styleUrls: ['./mispreguntascustom.component.css']
})
export class MispreguntascustomComponent implements OnInit {

  currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
  preguntasCustomService: PreguntasCustomService;
  preguntasService: PreguntasService;
  response: any[] = [];
  contenido: any[] = [];
  isChoice: boolean;
  preguntasCustom: PreguntasCustomModelClass;
  p = 1;
  itemsPerPage = 10;
  preguntas: SurveyJSCustomQuestionsModelClass[] = [];
  preguntaCustomModel: SurveyJSCustomQuestionsModelClass;
  showNew: Boolean = false;
  submitType = 'Save';
  selectedRow: number;
  types: string[] = [];
  isDesktop: boolean;
  isMobile: boolean;

  constructor(preguntasCustomService: PreguntasCustomService,
    preguntasService: PreguntasService,
    private deviceService: DeviceDetectorService,
    private alertService: AlertService) {
    this.preguntasCustomService = preguntasCustomService;
    this.preguntasService = preguntasService;
  }


  ngOnInit() {
    this.isMobile = this.deviceService.isMobile();
    this.isDesktop = this.deviceService.isDesktop();

    this.preguntasService.getAllTipoPreguntas()
      .subscribe(res => {
        console.log(res)
        res.forEach(element => {
          this.types.push(element.type);
        });
      });
    this.preguntasCustomService.getCustomQuestions(this.currentUser.idUsuario)
      .subscribe(
        (res: any) => {
          if (res.status === 200) {
            const data = res.json();
            this.response = JSON.parse(data.preguntaCustomJson)
            JSON.parse(data.preguntaCustomJson).forEach(element => {
              this.preguntas.push(new SurveyJSCustomQuestionsModelClass(element.name, element.title, element.isCopied,
                element.iconName, element.json, element.category))
            });
          } else {
            console.log('No existen preguntas custom guardadas por el usuario logueado')
            console.log(res.statusText)
          }
        },
        error => {
          console.log(error)
        });

  }

  onNew() {
    // Initiate new registration.
    this.preguntaCustomModel = new SurveyJSCustomQuestionsModelClass();
    this.preguntaCustomModel.json = new contenido();
    this.preguntaCustomModel.json.choices = new choiceObject();
    // Change submitType to 'Save'.
    this.submitType = 'Save';
    // display registration entry section.
    this.showNew = true;
  }

  // This method associate to Save Button.
  onSave() {
    this.alertService.confirm(
      'Guardar Pregunta Custom',
      '¿ Desea guardar los cambios ?',
      () => {
        if (this.submitType === 'Save') {
          // Push registration model object into registration list.
          this.preguntas.push(this.preguntaCustomModel);
        } else {
          // Update the existing properties values based on model.
          this.preguntas[this.selectedRow].name = this.preguntaCustomModel.name;
          this.preguntas[this.selectedRow].title = this.preguntaCustomModel.title;
          this.preguntas[this.selectedRow].category = this.preguntaCustomModel.category;
          this.preguntas[this.selectedRow].iconName = this.preguntaCustomModel.iconName;
          this.preguntas[this.selectedRow].isCopied = this.preguntaCustomModel.isCopied;
          this.preguntas[this.selectedRow].json.name = this.preguntaCustomModel.json.name;
          this.preguntas[this.selectedRow].json.type = this.preguntaCustomModel.json.type;
        }
        this.preguntasCustom = new PreguntasCustomModelClass(this.currentUser.idUsuario, JSON.stringify(this.preguntas));
        console.log(JSON.stringify(this.preguntasCustom.preguntaCustomJson))
        this.preguntasCustomService.addCustomQuestions(this.preguntasCustom)
          .subscribe((res: any) => {
            console.log(JSON.parse(res.preguntaCustomJson))
            this.preguntas = JSON.parse(res.preguntaCustomJson)
          });
        // Hide registration entry section.
        this.showNew = false;
      },
      () => {/*no hay accion al cancelar*/ },
      'Los cambios han sido guardados.');
  }

  // This method associate to Edit Button.
  onEdit(i: number) {
    const index = this.absoluteIndex(i);
    // Assign selected table row index.
    this.selectedRow = index;
    // Initiate new registration.
    this.preguntaCustomModel = new SurveyJSCustomQuestionsModelClass();
    this.preguntaCustomModel.json = new contenido();
    this.preguntaCustomModel.json.choices = new choiceObject();
    // Retrieve selected registration from list and assign to model.
    this.preguntaCustomModel = Object.assign({}, this.preguntas[this.selectedRow]);
    // Change submitType to Update.
    this.submitType = 'Update';
    // Display registration entry section.
    this.showNew = true;
  }

  // This method associate to Delete Button.
  onDelete(i: number) {
    const index = this.absoluteIndex(i);
    // Delete the corresponding registration entry from the list.
    this.alertService.confirm('Eliminar Pregunta Custom.',
      '¿ Desea eliminar la pregunta "' + this.preguntas[index].name + '" ?',
      () => {
        this.preguntas.splice(index, 1);
        console.log(JSON.stringify(this.preguntas))
        this.preguntasCustom = new PreguntasCustomModelClass(this.currentUser.idUsuario, JSON.stringify(this.preguntas));
        console.log(JSON.stringify(this.preguntasCustom.preguntaCustomJson))
        this.preguntasCustomService.addCustomQuestions(this.preguntasCustom)
          .subscribe((res: any) => {
            console.log(JSON.parse(res.preguntaCustomJson))
            this.preguntas = JSON.parse(res.preguntaCustomJson)
          });
      },
      () => {/*no hay accion al cancelar*/ },
      'La pregunta ha sido eliminada.');
  }

  // This method associate toCancel Button.
  onCancel() {
    // Hide registration entry section.
    // this.alertService.confirm('Preguntas Custom.',
    // '¿ Desea cancelar la acción ?',
    // () => {
    this.showNew = false;
    // },
    // () => {/*no hay accion al cancelar*/});
  }

  // This method associate to Bootstrap dropdown selection change.
  onChangeType(type: string) {
    // Assign corresponding selected country to model.
    this.preguntaCustomModel.json.type = type;
  }

  //////////////////////////////////////
  // metodos del primer aproach (abajo)//
  //////////////////////////////////////

  verContenidoPreguntaCustom(name: string) {
    console.log(name)
    this.contenido.splice(0);
    this.preguntas.forEach(element => {
      console.log(element.name)
      if (element.name === name) {
        this.contenido.push(element.json);
        console.log(this.contenido)
        if (element.json.choices === undefined) { this.isChoice = false; } else { this.isChoice = true; }
      }
    });
  }

  saveChanges(i: number) {
    // pregunta.isEditable=!pregunta.isEditable
    const index = this.absoluteIndex(i);
    console.log(index)
    console.log(this.response)
    this.preguntasCustom = new PreguntasCustomModelClass(this.currentUser.idUsuario, JSON.stringify(this.response));
    this.preguntasCustomService.addCustomQuestions(this.preguntasCustom)
      .subscribe();
  }

  borrarPregunta(i: number) {
    const index = this.absoluteIndex(i);
    console.log(this.response[index - 1])
    this.response.splice(index, 1)
  }

  absoluteIndex(indexOnPage: number): number {
    return this.itemsPerPage * (this.p - 1) + indexOnPage;
  }
}
