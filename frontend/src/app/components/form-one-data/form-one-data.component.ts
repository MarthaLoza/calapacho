import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Field, TercerElement } from 'src/app/interfaces/user';

@Component({
  selector: 'app-form-one-data',
  templateUrl: './form-one-data.component.html',
  styleUrls: ['./form-one-data.component.scss']
})
export class FormOneDataComponent implements OnInit, OnChanges {
  @Input() arrFormField   : Field[]       = [];
  @Input() arrDataTable   : Array<object> = []; // Datos de la tabla, ordenada para la vista del usuario
  @Input() arrDataForm    : Array<object> = []; // Todos los datos de terceros
  @Input() strTablesNames : Array<string> = []; // Nombre de la tabla
  @Input() strIdName      : string        = ''; // Nombre del campo id o condición a eliminar

  @Output() arrDataOutput       = new EventEmitter<object>();
  @Output() boolFormOut         = new EventEmitter<Array<any>>();
  @Output() boolFormValidOut    = new EventEmitter<boolean>();
  /**
   * Este evento se dispara para actualizar un campo del formulario.
   */
  @Output() fieldUpdate         = new EventEmitter<{ fieldName: string, value: any }>();

  /** Datos para el formulario */
  form      : FormGroup;
  fields    : Field[]       = [];
  dataTable : Array<object> = [];

  boolFormValid       = false;
  boolFormModific     = false;  
  numIndexTableOutput = 0;
  boolActionUser      = false;
  boolActionButton    = false;
  arrConditionDelete : Array<any>  = [];


  constructor(
    private __formbuilder   : FormBuilder,
    private __changeDR      : ChangeDetectorRef
  ) {
    this.form = this.__formbuilder.group({});  
  }

  ngOnInit() {
    this.listenToFormChanges();
    
  }

  ngOnChanges(changes: SimpleChanges) {
    this.fields = this.arrFormField;
    this.createForm();
    this.dataTable = this.arrDataTable;
  }

  ngAfterViewChecked() {
    this.__changeDR.detectChanges();
  }

  /** Método para actualizar los valores del formulario */
  updateFormValues() {
    if (this.arrDataForm && this.arrDataForm.length > 0 && 
        this.numIndexTableOutput < this.arrDataForm.length) {
      this.form.patchValue(this.arrDataForm[this.numIndexTableOutput]);
      console.log("Se elimina");
      
      this.preparationForButtonDelete();
    }    
  }

  /**
   * Preparación para eliminar registros de una tabla.
   * [ [nameTable1, {nameColumn1: value1}], [nameTable2, {nameColumn2: value2}] ]
   */
  preparationForButtonDelete() {
    const nameColumnCondition   = this.strIdName;
    const valueCondition        = (this.arrDataForm[this.numIndexTableOutput] as any)[nameColumnCondition];
    
    let arrConditionDelete: Array<any> = [];

    for(let table of this.strTablesNames) {
      arrConditionDelete.push(
        [table, {[nameColumnCondition] : valueCondition}]
      )
    }

    this.arrConditionDelete = arrConditionDelete;
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
    // Dato requerido
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    // Solo se aceptan numeros
    if (control?.hasError('numeric')) {
      return 'Solo se aceptan números';
    }
    // Campo tipo email
    if (control?.hasError('email')) {
      return 'El email no es válido';
    }
    return '';
  }

  /** Método que escucha al formulario */
  listenToFormChanges() {
    this.form.valueChanges.subscribe(() => {

      if(!this.form.pristine) this.boolFormModific = true;  // Formulario modificado
      this.boolFormValid = this.form.valid;                 // Formulario válido
      
      /**
       * boolFormModific : Detecta que el formulario ha sido modificado
       * boolFormValid   : Detecta que el formulario es válido
       * form.value      : Datos del formulario
       * boolActionUser  : Detecta si la acción fue realizada por el usuario
       */
      this.boolFormOut.emit([ this.boolFormModific, this.boolFormValid, 
                              this.form.value,      this.boolActionUser] );
      
    });
  }

  /** 
   * Index que sale de la selección de la tabla.
   * Siempre se va a seleccionar la tabla aunque se presione el botón,
   * ya que la fila tiene que pintarse, por ello desde aqui llamamos
   * a updateFormValues asegurandonos que siempre se va a ejecutar, ya
   * sea por botón o por la selección del mouse.
   */
  IndexTableOutput(index: number) {
    this.boolActionUser       = false;
    this.numIndexTableOutput  = index;
    this.updateFormValues();
    this.boolActionUser       = true;    
  }

  /** Index que sale de la selección por botones(arrows) */
  IndexButtonOutput(index: number) {
    this.numIndexTableOutput  = index;
  }

  /** 
   * Este étodo nos indica el uso de los botones arrows,
   * esto se debe a que en el componente de la tabla se necesita.
   */
  boolActionButtonArrows(boolean: boolean) {
    this.boolActionButton = boolean;
  }

  /** Evento que envía los datos del fomulario por un evento */
  buttonInsert() {
    this.arrDataOutput.emit(this.form.value);
  }

  /**
   * Este método fue creado para poder actualizar los campos del formulario
   * incluso hasta cuando ya se ha seleccionado un registro de la tabla.
   * @param fieldName Nombre del campo que se desea actualizar
   * @param value Valor que se desea asignar al campo
   */
  updateField(fieldName: string, value: any) {
    if (this.form.contains(fieldName)) {
      this.form.get(fieldName)?.setValue(value);
    }
  }



}
