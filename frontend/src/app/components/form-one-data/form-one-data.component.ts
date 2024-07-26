import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Field, TercerElement } from 'src/app/interfaces/user';

@Component({
  selector: 'app-form-one-data',
  templateUrl: './form-one-data.component.html',
  styleUrls: ['./form-one-data.component.scss']
})
export class FormOneDataComponent implements OnInit, OnChanges {
  @Input() arrFormField : Field[]       = [];
  @Input() arrDataTable : Array<object> = [];
  @Input() objDataForm  : Array<object> = [];

  @Output() arrDataOut          = new EventEmitter<object>();
  @Output() boolFormOut         = new EventEmitter<Array<boolean>>();
  @Output() boolFormValidOut    = new EventEmitter<boolean>();

  /** Datos para el formulario */
  form      : FormGroup;
  fields    : Field[]       = [];
  dataTable : Array<object> = [];

  boolFormValid       = false;
  boolFormModific     = false;  
  numIndexTableOutput = 0;


  constructor(
    private __formbuilder   : FormBuilder,
    private __changeDR      : ChangeDetectorRef
  ) {
    this.form = this.__formbuilder.group({});  
  }

  ngOnInit() {
    this.listenToFormChanges();
  }

  ngOnChanges() {
    this.fields = this.arrFormField;
    this.createForm();
    this.dataTable = this.arrDataTable;    
  }

  ngAfterViewChecked() {
    this.updateFormValues();
    this.__changeDR.detectChanges();
  }

  /** Método para actualizar los valores del formulario */
  updateFormValues() {
    if (this.objDataForm && this.objDataForm.length > 0 && 
        this.numIndexTableOutput < this.objDataForm.length) {
      this.form.patchValue(this.objDataForm[this.numIndexTableOutput]);
    }
  }

  /**  Método para crear los campos del formulario */
  createForm() {
    this.fields.forEach(field => {
      const control = this.__formbuilder.control(
        { value: field.defaultValue ?? '', disabled: field.disabled ?? false },
        this.buildValidators(field)
      );
      this.form.addControl(field.name, control);
    });
  }

  buildValidators(field: Field) {
    const validators = field.required ? [Validators.required] : [];
    if (field.validators) {
      validators.push(...field.validators);
    }
    return validators;
  }

  /** Método para obtener mensajes de error */
  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);

    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('numeric')) {
      return 'Solo se aceptan números';
    }
    return '';
  }

  /** Método que escucha al formulario */
  listenToFormChanges() {
    this.form.valueChanges.subscribe(() => {

      if(!this.form.pristine) this.boolFormModific = true;  // Formulario modificado
      this.boolFormValid = this.form.valid;                 // Formulario válido
      
      this.boolFormOut.emit([ this.boolFormModific, this.boolFormValid] ); 
    });
  }

  /** Index que sale de la selección de la tabla */
  IndexTableOutput(index: number) {
    this.numIndexTableOutput = index;
    this.updateFormValues();
  }

  /** Index que sale de la selección por botones(arrows) */
  IndexButtonOutput(index: number) {
    this.numIndexTableOutput = index;
    this.updateFormValues();
  }

  buttonInsert() {
    this.arrDataOut.emit(this.form.value);
  }



}
