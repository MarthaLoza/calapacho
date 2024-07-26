import { Component } from '@angular/core';
import { TercerElement, arrTypeCif, arrTypeStatus, arrTypeUser } from 'src/app/interfaces/user';
import { TerceroService } from 'src/app/services/tercero.service';
import { numericValidator } from 'src/assets/validator';

@Component({
  selector: 'app-terceros',
  templateUrl: './terceros.component.html',
  styleUrls: ['./terceros.component.scss']
})
export class TercerosComponent {

  arrFormField = [
    { type: 'select',   label: 'Tipo de tercero',       name: 'terType',  required: true, options: arrTypeUser, defaultValue: 'T' },
    { type: 'text',     label: 'Código',                name: 'codigo',   required: true,                           },
    { type: 'text',     label: 'Nombre o Razon social', name: 'nombre',   required: true                            },
    { type: 'text',     label: 'Nombre auxiliar',       name: 'nomaux',   required: false                           },
    { type: 'select',   label: 'Tipo de documento',     name: 'ciftyp',   required: true, options: arrTypeCif, defaultValue: '0'  },
    { type: 'text',     label: 'Numero de documento',   name: 'cif',      required: true, validators: [numericValidator] },
    { type: 'text',     label: 'Comentario',            name: 'coment',   required: false                           },
    { type: 'select',   label: 'Estado',                name: 'estado',   required: true, options: arrTypeStatus, defaultValue: 'A'  },
  ];

  boolFormModific     = false;
  boolFormValid       = false;

  arrDataTable : Array<object>  = [];
  objDataForm  : Array<object>  = [];

  constructor(
    private __tercerService: TerceroService
  ) {
    this.getLista();
  }
  
  /** Data del cliente enviada del formulario */
  arrDataOut(arrData: object) {
    console.log(arrData);
  }

  boolFormOut(boolFormOut: Array<boolean>) {
    this.boolFormModific  = boolFormOut[0];
    this.boolFormValid    = boolFormOut[1];
  }

  /** Data de los tercero */
  getLista() {
    this.__tercerService.getListaTerceros({})
      .subscribe(
        response => {
          this.assembleTableData(response)
        },
        error => {
          console.log(error);          
        }
      )
  }

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
    }
  
    this.arrDataTable = viewDataTable;
    this.objDataForm  = data;
  }
}
