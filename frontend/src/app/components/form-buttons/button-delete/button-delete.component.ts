import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { catchError, forkJoin, of, tap } from 'rxjs';
import { ErrorService } from 'src/app/services/error.service';
import { QueryService } from 'src/app/services/query-basic.service';
import { DialogDeleteComponent } from '../../form-dialogs/dialog-delete/dialog-delete.component';

@Component({
  selector: 'app-button-delete',
  template: `
              <button 
                mat-fab 
                color         = "primary" 
                type          = "button" 
                [disabled]    = "disabled" 
                (click)       = "openDialogDelete()"
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
  @Input() disabled         : boolean     = false;
  @Input() arrData          : Array<any>  = [];

  @Output() bollFinish = new EventEmitter<boolean>(); // Evento para saber que terminó de eliminar

  strMessage  = '';
  hasError    = false;

  constructor(
    private __notifyService : NotifierService,
    private __queryService  : QueryService,
    private __errorservices : ErrorService,
    private __dialog        : MatDialog
  ) {}
  
  ngOnChanges(changes: SimpleChanges) {
  }
  
  deleteBoton() {
    const deleteObservables = this.arrData.map(data => 
      this.deleteRow(data).pipe(
        tap(response => {
          this.strMessage = response; // Actualiza con la última respuesta exitosa
        }),
        catchError(error => {
          console.log(error);
          this.__errorservices.msjError(error);
          this.hasError = true; // Establece la bandera de error si ocurre un error
          return of(null);      // Retorna null para continuar con el forkJoin
        })
      )
    );

    forkJoin(deleteObservables).subscribe(() => {
      if (!this.hasError) {
        // Si no ocurrió ningún error, muestra el mensaje de éxito
        this.__notifyService.notify('success', this.strMessage);
        this.bollFinish.emit(true); // Se emite un evento para reiniciar la tabla
      }
      this.hasError = false; // Restablece la bandera de error para la próxima operación
    });
  }

  private deleteRow(data: Array<any>) {
    /** Servicio que elimina registros */
    return this.__queryService.deleteOneRow(data);
  }

  /**
   * Primero abrimos el dialogo de confirmación para eliminar registros
   * para poder proceder con la eliminación del registro.
   */
  openDialogDelete(): void {
    const dialogRef = this.__dialog.open(DialogDeleteComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.deleteBoton();
      }
    });
  }
  
}
