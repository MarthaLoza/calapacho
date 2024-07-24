import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Field } from 'src/app/interfaces/user';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {

  @Input() arrData: Array<object> | undefined;
  @Output() searchEvent = new EventEmitter<object>();

  form    : FormGroup;
  fields  : Field[] = []

  constructor( private __formbuilder: FormBuilder ) {
    this.form = this.__formbuilder.group({});
  }

  ngOnInit(): void {
    this.fields = this.arrData as Field[];    
    this.createForm();
    
  }

  createForm() {
    this.fields.forEach(field => {
      this.form.addControl(field.name, new FormControl(''));
    });
  }

  searchBoton(){
    this.searchEvent.emit(this.form.value);
  };

  resetForm(){
    this.form.reset();
  }

}
