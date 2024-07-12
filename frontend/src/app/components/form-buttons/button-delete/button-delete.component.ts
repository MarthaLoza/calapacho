import { Component, Input } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { ErrorService } from 'src/app/services/error.service';
import { QueryService } from 'src/app/services/query-basic.service';

@Component({
  selector: 'app-button-delete',
  template: `
              <button 
                mat-fab 
                color         = "primary" 
                type          = "button" 
                [disabled]    = "disabled" 
                (click)       = "deleteBoton()"
              >
                <mat-icon>delete</mat-icon>
              </button>`
})
export class ButtonDeleteComponent {

  /** Información desde el padre */
  @Input() disabled: boolean = false;
  @Input() strTable: string  = '';
  @Input() objCond : number  = 0;

  constructor(
    private __notifyService : NotifierService,
    private __queryService  : QueryService,
    private __errorservices : ErrorService
  ) {}

  deleteBoton(){

    const data = [this.strTable, { "seqno" : this.objCond }];
    
    /** Servicio que elimina registros */
    this.__queryService.deleteOneRow(data)
      .subscribe(
        (response: any) => {
          console.log(response);
          
          this.__notifyService.notify('success', response);
        },
        (error: any) => {
          console.log(error); 
          this.__errorservices.msjError(error);
        }
      );
  }
}
