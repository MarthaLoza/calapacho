import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DireccElement, Field, Selector } from 'src/app/interfaces/user';
import { AdressService } from 'src/app/services/adress.service';
import { ErrorService } from 'src/app/services/error.service';
import { TerceroService } from 'src/app/services/tercero.service';

@Component({
  selector: 'app-cterdire',
  templateUrl: './cterdire.component.html',
  styleUrls: ['./cterdire.component.scss']
})
export class CterdireComponent {

  options_di: Selector[] = [
    { label: 'Dirección Fiscal',   value: 0 },
    { label: 'Dirección 1',        value: 1 },
    { label: 'Dirección 2',        value: 2 },
    { label: 'Dirección 3',        value: 3 },
    { label: 'Dirección 4',        value: 4 },
  ]

  options_dis: Selector[] = []
  options_prv: Selector[] = []
  options_dep: Selector[] = []

  form2: FormGroup;
  fields2: Field[] = [
    { type: 'select',   label: 'Tipo de dirección',     name: 'tipdir',     required: true,   options: this.options_di, defaultValue: 0},
    { type: 'select',   label: 'Departameto',           name: 'coddep',     required: true,   options: this.options_dep, onChange: this.onPrvChange.bind(this) ,defaultValue: '15' },
    { type: 'select',   label: 'Provincia',             name: 'codprv',     required: true,   options: this.options_prv, onChange: this.onDisChange.bind(this) },
    { type: 'select',   label: 'Distrito',              name: 'coddis',     required: true,   options: this.options_dis },
    { type: 'text',     label: 'Dirección',             name: 'direcc',     required: true, },
    { type: 'text',     label: 'Contacto',              name: 'contac',     required: false },
    { type: 'text',     label: 'Num. Celular',          name: 'telef1',     required: true },
    { type: 'text',     label: 'Correo Electronico',    name: 'email',      required: false },
  ];

  private _cod_tercer: string | undefined;

  @Input()
  set cod_tercer(value: string | undefined) {
    this._cod_tercer = value;
    this.getDirecTercero();
  }
  
  get cod_tercer(): string | undefined {
    return this._cod_tercer;
  }

  displayedColumns  : string[] = ['nomdir', 'direcc', 'telef1'];
  dataSource        : MatTableDataSource<DireccElement>;
  clickedRows       = new Set<DireccElement>();
  selectedRow       : DireccElement | null = null;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;
  }
  

  constructor(
    private __formbuilder   : FormBuilder,
    private __errorservices : ErrorService,
    private __tercerService : TerceroService,
    private __adressService : AdressService,
    private __changeDetRef  : ChangeDetectorRef,
  ) {
    this.form2 = this.__formbuilder.group({});
    this.dataSource = new MatTableDataSource<DireccElement>([]);
    this.createForm();
  }

  ngOnInit(): void {
    
    this.getDepartamentos();
    this.onPrvChange();
  }

  createForm() {
    this.fields2.forEach(field => {
      const control = this.__formbuilder.control(
        { value: field.defaultValue ?? '', disabled: field.disabled ?? false },
        this.buildValidators(field)
      );
      this.form2.addControl(field.name, control);
    });
  }

  buildValidators(field: Field) {
    const validators = field.required ? [Validators.required] : [];
    if (field.validators) {
      validators.push(...field.validators);
    }
    return validators;
  }

  /** Metodo que escucha el cambio de departamentos y trae las provincias */
  onPrvChange(): void {
    if(this.form2.get('coddep')?.value){
      this.getProvincias(this.form2.get('coddep')?.value);
    }
  }

    /** Metodo que escucha el cambio de provincias y trae las distritos */
  onDisChange(): void {
    if(this.form2.get('coddep')?.value && this.form2.get('codprv')?.value){
      this.getDistritos(this.form2.get('coddep')?.value, this.form2.get('codprv')?.value);
    }
  }

  /** Método para obtener mensajes de error */
  getErrorMessage(fieldName: string): string {
    const control = this.form2.get(fieldName);

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
    this.__adressService.getDeparta()
      .subscribe(data => {
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
  
  /** Método para traer todas las direcciones de un tercero */
  getDirecTercero() {
    if (this.cod_tercer) {
      this.__tercerService.getDireccionesTercero(this.cod_tercer)
        .subscribe(
          (data) => {
            if (data.length > 0) {
              /** Asígnamos los valores a la tabla */
              this.dataSource.data = data;
              this.onRowClicked();
            }else {
              this.form2.reset();
              /** Agregamos los datos por default al formulario */
              this.fields2.forEach(field => {
                this.form2.get(field.name)?.setValue(field.defaultValue ?? '');
              });
              /** La tabla no tendrá datos */
              this.dataSource.data = [];
            }
          },
          (error: any) => {
            this.__errorservices.msjError(error);
          }
        );
    }
  }

  /** Método para manejar el click de laa tabla y solo una dirección por tercero */
  onRowClicked(row: DireccElement | null = null) {
    this.selectedRow = row ? row : this.dataSource.data[0];
    if (this.selectedRow) {
      this.__tercerService.getOneDireccionTercero(this.cod_tercer || '', this.selectedRow.tipdir)
        .subscribe(
          (data) => {
            this.form2.get('tipdir')?.setValue(data.tipdir);
            this.form2.get('coddep')?.setValue(data.coddep);
            this.form2.get('codprv')?.setValue(data.codprv);
            this.form2.get('coddis')?.setValue(data.coddis);
            this.form2.get('direcc')?.setValue(data.direcc);
            this.form2.get('contac')?.setValue(data.contac);
            this.form2.get('telef1')?.setValue(data.telef1);
            this.form2.get('email')?.setValue(data.email);
          },
          (error: any) => {
            this.__errorservices.msjError(error);
          }
        );
    }
    
  }
  


  /** Método para resetear el formulario y mantener los valores predeterminados */
  resetForm() {
    this.form2.reset();

    this.fields2.forEach(field => {
      this.form2.get(field.name)?.setValue(field.defaultValue ?? '');
    });
  }

  onSubmitDirec() {
    console.log(this.form2.value);
    
  }
}
