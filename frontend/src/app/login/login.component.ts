import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { User } from 'src/app/interfaces/user';
import { ErrorService } from 'src/app/services/error.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user_name: string = '';
  user_password: string = '';
  loading: boolean = false;

  convertToUpperCase() {
    this.user_name = this.user_name.toUpperCase();
  }

  constructor(private notify: NotifierService,
    private _userServices: UserService,
    private router: Router,
    private _errorservices: ErrorService) {
  }

  ngOnInit(): void {
    
  }

  login(){

    // Validamos que el usuario ingrese datos
    if(!this.user_name || !this.user_password){
      this.notify.notify('error', 'Hay campos que no han completado')
      return
    }

    // Creamos el body
    const user : User = {
      user_code: '',
      user_name: this.user_name,
      user_password: this.user_password,
      user_email: ''
    }

    this.loading = true;    
    this._userServices.login(user).subscribe({
      next: (token) => {
      localStorage.setItem('token', token)
        this.router.navigate(['/home'])
      },
      error: (e: HttpErrorResponse) => {
        console.log(e);
        this._errorservices.msjError(e);
        this.loading = false;
      }
    })
  }
}
