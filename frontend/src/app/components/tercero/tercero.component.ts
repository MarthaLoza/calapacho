import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorService } from 'src/app/services/error.service';
import { TerceroService } from 'src/app/services/tercero.service';
import { numericValidator } from 'src/assets/validator';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Field, Selector, TercerElement } from 'src/app/interfaces/user';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteComponent } from '../form-dialogs/dialog-delete/dialog-delete.component';
import { DialogUpdateComponent } from '../form-dialogs/dialog-update/dialog-update.component';
import { DialogFilterComponent } from '../form-dialogs/dialog-filter/dialog-filter.component';

@Component({
  selector: 'app-tercero',
  templateUrl: './tercero.component.html',
  styleUrls: ['./tercero.component.scss']
})
export class TerceroComponent implements OnInit, AfterViewInit {

  options_tt: Selector[] = [
    { label: 'Usuario',         value: 'C' },
    { label: 'Empresa',         value: 'E' },
    { label: 'Transportista',   value: 'T' },
  ];

  options_td: Selector[] = [
    { label: 'RUC',         value: '0' },
    { label: 'DNI',         value: '1' },
    { label: 'Carnet Extranjería',  value: '2' },
  ];

  options_te: Selector[] = [
    { label: 'Activo',      value: 'A' },
    { label: 'Inactivo',    value: 'I' },
  ];
  
  /** Creación de un formulario */
  form    : FormGroup;
  fields  : Field[] = [
    { type: 'select',   label: 'Tipo de tercero',       name: 'terType',  required: true, options: this.options_tt, onChange: this.onGenerateCodeChange.bind(this)  },
    { type: 'text',     label: 'Código',                name: 'codigo',   required: true,                           },
    { type: 'text',     label: 'Nombre o Razon social', name: 'nombre',   required: true                            },
    { type: 'text',     label: 'Nombre auxiliar',       name: 'nomaux',   required: false                           },
    { type: 'select',   label: 'Tipo de documento',     name: 'ciftyp',   required: true, options: this.options_td, defaultValue: '0'  },
    { type: 'text',     label: 'Numero de documento',   name: 'cif',      required: true, validators: [numericValidator] },
    { type: 'text',     label: 'Comentario',            name: 'coment',   required: false                           },
    { type: 'select',   label: 'Estado',                name: 'estado',   required: true, options: this.options_te, defaultValue: 'A'  },
  ];
  
  cod_tercer        = '';                 // Variable para controlar el código del tercero
  valid_bot_reset   = false;              // Variable para controlar el botón de reset
  valid_bot_update  = true;               // Variable para controlar el botón de actualizar
  valid_bot_delete  = false;              // Variable para controlar el botón de eliminar
  valid_bot_prev    = false;              // Variable para controlar el botón de retroceder
  valid_bot_next    = false;              // Variable para controlar el botón de avanzar
  user_action       = true;               // Variable para controlar la acción del usuario
  index_table       = 0;                  // Variable para controlar el indice de la tabla
  seqno_tercer      = null;               // Variable para controlar el seqno del tercero
  validacion_if     = true;               // Validación de la tabla y el filtro
  arr_data          : Field[] = [];       // Array para enviar datos al filtro
  filter_data       : object  = {};       // Objeto para enviar datos al servicio de filtro



  //table   : string = 'Ctercero';
  //objCond : number = 0;

  dataTable : Array<object> = [];




  /** Columnas de la tabla */
  displayedColumns  : string[] = ['seqno', 'codigo', 'nombre', 'cif'];
  dataSource        : MatTableDataSource<TercerElement>;
  selectedRow       : TercerElement | null = null;
  
