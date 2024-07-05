import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorService } from 'src/app/services/error.service';
import { TerceroService } from 'src/app/services/tercero.service';
import { numericValidator } from 'src/assets/validator';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Field, Selector, TercerElement } from 'src/app/interfaces/user';

@Component({
  selector: 'app-tercero',
  templateUrl: './tercero.component.html',
  styleUrls: ['./tercero.component.scss']
})
export class TerceroComponent implements OnInit {

  options_tt: Selector[] = [
    { label: 'Usuario',     value: 'C' },
    { label: 'Empresa',     value: 'E' },
    { label: 'Conductor',   value: 'T' },
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
  form  : FormGroup;
  fields: Field[] = [
    { type: 'select',   label: 'Tipo de tercero',       name: 'terType',  required: true, options: this.options_tt, onChange: this.onSelectChange.bind(this)  },
    { type: 'text',     label: 'Código',                name: 'codigo',   required: true,                           },
    { type: 'text',     label: 'Nombre o Razon social', name: 'nombre',   required: true                            },
    { type: 'text',     label: 'Nombre auxiliar',       name: 'nomaux',   required: false                           },
    { type: 'select',   label: 'Tipo de documento',     name: 'ciftyp',   required: true, options: this.options_td, defaultValue: '0'  },
    { type: 'text',     label: 'Numero de documento',   name: 'cif',      required: true, validators: [numericValidator] },
    { type: 'text',     label: 'Comentario',            name: 'coment',   required: false                           },
    { type: 'select',   label: 'Estado',                name: 'estado',   required: true, options: this.options_te, defaultValue: 'A'  },
  ];
  
  cod_tercer        = '';     // Variable para controlar el código del tercero
  valid_bot_reset   = false;  // Variable para controlar el botón de reset
  valid_bot_update  = true;   // Variable para controlar el botón de actualizar
  valid_bot_delete  = false;  // Variable para controlar el botón de eliminar
  user_action       = true;   // Variable para controlar la acción del usuario
  index_table       = 0;      // Variable para controlar el indice de la tabla
  seqno_tercer      = null;   // Variable para controlar el seqno del tercero

  /** Columnas de la tabla */
  displayedColumns  : string[] = ['seqno', 'codigo', 'nombre', 'cif'];
  dataSource        : MatTableDataSource<TercerElement>;
  //clickedRows       = new Set<TercerElement>();
  selectedRow       : TercerElement | null = null;
  
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;
  }

  constructor(
    private __formbuilder   : FormBuilder,
    private __errorservices : ErrorService,
    private __tercerService : TerceroService,
    private __notifyService : NotifierService,
    private __router        : Router,
  ) {
    /** Uso de FormBuilder para crear el formulario */
    this.form       = this.__formbuilder.group({});
    this.dataSource = new MatTableDataSource<TercerElement>([]);
    this.createForm();
    this.listenToFormChanges();
  }
  
  ngOnInit(): void {
    this.getListaTerceros();
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

  /* *************************************************************************** */
  /*                        Metodos que escuchan a campos                        */
  /* *************************************************************************** */

  /** Método para obtener el código del tercero */
  onSelectChange(): void {
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
        /** Validammos si se toca algun input */
        if(control?.pristine == false || control?.untouched == false){
          this.valid_bot_reset  = true;
          this.valid_bot_delete = true;

          if(this.selectedRow) {
            this.valid_bot_update = false; // Activamos el botón de actualizar
          }
        }
      });      
    });
  }

  /** Método para manejar el clic en una fila de la tabla */
  onRowClicked(row: TercerElement | null = null) {
    
    /** Le damos el valor de la primera fila de la tabla */
    this.selectedRow = row ? row : this.dataSource.data[this.index_table];
    
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
  }

  /** Metodo para guardar el id de la selección del tercero de la tabla */
  restoreSelectedRow() {
    let selectedRowId     = this.selectedRow ? this.selectedRow.seqno : this.seqno_tercer;
    const newSelectedRow  = this.dataSource.data.find(row => row.seqno === selectedRowId);

    if (newSelectedRow) {
      this.onRowClicked(newSelectedRow);
    }
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
  getListaTerceros() {
    this.__tercerService.getListaTerceros()
      .subscribe(
        (response: any) => {
          /** Asignamos los datos a dataSource */
          this.dataSource.data = response;

          /** Si no se a selccionado nada (al inicio) */
          if(!this.selectedRow) {
            this.onRowClicked();
          }else{
            /** if para tomar la selección de un tercero que acabamos de insertar */
            if(this.seqno_tercer){
              console.log(this.seqno_tercer, "SEQNO");
              
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
    //this.user_action = false; // Desactivo la acción del usuario
    
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
  
  /** Metodo para optener los datos del formulario e insertarlo */
  onSubmit() {
    if (this.form.valid) {
      /** Validamos que se vuelva a calcular el código terero */
      this.onSelectChange();

      setTimeout(() => {
        
        /** Insertamos el nuevo tercero */
        this.__tercerService.postTercero(this.form.value)
        .subscribe(
          (response: any) => {
            this.seqno_tercer = response.data.seqno;
            this.__notifyService.notify('success', response.msg);
            setTimeout(() => {
              this.getListaTerceros()
            }, 1000);            
          },
          (error: any) => {
            this.__errorservices.msjError(error);
            console.log(error);            
          }
          );
      }, 2000);
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
              this.getListaTerceros()
            }, 2000);
          },
          (error: any) => {
            this.__errorservices.msjError(error);
          }
        );
    }
  }

  /** Metodo para eliminar un tercero */
  deleteForm() {
    
  }
  
}