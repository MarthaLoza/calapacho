import { Component, Input, ViewChild } from '@angular/core';
import { arrTypeDirec, DirecTercero, Field } from 'src/app/interfaces/user';
import { AdressService } from 'src/app/services/adress.service';
import { ErrorService } from 'src/app/services/error.service';
import { TerceroService } from 'src/app/services/tercero.service';
import { emailValidator, numericValidator } from 'src/assets/validator';
import { FormOneDataComponent } from '../form-one-data/form-one-data.component';
import { QueryService } from 'src/app/services/query-basic.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-cterdire',
  templateUrl: './cterdire.component.html',
  styleUrls: ['./cterdire.component.scss']
})
export class CterdireComponent {

  @ViewChild(FormOneDataComponent) formOneData!: FormOneDataComponent; // Obtenemos una referencia al componente

  //@Input() strCodeTercero : string = '';

  arrFormField: Field[] = [
    { type: 'select',   label: 'Tipo de dirección',     name: 'tipdir',     required: true,   options: arrTypeDirec,      defaultValue: 0},
    { type: 'select',   label: 'Departameto',           name: 'coddep',     required: true ,  defaultValue: '15' },
    { type: 'select',   label: 'Provincia',             name: 'codprv',     required: true  },
    { type: 'select',   label: 'Distrito',              name: 'coddis',     required: true  },
    { type: 'text',     label: 'Dirección',             name: 'direcc',     required: true, },
    { type: 'text',     label: 'Contacto',              name: 'contac',     required: false },
    { type: 'text',     label: 'Num. Celular',          name: 'telef1',     required: true,   validators: [numericValidator]  },
    { type: 'text',     label: 'Correo Electronico',    name: 'email',      required: false,  validators: [emailValidator] },
  ];

  strTablesNames    = ['Cterdire'];   // Si hay tanlas referenciadas, enviarla tabla principal al final
  strIdName         = 'codigo';       // Nombre del campo que dará la condición para actualizar o eliminar
  objDataForm       = {};
  boolActionUser    = false;

  strCodeTercero  : string                = 'T0001';
  arrDataTable    : Array<object>         = []; // Datos de la tabla, ordenada para la vista del usuario
  arrDataAll      : Array<DirecTercero>   = []; // Todos los datos de terceros
  arrFieldSearch  : Field[]               = [];

  arrAllDepart    : Array<object>         = [];
  arrTerProvin    : Array<object>         = [];
  arrTerDistri    : Array<object>         = [];

  constructor(
    private __terceroService: TerceroService,
    private __errorservices : ErrorService,
    private __adressService : AdressService,
    private __queryServise  : QueryService,
    private __notifyService : NotifierService
  ) {}

  ngOnInit(): void {
    this.getLista({});
    this.getDepart();    
  }

  ngAfterViewInit() {
    this.dataFilter(this.arrFormField);
    // Podemos acceder al componente formOneData después de la vista se ha inicializado
  }

  /****************************************************** */
  /*    SE ALISTAN LOS DATOS PARA ENVIAR AL FOMULARIO     */
  /****************************************************** */

  /** 
   * Se alista la data que se mostrará en la tabla y se asigna
   * a la variable arrDataAll toda la data de direcciones para
   * un tercer que trae el servicio.
   */
  assembleTableData(data : Array<DirecTercero>) {
    let viewDataTable = [];

    for(let fila of data) {
      viewDataTable.push({
        't._dirección'  : fila.nomdir,
        'dirección'     : fila.direcc,
        'celular'       : fila.telef1,
        'email'         : fila.email
      })
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

  /** Servicio que trae las direcciones por tercero */
  getLista(arrData : object) {
    (arrData as any).codigo = this.strCodeTercero;
    console.log(arrData, "DATA");
    
    this.__terceroService.getDireccionesTercero(arrData)
      .subscribe(
        (response: any) => {
          console.log(response, "RESPONSE");
          
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

  /** Servicio que trae departamentos */
  getDepart() {
    this.__adressService.getDeparta()
      .subscribe(
        (response: any) => {
          this.arrAllDepart = response ? response : [];
          this.updateFieldOptions('coddep', this.arrAllDepart);
        },
        (error: any) => {
          this.__errorservices.msjError(error);
        }
      )
  }

  /** Servicio que trae las provicias segun departamento */
  getProvinc(strCodDep : string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.__adressService.postProvincia(strCodDep)
        .subscribe(
          (response: any) => {
            this.arrTerProvin = response ? response : [];
            resolve(response);
            
          },
          (error: any) => {
            this.__errorservices.msjError(error);
          }
        )
    });
  }

  /** Servicio que trae distritos segun provincia */
  getDistrit(strCodDep : string, strCodPrv : string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.__adressService.postDistrito(strCodDep, strCodPrv)
        .subscribe(
          (response: any) => {
            this.arrTerDistri = response ? response : [];
            resolve(response);
          },
          (error: any) => {
            this.__errorservices.msjError(error);
          }
        )
    });
  }

  arrDataOutput(arrData: any ) {
    arrData.codigo = this.strCodeTercero;
    this.__queryServise.insertOneRow(['Cterdire', arrData] )
      .subscribe(
        (response: any) => {
          this.__notifyService.notify('success', response);
            this.getLista({});
        },
        (error: any) => {
          this.__errorservices.msjError(error); 
        }
      )
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
    this.objDataForm      = boolFormOut[0];
    this.boolActionUser   = boolFormOut[1];

    const srtCodeDep = (this.objDataForm as any).coddep;
    const strCodePrv = (this.objDataForm as any).codprv;
    
    if(srtCodeDep) this.updateColumnPrvDepart(srtCodeDep, strCodePrv);
  }

  updateColumnPrvDepart(srtCodeDep: any ,strCodePrv: any) {
    this.getProvinc(srtCodeDep)
      .then(response => {
        this.updateFieldOptions('codprv', this.arrTerProvin);

        if(strCodePrv) {
          this.getDistrit(srtCodeDep, strCodePrv)
            .then(response => {
              this.updateFieldOptions('coddis', this.arrTerDistri);
            })
            .catch(error => {
              console.error("Error al obtener los distritos", error);
            });
        } 
      })
      .catch(error => {
        console.error("Error al obtener las provincias", error);
      });
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
    arrDataSearch.codigo = this.strCodeTercero;
    console.log(arrDataSearch, "FILTRO");
    
    this.getLista(arrDataSearch);
  }


  /**************************************************** */
  /*         METODOS QUE AYUDAN A OTROS METODOS         */
  /**************************************************** */

  /** Método para obtener mensajes de error */
  getErrorMessage(control: any): string {
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

  updateFieldOptions(fieldName: string, options: any[]) {
    const field = this.arrFormField.find(f => f.name === fieldName);
    if (field) {
      field.options = options;
    }
  }

}
