import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorService } from 'src/app/services/error.service';
import { TerceroService } from 'src/app/services/tercero.service';
import { numericValidator } from 'src/assets/validator';
import { AdressService } from 'src/app/services/adress.service';
import { NotifierService } from 'angular-notifier';
import { Router, NavigationEnd } from '@angular/router';

//** Creación de una interfaz para los input de tipo select */
export interface Selector {
  label     : string;
  value     : string;
}

export interface PeriodicElement {
  id: number;
  name: string;
  work: string;
  project: string;
  priority: string;
  badge: string;
  budget: string;
}

/* const ELEMENT_DATA: PeriodicElement[] = [
  { id: 1, name: 'Deep Javiya', work: 'Frontend Devloper', project: 'Flexy Angular', priority: 'Low', badge: 'badge-info', budget: '$3.9k' },
  { id: 2, name: 'Nirav Joshi', work: 'Project Manager', project: 'Hosting Press HTML', priority: 'Medium', badge: 'badge-primary', budget: '$24.5k' },
  { id: 3, name: 'Sunil Joshi', work: 'Web Designer', project: 'Elite Admin', priority: 'High', badge: 'badge-danger', budget: '$12.8k' },
  { id: 4, name: 'Maruti Makwana', work: 'Backend Devloper', project: 'Material Pro', priority: 'Critical', badge: 'badge-success', budget: '$2.4k' },
];
 */

