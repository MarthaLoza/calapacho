import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Field, TercerElement } from 'src/app/interfaces/user';
import { DialogUpdateComponent } from '../form-dialogs/dialog-update/dialog-update.component';

@Component({
  selector: 'app-form-one-data',
  templateUrl: './form-one-data.component.html',
  styleUrls: ['./form-one-data.component.scss']
})
export class FormOneDataComponent implements OnInit, OnChanges {
  @Input() arrFormField   : Field[]       = [];
  @Input() arrDataTable   : Array<object> = []; // Datos de la tabla, ordenada para la vista del usuario
  @Input() arrDataAll     : Array<object> = []; // Todos los datos de terceros
  @Input() strTablesNames : Array<string> = []; // Nombre de la tabla
  @Input() strIdName      : string        = ''; // Nombre del campo id o condición a eliminar
  @Input() strColumnDelete: string        = ''; // Nombre de la columna a eliminar
  @Input() arrFieldSearch : Field[]       = [];

  @Output() arrDataOutput       = new EventEmitter<object>();
  @Output() boolFormOut         = new EventEmitter<Array<any>>();
  @Output() boolRefreshTable    = new EventEmitter<boolean>();
  @Output() arrDataSearch       = new EventEmitter<object>();

  /**
   * Este evento se dispara para actualizar un campo del formulario.
   */
  @Output() fieldUpdate         = new EventEmitter<{ fieldName: string, value: any }>();

  /** Datos para el formulario */
  form      : FormGroup;
  fields    : Field[]       = [];

  boolFormModific     = false;    // Formulario modificado
  numIndexTableOutput = 0;        // Index de la tabla
  boolActionUser      = false;    // Acción realizada por el usuario
  boolActionButton    = false;    // Acción realizada por los botones(arrows)
  boolIfSearch        = false;     // Deshabilita el botón search

  boolDisableDelete   = false;    // Deshabilita el botón delete
  boolDisableUpdate   = false;    // Deshabilita el botón update
  boolDisableInsert   = false;    // Deshabilita el botón
  boolDisableReset    = false;    // Deshabilita el botón reset

  arrConditionDelete : Array<any>  = [];
  arrConditionUpdate : Array<any>  = [];

  constructor(
    private __formbuilder   : FormBuilder,
    private __changeDR      : ChangeDetectorRef,
    private __router        : Router,
    private __dialog        : MatDialog
  ) {
    this.form = this.__formbuilder.group({});  
  }

  ngOnInit() {
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges) {

    /** Asignación de los campos del formulario */
    if(changes['arrFormField']) { this.fields = this.arrFormField }
    
    if(this.arrDataAll.length > 0) {
      
      /** Escucha cada vez que hay un cambio en los Input */
      this.listenToFormChanges();

    } else {

      this.boolDisableDelete = true;        // Si la tabla no tiene datos se deshabilita
      this.boolDisableUpdate = true;        // Si la tabla no tiene datos se deshabilita
      this.boolDisableReset  = true;        // Si la tabla no tiene datos se deshabilita
    }
  }

