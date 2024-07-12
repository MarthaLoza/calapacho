import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private notify: NotifierService) { }

  msjError(e: HttpErrorResponse) {
    if(e.error.msg) {
      this.notify.notify('error', e.error.msg)
    } else {
      console.log(e, "ERROR SIN CONTROL");
      
      this.notify.notify('error', 'Upps ocurrio un error, comuniquese con el administrador')
    }
  }
}
