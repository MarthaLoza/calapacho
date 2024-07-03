import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { Router } from '@angular/router';
import { AdressService } from 'src/app/services/adress.service';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { NgFor } from '@angular/common';
import { Selector } from 'src/app/interfaces/user';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, 
            MatCheckboxModule, MatRadioModule, MatButtonModule, MatSelectModule, 
            MatOptionModule, NgFor],
  templateUrl: './forms.component.html',
})
export class FormsComponent implements OnInit {

  //form: FormGroup;

  form = new FormGroup({
    selection: new FormControl('', Validators.required),
  });
  

  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];
  
  checked = true;

  options_dep: Selector[] = [];
  
  constructor(
    private _router         : Router,
    private __formbuilder   : FormBuilder,
    private __adressService : AdressService
  ) {
      //this.form = this.__formbuilder.group({});
    }

  ngOnInit(): void {
    this.getDeparta();
  }

  getDeparta(): void {
    this.__adressService.getDeparta()
      .subscribe(data => {
        this.options_dep = data;
      });
  }

  onBack(): void {
    this._router.navigate(['/flexy/home']);
  }

  resetForm(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.reset();
      console.log('selection', 'pristine:', control?.pristine, 'untouched:', control?.untouched, 'status:', control?.status);

    });
  }

  onSubmit() {
    console.log(this.form.value);
    setTimeout(() => {
      this.resetForm();
    }, 0);
  }
}
