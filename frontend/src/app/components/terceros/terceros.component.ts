import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Field, TercerElement, arrTypeCif, arrTypeStatus, arrTypeUser } from 'src/app/interfaces/user';
import { ErrorService } from 'src/app/services/error.service';
import { TerceroService } from 'src/app/services/tercero.service';
import { ceValidator, dniValidator, numericValidator, rucValidator } from 'src/assets/validator';
import { FormOneDataComponent } from '../form-one-data/form-one-data.component';
import { NotifierService } from 'angular-notifier';
import { catchError, of, switchMap } from 'rxjs';
import { QueryService } from 'src/app/services/query-basic.service';

@Component({
  selector: 'app-terceros',
  templateUrl: './terceros.component.html',
  styleUrls: ['./terceros.component.scss']
})
export class TercerosComponent {

  @ViewChild(FormOneDataComponent) formOneData!: FormOneDataComponent; // Obtenemos una referencia al componente

  arrFormField : Field[] = [
    { type: 'select',   label: 'Tipo de tercero',       name: 'terType',  required: true, options: arrTypeUser,                onChange: this.generationTercerCode.bind(this) },
    { type: 'text',     label: 'Código',                name: 'codigo',   required: true,                           },
    { type: 'text',     label: 'Nombre o Razon social', name: 'nombre',   required: true                            },
    { type: 'text',     label: 'Nombre auxiliar',       name: 'nomaux',   required: false                           },
    { type: 'select',   label: 'Tipo de documento',     name: 'ciftyp',   required: true, options: arrTypeCif,    defaultValue: '0'  },
    { type: 'text',     label: 'Numero de documento',   name: 'cif',      required: true,                         validators: [numericValidator]},
    { type: 'text',     label: 'Comentario',            name: 'coment',   required: false                           },
    { type: 'select',   label: 'Estado',                name: 'estado',   required: true, options: arrTypeStatus, defaultValue: 'A'  },
  ];

  boolActionUser    = false;
  strInitialTercer  = '';
  strCodeGenerated  = null;
  strTablesNames    = ['Ctercero']; // Si hay tanlas referenciadas, enviarla tabla principal al final
  strIdName         = 'seqno';      // Nombre del campo que dará la condición para actualizar o eliminar
  strColumnDelete   = 'terType';    // Secrea para poder enviar columnas que quiero eliminar de un objeto, en este caso del update
  objDataForm       = {};           // Datos del formulario
  strCodeTercero    = '';           // Código del tercero

  arrDataTable    : Array<object>         = []; // Datos de la tabla, ordenada para la vista del usuario
  arrDataAll      : Array<TercerElement>  = []; // Todos los datos de terceros
  arrFieldSearch  : Field[]               = [];

  constructor(
    private __tercerService : TerceroService,
    private __queryService  : QueryService,
    private __errorservices : ErrorService,
    private __notifyService : NotifierService,
    private __changeDR      : ChangeDetectorRef,
  ) {}

  ngOnInit() {
    //this.getLista({codigo : 'T1234'});
    this.getLista({});
  }

  ngAfterViewInit() {
    this.dataFilter(this.arrFormField);
    // Podemos acceder al componente formOneData después de la vista se ha inicializado
  }

  /******************************* */
  /*            EVENTOS            */
  /******************************* */

  /**
   * Inicialmente creado para pasar booleanos de validación y modificación,
   * pero se ha modificado para pasar el tipo de tercero. Con ello todos los
   * datos del formulario ya que escuche los cambios del mismo. Solo debe ser
   * usado en casos especiales ya que al cambiar cada vez que el formulario
   * se edite, causa problamas con los daros que recibe.
   */
  boolFormOut(boolFormOut: Array<any>) {
    this.objDataForm      = boolFormOut[0];
    this.strInitialTercer = boolFormOut[0].terType;
    this.boolActionUser   = boolFormOut[1];
  }

  /**
   * Este evento viene de los botones de actualizar y eliminar,
   * se ejecuta cad vez que se termina la acción de actualizar o eliminar.
   * Así la tabla se refresca con los nuevos datos.
   * @param boolRefreshTable Booleano que indica si se debe refrescar la tabla
   */
  boolRefreshTable(boolRefreshTable: boolean) {
    if(boolRefreshTable){
      this.getLista({});
    }
  }

  /**
   * Este evento se ejecuta cada vez que e realiza una busqueda de campos,
   * por ello se le pasa los datos de busqueda al servicio.
   * @param arrDataSearch   Datos de busqueda
   */
  arrDataSearch(arrDataSearch: any) {    
    this.getLista(arrDataSearch);
  }

