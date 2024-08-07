import { Component, ViewChild } from '@angular/core';
import { Field, TercerElement, arrTypeCif, arrTypeStatus, arrTypeUser } from 'src/app/interfaces/user';
import { ErrorService } from 'src/app/services/error.service';
import { TerceroService } from 'src/app/services/tercero.service';
import { numericValidator } from 'src/assets/validator';
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
    { type: 'select',   label: 'Tipo de tercero',       name: 'terType',  required: true, options: arrTypeUser,   defaultValue: 'T',                onChange: this.generationTercerCode.bind(this) },
    { type: 'text',     label: 'Código',                name: 'codigo',   required: true,                           },
    { type: 'text',     label: 'Nombre o Razon social', name: 'nombre',   required: true                            },
    { type: 'text',     label: 'Nombre auxiliar',       name: 'nomaux',   required: false                           },
    { type: 'select',   label: 'Tipo de documento',     name: 'ciftyp',   required: true, options: arrTypeCif,    defaultValue: '0'  },
    { type: 'text',     label: 'Numero de documento',   name: 'cif',      required: true,                         validators: [numericValidator] },
    { type: 'text',     label: 'Comentario',            name: 'coment',   required: false                           },
    { type: 'select',   label: 'Estado',                name: 'estado',   required: true, options: arrTypeStatus, defaultValue: 'A'  },
  ];

  boolFormModific   = false;
  boolFormValid     = false;
  boolActionUser    = false;
  strInitialTercer  = '';
  strCodeGenerated  = null;
  strTablesNames    = ['Cterdire', 'Ctercero']; // Si hay tanlas referenciadas, enviarla tabla principal al final
  strIdName         = 'codigo';
  strColumnDelete   = 'terType';  // Secrea para poder enviar columnas que quiero eliminar de un objeto, en este caso del update

  arrDataTable    : Array<object>          = []; // Datos de la tabla, ordenada para la vista del usuario
  arrDataForm     : Array<TercerElement>   = []; // Todos los datos de terceros
  arrFieldSearch  : Field[] = [];

  constructor(
    private __tercerService : TerceroService,
    private __queryService  : QueryService,
    private __errorservices : ErrorService,
    private __notifyService : NotifierService,
  ) {
    this.getLista();
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
   * datos del formulario ya que escuche los cambios del mismo.
   */
  boolFormOut(boolFormOut: Array<any>) {
    this.boolFormModific  = boolFormOut[0];
    this.boolFormValid    = boolFormOut[1];
    this.strInitialTercer = boolFormOut[2].terType;
    this.boolActionUser   = boolFormOut[3];
  }

  boolRefreshTable(boolRefreshTable: boolean) {
    if(boolRefreshTable){
      this.getLista();
    }
  }

  arrDataSearch(arrDataSearch: any) {    
    this.__tercerService.getListaTerceros(arrDataSearch)
      .subscribe(
        response => {
          if(response.length != 0) {
            this.assembleTableData(response)
          }
        },
        error => {
          this.__errorservices.msjError(error);
        }
      )
  }

  /****************************************************** */
  /*    SE ALISTAN LOS DATOS PARA ENVIAR AL FOMULARIO     */
  /****************************************************** */

  /** Selecciona la data que se muestra en la tabla */
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
    this.arrDataForm  = data;    
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

  /** Data de los tercero */
  getLista() {
    this.__tercerService.getListaTerceros({})
      .subscribe(
        response => {
          if(response.length != 0) {
            this.assembleTableData(response)
          }
        },
        error => {
          this.__errorservices.msjError(error); 
        }
      )
  }

  /** Genera el código del tercero */
  generationTercerCode() {    
    this.__tercerService.getCodigo(this.strInitialTercer)
      .subscribe(
        (response: any) => {
          if(this.boolActionUser) {
            /**
             * Este es un ejemplo de como se puede actualizar campos del
             * fomulario ya con datos, aquí se actualiza el campo 'codigo'
             */
            this.formOneData.updateField('codigo', response);
          }
        },
        (error: any) => {
          this.__errorservices.msjError(error);
        }
      );
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
    
    this.__tercerService.getCodigo(this.strInitialTercer)
      .pipe(
        switchMap((response: any) => {
          arrData.codigo = response;          
          return this.__queryService.insertOneRow([this.strTablesNames[1], arrData]);
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
            this.getLista();
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
  
}