/** Cración de una interfaz para los campos del formulario */
interface Field {
  type          : string;
  label         : string;
  name          : string;
  options?      : Selector[];
  required      : boolean;
  disabled?     : boolean;
  onChange?     : () => void;
  validators?   : any[];
  defaultValue? : any;
}

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

  options_di: Selector[] = [
    { label: 'Dirección Fiscal',   value: '0' },
    { label: 'Dirección 1',        value: '1' },
    { label: 'Dirección 2',        value: '2' },
    { label: 'Dirección 3',        value: '3' },
    { label: 'Dirección 4',        value: '4' },
  ]

  options_dis: Selector[] = []
  options_prv: Selector[] = []
  options_dep: Selector[] = []

  /** Creación de un formulario */
  form: FormGroup;
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

  fields2: Field[] = [
    { type: 'select',   label: 'Tipo de dirección',     name: 'tipdir',     required: true,   options: this.options_di, defaultValue: '0'},
    { type: 'select',   label: 'Departameto',           name: 'coddep',     required: true,   options: this.options_dep, onChange: this.onPrvChange.bind(this) ,defaultValue: '15' },
    { type: 'select',   label: 'Provincia',             name: 'codprv',     required: true,   options: this.options_prv, onChange: this.onDisChange.bind(this) },
    { type: 'select',   label: 'Distrito',              name: 'coddis',     required: true,   options: this.options_dis },
    { type: 'text',     label: 'Dirección',             name: 'direcc',     required: true, },
    { type: 'text',     label: 'Contacto',              name: 'contac',     required: false },
    { type: 'text',     label: 'Num. Celular',          name: 'telef1',     required: true },
    { type: 'text',     label: 'Correo Electronico',    name: 'email',      required: false },
  ];

  displayedColumns: string[] = ['id', 'assigned', 'name', 'priority', 'budget'];
  dataSource : PeriodicElement[] = [
    /* { id: 1, name: 'Deep Javiya', work: 'Frontend Devloper', project: 'Flexy Angular', priority: 'Low', badge: 'badge-info', budget: '$3.9k' },
    { id: 2, name: 'Nirav Joshi', work: 'Project Manager', project: 'Hosting Press HTML', priority: 'Medium', badge: 'badge-primary', budget: '$24.5k' },
    { id: 3, name: 'Sunil Joshi', work: 'Web Designer', project: 'Elite Admin', priority: 'High', badge: 'badge-danger', budget: '$12.8k' },
    { id: 4, name: 'Maruti Makwana', work: 'Backend Devloper', project: 'Material Pro', priority: 'Critical', badge: 'badge-success', budget: '$2.4k' },
   */];;

  constructor(
    private __formbuilder   : FormBuilder,
    private __errorservices : ErrorService,
    private __tercerService : TerceroService,
    private __adressService : AdressService,
    private __changeDetRef  : ChangeDetectorRef,
    private __notifyService : NotifierService,
    private __router        : Router,
  ) {
    /** Uso de FormBuilder para crear el formulario */
    this.form = this.__formbuilder.group({});
    this.createForm();
  }
  
  ngOnInit(): void {
    this.getListaTerceros();
    this.getDepartamentos();
    this.onPrvChange();
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

    this.fields2.forEach(field => {
      const control = this.__formbuilder.control(
        { value: field.defaultValue ?? '', disabled: field.disabled ?? false },
        this.buildValidators(field)
      );
      this.form.addControl(field.name, control);
    });
  }

  /** Método para obtener el código del tercero */
  onSelectChange(): void {
    if(this.form.get('terType')?.value){
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

  /** Metodo que escucha el cambio de departamentos y trae las provincias */
  onPrvChange(): void {
    if(this.form.get('coddep')?.value){
      this.getProvincias(this.form.get('coddep')?.value);
    }
  }

  /** Metodo que escucha el cambio de provincias y trae las distritos */
  onDisChange(): void {
    if(this.form.get('coddep')?.value && this.form.get('codprv')?.value){
      this.getDistritos(this.form.get('coddep')?.value, this.form.get('codprv')?.value);
    }
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

  /** Método para traer la lista de terceros */
  getListaTerceros() {
    this.__tercerService.getListaTerceros()
      .subscribe(
        (response: any) => {
          this.dataSource = response;
        },
        (error: any) => {
          this.__errorservices.msjError(error);
        }
      );
  }

  /** Método para traer los departamentos */
  getDepartamentos() {
    this.__adressService.getDeparta()
      .subscribe(data => {
         //this.options_dep = data;
          this.updateFieldOptions('coddep', data);
          this.__changeDetRef.detectChanges();
      });
  }

  /** Método para traer las provincias segun el departamento */
  getProvincias(coddep: string) {
    this.__adressService.postProvincia(coddep)
      .subscribe(data => {
          this.updateFieldOptions('codprv', data);
          this.__changeDetRef.detectChanges();
      });
  }

  /** Metodo para traer los distritos segun departamento y provincia */
  getDistritos(coddep: string, codprv: string) {
    this.__adressService.postDistrito(coddep, codprv)
      .subscribe(data => {
          this.updateFieldOptions('coddis', data);
          this.__changeDetRef.detectChanges();
      });
  }

  /** Metodo para actualizar el option */
  updateFieldOptions(fieldName: string, options: Selector[]) {
    const field = this.fields2.find(f => f.name === fieldName);
    if (field) {
        field.options = options;
    }
  }

  /** Método para resetear el formulario y mantener los valores predeterminados */
  resetForm() {
    this.form.reset();
    this.fields.forEach(field => {
      this.form.get(field.name)?.setValue(field.defaultValue ?? '');
    });
    this.fields2.forEach(field => {
      this.form.get(field.name)?.setValue(field.defaultValue ?? '');
    });
  }  
  
  debugFormStates() {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      console.log(key, 'pristine:', control?.pristine, 'untouched:', control?.untouched, 'status:', control?.status);
    });
  }

  resetComponent() {
    const currentUrl = this.__router.url;
  
    this.__router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.__router.navigate([currentUrl]);
    });
  }
  

  /** Metodo para optener los datos del formulario e insertarlo */
  onSubmit() {
    if (this.form.valid) {
      this.__tercerService.postCodigo(this.form.value)
        .subscribe(
          (response: any) => {
            this.__notifyService.notify('success', response.msg);
            setTimeout(() => {
              this.resetForm();
            }, 2000);
          },
          (error: any) => {
            this.__errorservices.msjError(error);
          }
        );
    }
  }
  
  
}
