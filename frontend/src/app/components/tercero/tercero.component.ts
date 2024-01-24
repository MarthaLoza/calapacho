import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorService } from 'src/app/services/error.service';
import { TerceroService } from 'src/app/services/tercero.service';

export interface Selector {
  label: string;
  value: string;
}

export interface TipoDirecc {
  label: string;
  value: string;
}

@Component({
  selector: 'app-tercero',
  templateUrl: './tercero.component.html',
  styleUrls: ['./tercero.component.scss']
})
export class TerceroComponent implements OnInit {

  constructor(private _terceroService: TerceroService,
    private _errorservices: ErrorService) { }

  index_tt        : string = '';
  index_td        : string = '';
  index_te        : string = '';
  cod_tercer      : string = '';
  nom_tercer      : string = '';
  nom_aux_tercer  : string = '';
  tip_doc_tercer  : string = '';
  doc_tercer      : string = '';
  com_tercer      : string = '';
  est_tercer      : string = '';

  error : string = `formularioTercero.hasError('required')`;

  options_tt: Selector[] = [
    { label: 'Usuario',    value: 'C' },
    { label: 'Empresa',    value: 'E' },
    { label: 'Conductor',  value: 'T' },
  ];

  options_td: Selector[] = [
    { label: 'RUC',    value: '0' },
    { label: 'DNI',    value: '1' },
    { label: 'Carnet Extranjería',  value: '2' },
  ];

  options_te: Selector[] = [
    { label: 'Activo',    value: 'A' },
    { label: 'Inactivo',  value: 'I' },
  ];

  formularioTercero = new FormGroup({
    tercerControl : new FormControl<Selector | null>(null, Validators.required),
    nombreControl : new FormControl<Selector | null>(null, Validators.required),
    auxiliControl : new FormControl<Selector | null>(null, Validators.required),
    tipdocControl : new FormControl<Selector | null>(null, Validators.required),
    documeControl : new FormControl<Selector | null>(null, Validators.required),
    comentControl : new FormControl<Selector | null>(null),
    estadoControl : new FormControl<Selector | null>(null, Validators.required),
  })

  ngOnInit() {
  }

  /** Funcion que escucha, para poder determinar 
      el código según en tipo de tercero        */
      
  onSelectChange(): void {
    if (this.index_tt) {
      this._terceroService.getCodigo(this.index_tt).subscribe(
        res => {
          this.cod_tercer = res;
        },
        err => {
          console.log(err);
          this._errorservices.msjError(err);
        })
    }
  }

  /** Función de envío de datos        */
  Enviar(){
    console.log("Codigo: ", this.cod_tercer);
    console.log("Nombre: ", this.nom_tercer);
    console.log("NomAux: ", this.nom_aux_tercer);
    console.log("TipDoc: ", this.tip_doc_tercer);
    console.log("Docume: ", this.doc_tercer);
    console.log("Coment: ", this.com_tercer);
    console.log("Estado: ", this.est_tercer);
  }

}