  ngAfterViewChecked() {
    this.__changeDR.detectChanges();
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

  /* ****************************************** */
  /*          METODOS DEL FORMULARIO            */
  /* ****************************************** */

  /** 
   * Método para actualizar los valores del formulario segun la
   * fila seleccionada en la tabla. En pocas palabras, pinta los
   * datas de la tabla en el formulario.
   */
  updateFormValues() {
    if (this.arrDataAll.length > 0 && this.numIndexTableOutput < this.arrDataAll.length) {

      this.form.patchValue(this.arrDataAll[this.numIndexTableOutput]);

      /**
       * Lo pongo aquí ya que solo necesito el valor del campo id
       */
      if(this.arrDataAll.length > 0) { this.preparationForButtonDelete() }
    }
  }

  /* ****************************************** */
  /*          PREPARACIÓN DE VARIABLES          */
  /* ****************************************** */

  /**
   * Preparación para eliminar registros de una tabla. Este metodo a sido creado
   * para eliminar uno a más registros de una tabla, ya que la eliinación de un
   * registro aveces conlleva eliminar registros de otras tablas referenciadas.
   * [ [nameTable1, {nameColumn1: value1}], [nameTable2, {nameColumn2: value2}] ]
   */
  preparationForButtonDelete() {
    let arrConditionDelete      : Array<any> = [];
    const nameColumnCondition   = this.strIdName;
    const valueCondition        = (this.arrDataAll[this.numIndexTableOutput] as any)[nameColumnCondition];
    
    for(let table of this.strTablesNames) {
      arrConditionDelete.push(
        [table, {[nameColumnCondition] : valueCondition}]
      )
    }

    this.arrConditionDelete = arrConditionDelete;
  }

  /**
   * Preparación para actualizar registros de una tabla. Este metodo a sido creado
   * para actualizar solo un dato a la vez.
   * Recordar que la variable strTablesNames es una array y el nombre de la tabla principal
   * siempre será el último elemento de la array.
   * [nameTable, {nameColumn: value}, {nameColumn1: value1, nameColumn2: value2}]
   */
  preparationForButtonUpdate() {
    const nameColumnCondition   = this.strIdName;
    const valueCondition        = (this.arrDataAll[this.numIndexTableOutput] as any)[this.strIdName];
    let objDataupdate           = this.form.value;
    
    /** Metodo por si se desea quitar alguna columna del update */
    if(this.strColumnDelete){
      objDataupdate = this.omitField(objDataupdate, this.strColumnDelete);
    }

    this.arrConditionUpdate     = [this.strTablesNames[this.strTablesNames.length - 1], 
                                  { [nameColumnCondition] : valueCondition },
                                  objDataupdate];
    
  }


  /* ***************************** */
  /*          ONCHANGE             */
  /* ***************************** */

  /** Método que escucha al formulario */
  listenToFormChanges() {
    
    this.form.valueChanges.subscribe(() => {
      
      /** 
       * Si el pristine es falso significa que el fomulario esta editado.
       */
      if(!this.form.pristine) {
        
        // Si el fomulario esta editado y valido se activa el botón update
        this.boolDisableUpdate  = (this.arrDataAll.length > 0 && this.form.valid ? false : true);

        this.boolFormModific    = true;  // Formulario modificado(true)
        this.boolDisableDelete  = true;  // Si el fomulario esta editado descativa
        this.boolDisableReset   = true;  // Si el fomulario esta editado descativa

      } else {
        // Si hay datos en la tabla se activa el botón reset y delete
        this.boolDisableReset   = this.arrDataAll.length > 0 ? false : true;
        this.boolDisableDelete  = this.arrDataAll.length > 0 ? false : true;

        this.boolDisableUpdate  = true;  // Si el formulario no esta editado
        this.boolFormModific    = false; // Formulario no modificado(false)
      }
      
      /**
       * Este evento envía datos de la vista al componente padre. Se
       * activa siempre que se haga un cambio en el formulario.
       * form.value      : Datos del formulario
       * boolActionUser  : Detecta si la acción fue realizada por el usuario
       */
      this.boolFormOut.emit([ this.form.value, this.boolActionUser] );

      /**
       * Aquí nesecito el valor de todo el fomulario y cada vez que se edite.
       */
      if(this.arrDataAll.length > 0) { this.preparationForButtonUpdate() }

    });
  
  }


  /* ***************************** */
  /*          BOTONES              */
  /* ***************************** */

  /** 
   * Evento que envía los datos del fomulario por un evento a otro componente.
   * En este evento se regresa el fomulario como no editado y la variable boolFormModific
   * se pone en false para poder seguir validando despues cuando el fomulario se edite.
   * Ya que cuando se insertan datos tambien se edita el fomulario y sus valores no cambian
   * si no los cambias.
   */
  buttonInsert() {
    this.arrDataOutput.emit(this.form.value);
    this.boolFormModific  = false;  // Formulario no modificado(false)
    this.form.markAsPristine();     // Marca el formulario como no modificado    
  }

  resetForm() {
    this.boolActionUser     = false;  // Se desactiva para que no genere el código de tercero
    this.arrDataAll         = [];     // Limpia los datos de los terceros
    this.arrDataTable       = [];     // Limpia los datos de la tabla
    this.form.reset();

    /** Asigno los datos por defecto del formulario */    
    this.fields.forEach(field => {
      this.form.get(field.name)?.setValue(field.defaultValue ?? '');
    });

    this.boolActionUser   = true;     // Se activa para que genere el código de tercero
  }

  async refreshBoton() {

    const validation = this.boolFormModific ? await this.openDialogUpdate() : true;
    if (validation) { this.resetComponent() }
    
  }

  async searchButton() {
    if(this.boolFormModific) {
      const validation = await this.openDialogUpdate();

      if(validation){
        this.boolActionUser       = false;  // Se desactiva para que no genere el código de tercero
        this.form.reset();
        this.boolIfSearch         = true;   // Deja ver la vista de filtro
        this.boolActionUser       = true;   // Se activa para que genere el código de tercero
        this.numIndexTableOutput  = 0;      // Index de la tabla

        this.arrDataAll         = [];     // Limpia los datos de los terceros
        this.arrDataTable       = [];     // Limpia los datos de la tabla
      }
    } else {
      this.boolActionUser       = false;  // Se desactiva para que no genere el código de tercero
      this.form.reset();
      this.boolIfSearch         = true;   // Deja ver la vista de filtro
      this.boolActionUser       = true;   // Se activa para que genere el código de tercero
      this.numIndexTableOutput  = 0;      // Index de la tabla

      this.arrDataAll         = [];     // Limpia los datos de los terceros
      this.arrDataTable       = [];     // Limpia los datos de la tabla
    }    
  }

  /* ***************************************** */
  /*          DIALOGOS DEL FORMULARIO          */
  /* ***************************************** */

  /** Método para abrir el dialogo de Campos pendientes */
  openDialogUpdate(): Promise<boolean> {
    const dialogRef = this.__dialog.open(DialogUpdateComponent, {});

    return dialogRef.afterClosed().toPromise();
  }


  /* **************************************************************** */
  /*          EVENTOS QUE RECIBEN DATOS DE OTROS COMPONENTES          */
  /* **************************************************************** */

  /** 
   * Index que sale de la selección de la tabla.
   * Siempre se va a seleccionar la tabla aunque se presione el botón,
   * ya que la fila tiene que pintarse, por ello desde aqui llamamos
   * a updateFormValues asegurandonos que siempre se va a ejecutar, ya
   * sea por botón o por la selección del mouse.
   */
  IndexTableOutput(index: number) {
    /**
     * Se condiciona el uso del botón buscar ya que sino toma el index
     * que ya estaba antes y lo correcto es que se limpie el formulario
     * del todo cuando se usa el botón de buscar ya que será un nuevo filtro
     * y nuevos datos.
     */
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
   * Este evento nos indica el uso de los botones arrows,
   * esto se debe a que en el componente de la tabla se necesita.
   */
  boolActionButtonArrows(boolean: boolean) {
    this.boolActionButton = boolean;
  }
  
  /** 
   * Evento para refrescar la tabla y el formulario despues
   * de que se haya actualizado un registro.
   */
  boolFinishUpdate(boolResponse: boolean) {
    if (boolResponse) {
      this.form.reset();
      this.boolRefreshTable.emit(true);
    }
  }

  /** 
   * Finaliza el update y manda un false, además esta configurado para
   * los botones de flecha.
   */
  boolDisable(boolDisable: boolean) {    
    this.boolFormModific  = boolDisable;
    this.form.markAsPristine(); // Marca el formulario como no modificado
  }

  /** Evento de la busqueda para recibir los datos que se envían desde ese fomulario */
  searchEvent(data : object) {
    this.arrDataSearch.emit(data);
    this.boolIfSearch = false;
  }


  /**************************************************** */
  /*         METODOS QUE AYUDAN A OTROS METODOS         */
  /**************************************************** */

  /**
   * Este método permite quitar atributos de un objeto
   * @param obj         Objeto
   * @param fieldName   Nombre del atributo a eliminar
   * @returns           Objeto sin el atributo
   */
  private omitField(obj: any, fieldName: string): any {
    const { [fieldName]: _, ...rest } = obj;
    return rest;
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

  /** Método para resetear el componente y te redirige de nuevo al mismo */
  resetComponent() {
    const currentUrl = this.__router.url;
  
    this.__router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.__router.navigate([currentUrl]);
    });
    
  }

}