  /**
   * Este evento nos envia el index de la fila seleccionada en la tabla
   * cada vez que se selecciona una fila.
   * @param intIndexTable Index de la fila seleccionada
  */
    intIndex(intIndex: number) {
      if(intIndex >= 0) {
        this.strCodeTercero = this.arrDataAll[intIndex].codigo
        this.__changeDR.detectChanges(); 
      }
    }

  /****************************************************** */
  /*    SE ALISTAN LOS DATOS PARA ENVIAR AL FOMULARIO     */
  /****************************************************** */

  /** 
   * Se alista la data que se mostrará en la tabla y se asigna
   * a la variable arrDataAll toda la data de terceros que trae
   * el servicio.
   */
  assembleTableData(data : Array<TercerElement>) {
    let viewDataTable = [];

    for(let fila of data) {
      viewDataTable.push({
        id      : fila.seqno,
        codigo  : fila.codigo,
        nombre  : fila.nombre,
        nombre_auxiliar : fila.nomaux,
        indentificación : fila.cif
      })

      // Asigno el valor del terType al formulario
      fila.terType = fila.codigo[0];
    }
    this.arrDataTable = viewDataTable;
    this.arrDataAll   = data;    
  }

  /** Data para armar la busqueda del fomulario */
  dataFilter(data: Field[]) {
    data.forEach(field => {
      this.arrFieldSearch.push({
        type    : field.type,
        label   : field.label,
        name    : field.name,
        options : field.options,
      });
    });
  }


  /******************************* */
  /*      USO DE SERVICIOS         */
  /******************************* */

  /** Servicio que trae la data del tercero */
  getLista(dataFilter: any) {    
    this.__tercerService.getListaTerceros(dataFilter)
      .subscribe(
        response => {
          // Si no hay datos no podemos armar la tabla
          if(response.length != 0) {
            this.assembleTableData(response)
          } else {
            this.arrDataTable = [];
            this.arrDataAll   = [];
          }
        },
        error => {
          this.__errorservices.msjError(error); 
        }
      )
  }

  /** Genera el código del tercero */
  generationTercerCode() {
    if( this.strInitialTercer && (this.boolActionUser || this.arrDataAll.length == 0) ) {
      console.log('Generando código', this.boolActionUser, this.arrDataAll.length);
      
      this.__tercerService.getCodigo(this.strInitialTercer)
        .subscribe(
          (response: any) => {
            /**
             * Este es un ejemplo de como se puede actualizar campos del
             * fomulario ya con datos, aquí se actualiza el campo 'codigo'
             */
            this.formOneData.updateField('codigo', response);
          },
          (error: any) => {
            this.__errorservices.msjError(error);
          }
        );
    }
  }

  /**
   * Este método es un ejemplo de como puedo hacer una petición (switchMap)
   * a un servicio, esperar una respuesta y luego hacer otra petición.
   * Esto tambien es un  EVENTO de salida del formulario.
   * Data del cliente enviada del formulario
   * @param arrData Data del formulario
   */
  arrDataOutput(arrData: any ) {

    arrData = this.omitField(arrData, 'terType');
    const numIndexTable = this.strTablesNames.length-1;
    this.__tercerService.getCodigo(this.strInitialTercer)
      .pipe(
        switchMap((response: any) => {
          arrData.codigo = response;          
          return this.__queryService.insertOneRow([this.strTablesNames[numIndexTable], arrData]);
        }),
        catchError((error) => {
          this.__errorservices.msjError(error);
          return of(null); // Devolver un observable nulo para continuar el flujo
        })
      )
      .subscribe(
        (response: any) => {
          if (response) {
            
            this.__notifyService.notify('success', response);
            this.getLista({});
          }
        },
        (error: any) => {          
          this.__errorservices.msjError(error);
        }
      );          
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


  /** Método para obtener mensajes de error */
  getErrorMessage(control: any): string {
    if(this.objDataForm) {
      if ((this.objDataForm as any).ciftyp == '1' && (this.objDataForm as any).cif.length != 8) {
        if (control?.hasError('dni')) {
          return 'El DNI tiene 8 digitos';
        }
      }
    }
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
    // Solo se aceptan 8 números
    if (control?.hasError('dni')) {
      return 'El DNI tiene 8 digitos';
    }
    // Solo se aceptan 11 números
    if (control?.hasError('ruc')) {
      return 'El RUC tiene 11 digitos';
    }
    // Solo se aceptan 12 números
    if (control?.hasError('ce')) {
      return 'El Carnet de Extranjería tiene 12 digitos';
    }
    return '';
  }
  
}
