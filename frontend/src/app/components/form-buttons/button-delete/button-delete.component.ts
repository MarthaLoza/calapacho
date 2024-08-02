import { Component, Input, SimpleChanges } from '@angular/core';
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
              </button>`,
  styles: [`
              button {
                margin: 0px 8px;
              }
          `]
})
export class ButtonDeleteComponent {

  /** Información desde el padre */
  @Input() disabled : boolean = false;
  @Input() arrData  : Array<any> = [];
  //@Input() strTable : string  = '';
  //@Input() objCond  : number  = 0;

  constructor(
    private __notifyService : NotifierService,
    private __queryService  : QueryService,
    private __errorservices : ErrorService
  ) {}
  
  ngOnChanges(changes: SimpleChanges) {
    if(changes['arrData']) {
      //console.log(this.arrData, 'DATA123');
    }
  }

  deleteBoton(){
    for(let data of this.arrData) {
      //this.deleteRow(data);
    }
  }

  private deleteRow(data: Array<any>) {
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
