import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorService } from 'src/app/services/error.service';
import { TerceroService } from 'src/app/services/tercero.service';
import { numericValidator } from 'src/assets/validator';
import { AdressService } from 'src/app/services/adress.service';

//** Creación de una interfaz para los input de tipo select */
export interface Selector {
  label     : string;
  value     : string;
}

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

  options_dis: Selector[] = [
    { label: 'Lima',        value: 'L' },
    { label: 'Arequipa',    value: 'A' },
    { label: 'Cusco',       value: 'C' },
    { label: 'Puno',        value: 'P' },
    { label: 'Tacna',       value: 'T' },
  ]

  options_prv: Selector[] = [
    { label: 'Lima',        value: 'L' },
    { label: 'Arequipa',    value: 'A' },
    { label: 'Cusco',       value: 'C' },
    { label: 'Puno',        value: 'P' },
    { label: 'Tacna',       value: 'T' },
  ]

  options_dep: Selector[] = [] /* [
    { label: 'Lima',        value: 'L' },
    { label: 'Arequipa',    value: 'A' },
    { label: 'Cusco',       value: 'C' },
    { label: 'Puno',        value: 'P' },
    { label: 'Tacna',       value: 'T' },
  ] */

  

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
    { type: 'select',   label: 'Tipo de dirección',     name: 'tipdir',     required: true,   options: this.options_di  },
    { type: 'text',     label: 'Dirección',             name: 'direccion',  required: true, },
    { type: 'select',   label: 'Distrito',              name: 'coddis',     required: true,   options: this.options_dis },
    { type: 'select',   label: 'Provincia',             name: 'codprv',     required: true,   options: this.options_prv},
    { type: 'select',   label: 'Departameto',           name: 'coddep',     required: true,   options: this.options_dep },
    { type: 'text',     label: 'Contacto',              name: 'contac',     required: true  },
    { type: 'text',     label: 'Num. Celular',          name: 'telef1',     required: false },
    { type: 'text',     label: 'Correo Electronico',    name: 'email',      required: true  },
  ];

  constructor(private __formbuilder: FormBuilder,
    private __errorservices: ErrorService,
    private __tercerService: TerceroService,
    private __adressService: AdressService,
    private cdr: ChangeDetectorRef) {
    /** Uso de FormBuilder para crear el formulario */
    this.form = this.__formbuilder.group({});
    this.getDepartamentos()
    this.createForm();
  }
  
  ngOnInit(): void {
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

  /**
   * Método para obtener el código del tercero
   */
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

  /** Método para traer los departamentos */
  getDepartamentos() {
    this.__adressService.getCodigo()
      .subscribe(
        (response: Selector[]) => {
          this.options_dep = response;  
          console.log(this.options_dep, '1');
                  
        },
        (error: any) => {
          this.__errorservices.msjError(error);
        }
        );
        console.log(this.options_dep, '2');
  }
  
  /** Metodo para optener los datos insertados en el formulario */
  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
      this.__tercerService.postCodigo(this.form.value)
        .subscribe(
          (response: any) => {
            console.log(response);
          },
          (error: any) => {
            this.__errorservices.msjError(error);
          }
        );
      
    }
  }

  
}
