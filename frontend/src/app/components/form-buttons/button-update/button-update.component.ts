import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogUpdateComponent } from '../../form-dialogs/dialog-update/dialog-update.component';
import { QueryService } from 'src/app/services/query-basic.service';
import { NotifierService } from 'angular-notifier';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-button-update',
  template: `
              <button 
                mat-fab 
                color         = "primary" 
                type          = "button"
                [disabled]    = "disabled_button"
                (click)       = "updateButton()"
              >
                <mat-icon>save</mat-icon>
              </button>
  `,
  styles: [`
              button {
                margin: 0px 8px;
              }
  `]
})

export class ButtonUpdateComponent {

  @Input() disabled         : boolean     = false;
  @Input() arrData          : Array<any>  = [];

  @Output() boolDisable  = new EventEmitter<boolean>();
  @Output() boolFinish   = new EventEmitter<boolean>(); // Eento apra saber que terminó de actualizar

  disabled_button = false;

  constructor(
    private __queryService  : QueryService,
    private __notifyService : NotifierService,
    private __errorservices : ErrorService
  ) { }

  ngOnChanges(changes: SimpleChanges) {

    /** 
     * Condición de reset para mantener al botón de update
     * deshabilitado hasta que se realice la insertar o refrescar
     * el componente
     */
    this.disabled_button = this.disabled;
  }

  updateButton() {
    this.__queryService.updateOneRow(this.arrData)
      .subscribe(
        (response: any) => {
          this.__notifyService.notify('success', response);
          //this.disabled_button = true;
          this.boolDisable.emit(false);
          this.boolFinish.emit(true); // Ya se terminó de actualizar
        },
        (error: any) => {
          this.__errorservices.msjError(error);
        }
      );
  }
}
