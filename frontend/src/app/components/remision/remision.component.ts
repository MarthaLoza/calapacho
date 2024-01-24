import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-remision',
  templateUrl: './remision.component.html',
  styleUrls: ['./remision.component.scss']
})
export class RemisionComponent implements OnInit {

  maxNumber: number = 0;
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]> | undefined;

  constructor() { }

  ngOnInit(): void {
    // Sirve para el autocompletar
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  // Trae el número maximo que recorerá el Array para poder insertar filas
  getNumberArray(max: number): number[] {
    return Array.from({ length: max }, (_, index) => index + 1);
  }

  // Suma uno a maxNumber
  onePlus() {  
    this.maxNumber++;
  }

  // Función para que funcione el autocompletar
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

}