  @ViewChild(MatPaginator) paginator    : MatPaginator | undefined;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;
  }

  constructor(
    private __formbuilder   : FormBuilder,
    private __errorservices : ErrorService,
    private __tercerService : TerceroService,
    private __notifyService : NotifierService,
    private __router        : Router,
    private __dialog        : MatDialog
  ) {
    /** Uso de FormBuilder para crear el formulario */
    this.form       = this.__formbuilder.group({});
    this.dataSource = new MatTableDataSource<TercerElement>([]);
    this.createForm();
    this.listenToFormChanges();
  }
  
  ngOnInit(): void {
    this.getListaTerceros(this.filter_data);    
    this.dataFilter(this.fields);
    this.getLista();
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

  dataFilter(data: Field[]) {
    data.forEach(field => {
      this.arr_data.push({
        type: field.type,
        label: field.label,
        name: field.name,
        options: field.options,
      });
    });
  }

  /* *************************************************************************** */
  /*                        Métodos para abrir Dialogos                          */
  /* *************************************************************************** */

  /** Método para abrir el dialogo de eliminar un registro */
  openDialogDelete(): void {
    const dialogRef = this.__dialog.open(DialogDeleteComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.deleteForm();
      }
    });
  }

  /** Método para abrir el dialogo de Campos pendientes */
  openDialogUpdate(): Promise<boolean> {
    const dialogRef = this.__dialog.open(DialogUpdateComponent, {});

    return dialogRef.afterClosed().toPromise();
  }

  /** Método para abrir el dialogo de No hay registros al filtrar */
  openDialogFilter(): void {
    this.__dialog.open(DialogFilterComponent, {});
  }

  /* *************************************************************************** */
  /*                        Metodos que escuchan a campos                        */
  /* *************************************************************************** */

  /** Método para obtener el código del tercero */
  onGenerateCodeChange(): void {
    if(this.user_action && this.form.get('terType')?.value) {
      this.__tercerService.getCodigo(this.form.get('terType')?.value)
        .subscribe(
          (response: any) => {
            this.form.get('codigo')?.setValue(response);
          },
          (error: any) => {
            this.__errorservices.msjError(error);
          }
        );
    }
  }

  /** Metodo que escucha al formulario, si se edita se desactiva el botón de reset */
  listenToFormChanges() {

    /** Recorremos el formulario */
    this.fields.forEach(field => {

      const control = this.form.get(field.name); /** Se obtiene el controlName de cada input */
      this.form.valueChanges.subscribe(() => {
        /** Validamos si se toca algun input por el usuario */
        if(control?.pristine == false || control?.untouched == false){
          this.valid_bot_reset  = true;
          this.valid_bot_delete = true;

          if(this.selectedRow) {
            /** Igualamos el valor del botón a la validación del fomulario
             * para asegurarnos que no se pase ninguna validación de campos */
            this.valid_bot_update = !this.form.valid; // Activamos el botón de actualizar
          }
        }
      });
    });
  }

  /** Método para manejar el clic en una fila de la tabla */
  onRowClicked(row: TercerElement | null = null, index: number = 0) {
    
    /** Le damos el valor de la primera fila de la tabla */
    if (row) {
      this.selectedRow = row;
      this.index_table = this.dataSource.data.indexOf(row);
    } else {
      this.selectedRow = this.dataSource.data[this.index_table];
    }

    /**  Calcula la página en la que debe estar el índice seleccionado */
    const pageSize = this.paginator?.pageSize || 10;
    const newPageIndex = Math.floor(this.index_table / pageSize);
    
    /** Si hay un paginator, cambia la página */
    if (this.paginator) {
      this.paginator.pageIndex = newPageIndex;
      this.dataSource.paginator = this.paginator; // Refresca el paginator
    }
    
    this.user_action = false; // Desactivo la accion del usuario
    
    const data = this.selectedRow;
    /** Se pinta la información en los compos del formulario */
    this.form.get('terType')?.setValue(data?.codigo[0]);
    this.form.get('codigo')?.setValue(data?.codigo);
    this.form.get('nombre')?.setValue(data?.nombre);
    this.form.get('nomaux')?.setValue(data?.nomaux);
    this.form.get('ciftyp')?.setValue(data?.ciftyp);
    this.form.get('cif')?.setValue(data?.cif);
    this.form.get('coment')?.setValue(data?.coment);
    this.form.get('estado')?.setValue(data?.estado);

    this.cod_tercer       = data?.codigo;

    this.valid_bot_reset  = false;  // Activo el botón de reset
    this.valid_bot_update = true;   // Desactivo el botón de actualizar
    this.valid_bot_delete = false;  // Activo el botón de eliminar
    this.user_action      = true;   // Activo la acción del usuario

    this.valid_bot_prev   = this.index_table > 0 ? false : true;  // Condiciono el botón de retroceder
    this.valid_bot_next   = this.index_table < this.dataSource.data.length - 1 ? false : true;  // Condiciono el botón de avanzar
    //this.objCond          = this.selectedRow.seqno    
  }

  /** Metodo para guardar el id de la selección del tercero de la tabla */
  restoreSelectedRow() {
    let selectedRowId     = this.selectedRow ? this.selectedRow.seqno : this.seqno_tercer;
    const newSelectedRow  = this.dataSource.data.find(row => row.seqno === selectedRowId);

    if (newSelectedRow) {
      this.onRowClicked(newSelectedRow);
    }

    this.seqno_tercer = null;
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

  /* *************************************************************************** */
  /*                        Metodos que traen datos                              */
  /* *************************************************************************** */

  /** Método para traer la lista de terceros */
  getListaTerceros(filterData: object) {
    this.__tercerService.getListaTerceros(filterData)
      .subscribe(
        (response: any) => {
          /** Asignamos los datos a dataSource */
          this.dataSource.data = response;
          //this.dataTable = response;
          /** Si no se a selccionado nada (al inicio) */
          if(!this.selectedRow && !this.seqno_tercer) {
            
            this.onRowClicked();
          } else {
            
            if (this.selectedRow && this.seqno_tercer) {
              this.selectedRow.seqno = this.seqno_tercer;
            }
            /** Llamamos al metodo que guarda seqnos del tercero */
            this.restoreSelectedRow();
          }
        },
        (error: any) => {
          this.__errorservices.msjError(error);
        }
      );      
  }

  /* *************************************************************************** */
  /*                           Limpieza de formulario                            */
  /* *************************************************************************** */

  /** Método para resetear el formulario y mantener los valores predeterminados */
  resetForm() {
    this.form.reset();        // Reseteo el formulario
    
    /** Asigno los datos por defecto del formulario */
    this.fields.forEach(field => {
      this.form.get(field.name)?.setValue(field.defaultValue ?? '');      
    });
    
    this.valid_bot_reset  = true;   // Desactivo el botón de reset
    this.valid_bot_update = true;   // Desactivo el botón de actualizar
    this.valid_bot_delete = true;   // Desactivo el botón de eliminar
    this.cod_tercer       = '';     // Vacio el valor del código tercer
    this.dataSource.data  = [];     // Vacio la tabla
    this.selectedRow      = null;   // Vacio la fila seleccionada
  }
  
  /** Método para obtener los estados del formulario */
  debugFormStates() {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      console.log(key, 'pristine:', control?.pristine, 'untouched:', control?.untouched, 'status:', control?.status);
    });
  }

  /** Método para resetear el componente y te redirige de nuevo al mismo */
  resetComponent() {
    const currentUrl = this.__router.url;
  
    this.__router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.__router.navigate([currentUrl]);
    });
  }

  /* *************************************************************************** */
  /*                           Botones del formulario                            */
  /* *************************************************************************** */
  
  /** Metodo para insertar tercero */
  insertForm() {
    if (this.form.valid) {
        
      /** Insertamos el nuevo tercero */
      this.__tercerService.postTercero(this.form.value)
        .subscribe(
          (response: any) => {
            this.seqno_tercer = response.data.seqno;                // Guardamos el seqno del tercero
            this.__notifyService.notify('success', response.msg);   // Mostramos un mensaje de notificación
            this.getListaTerceros(this.filter_data)                 // Llamamos a los datos de la tabla
          },
          (error: any) => {
            this.__errorservices.msjError(error);
            console.log(error);            
          }
        );
    }
  }

  /** Método para actualizar un tercero */
  updateForm(){
    if(this.form.valid){
      this.__tercerService.putTercero(this.form.value, this.selectedRow?.seqno || 0)
        .subscribe(
          (response: any) => {
            this.__notifyService.notify('success', response.msg);
            setTimeout(() => {
              this.getListaTerceros(this.filter_data)
            }, 1000);
          },
          (error: any) => {
            this.__errorservices.msjError(error);
          }
        );
    }
  }

  /** Metodo para eliminar un tercero */
  deleteForm() {
    this.__tercerService.deleteTercero(this.cod_tercer)
      .subscribe(
        (response: any) => {
          this.__notifyService.notify('success', response.msg);
          this.dataSource.data  = [];
          this.selectedRow      = null;
          this.cod_tercer       = '';
          this.getListaTerceros(this.filter_data);
        },
        (error: any) => {
          this.__errorservices.msjError(error);
        }
      );
  }

  /** Método para retroceder entre las filas de la tabla */
  async prevBoton() {
    if (this.index_table > 0) {
      if(this.valid_bot_update == false) {
        const validation = await this.openDialogUpdate();
        if(validation){
          this.index_table--;
          this.onRowClicked(this.dataSource.data[this.index_table], this.index_table);
        }
      } else {
        this.index_table--;
        this.onRowClicked(this.dataSource.data[this.index_table], this.index_table);
      }
    }    
  }

  /** Método para avanzar entre las filsa de la tabla */
  async nextBoton() {    
    if (this.index_table < this.dataSource.data.length - 1) {
      
      if(this.valid_bot_update == false) {
        const validation = await this.openDialogUpdate();
        if(validation){
          this.index_table++;
          this.onRowClicked(this.dataSource.data[this.index_table], this.index_table);
        }
      } else {
        this.index_table++;
        this.onRowClicked(this.dataSource.data[this.index_table], this.index_table);
      }
    }
  }

  /** Método para refrescar el componente */
  async refreshBoton() {
    if(this.valid_bot_update == false) {
      const validation = await this.openDialogUpdate();
      if(validation){
        this.resetComponent();
      }      
    } else {
      this.resetComponent();
    }
  }

  /** Método para filtrar la tabla */
  async searchBoton() {
    if(this.valid_bot_update == false) {
      const validation = await this.openDialogUpdate();
      if(validation){
        this.validacion_if = !this.validacion_if;
      }
    } else {
        this.validacion_if = !this.validacion_if;
    }
  }

  /* *************************************************************************** */
  /*                                   Eventos                                   */
  /* *************************************************************************** */

  /** Método para buscar por filtros */
  searchEvent(filterData: object): void {
    
    this.filter_data      = filterData;         // Apartir de ahora la lista de terceros se filtrará

    this.dataSource.data  = [];                 // Vaciamos la tabla
    this.selectedRow      = null;               // Vaciamos la fila seleccionada
    this.cod_tercer       = '';                 // Vaciamos el código del tercero
    this.form.reset();                          // Reseteamos el formulario

    this.getListaTerceros(this.filter_data);    // Llamamos a los datos de la tabla
    
    this.validacion_if  = !this.validacion_if;

  }
  







  /* ************************************************************************************************** */
  /*                                   TEEEEEEEEST                                                      */
  /* ************************************************************************************************** */


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

    this.dataTable = viewDataTable;
  }

}