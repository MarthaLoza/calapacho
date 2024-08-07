import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogUpdateComponent } from '../../form-dialogs/dialog-update/dialog-update.component';

@Component({
  selector: 'app-button-arrows',
  template: `
      <button 
        mat-fab 
        color         = "primary" 
        type          = "button"
        [disabled]    = "boolDisabledButtonBack"
        (click)       = "backButton()"
      >
        <mat-icon>arrow_back</mat-icon>
      </button>
      <button 
        mat-fab 
        color         = "primary" 
        type          = "button"
        [disabled]    = "boolDisabledButtonNext"
        (click)       = "nextButton()"
      >
        <mat-icon>arrow_forward</mat-icon>
      </button>`,
  styles: [`
      button {
        margin: 0px 8px;
      }
  `]
})
export class ButtonArrowsComponent {

  @Input() numIndexButtonInput: number  = 0;      // Index de la tabla
  @Input() numTotalDataTable  : number  = 0;      // Total de datos de la tabla
  @Input() boolFormModific    : boolean = false;  // Formulario modificado
  
  @Output() numIndexButtonOutput  = new EventEmitter<number>();   // Exportación del index de la tabla
  @Output() boolActionButton      = new EventEmitter<boolean>();  // Exportación de la acción de los botones
  @Output() boolDisable           = new EventEmitter<boolean>();  // Exportación de la activación o desactivación de los botones

  boolDisabledButtonBack: boolean = false;
  boolDisabledButtonNext: boolean = false;
  boolActionButtonArrows: boolean = false;

  constructor(
    private __dialog: MatDialog
  ) {}

  ngOnChanges() {
    if(this.numTotalDataTable != 0){

      this.boolDisabledButtonBack = this.numIndexButtonInput == 0 ? true : false;
      this.boolDisabledButtonNext = this.numIndexButtonInput == this.numTotalDataTable - 1 ? true : false;    

    } else {
      this.boolDisabledButtonBack = true;
      this.boolDisabledButtonNext = true;
    }
    
  }

  async backButton() {
    if(this.boolFormModific){
      const validation = await this.openDialogUpdate();

      if(validation){
        this.numIndexButtonInput--;
        this.functionButton();
      }

    } else {
      this.numIndexButtonInput--;
      this.functionButton();
    }
  }

  async nextButton() {
    if(this.boolFormModific){
      const validation = await this.openDialogUpdate();
      
      if(validation){
        this.numIndexButtonInput++;
        this.functionButton();
      }

    } else {
      this.numIndexButtonInput++;
      this.functionButton();
    }
  }

  functionButton() {
    this.boolActionButtonArrows = !this.boolActionButtonArrows;
    this.numIndexButtonOutput.emit(this.numIndexButtonInput);
    this.boolActionButton.emit(this.boolActionButtonArrows);
    this.boolDisable.emit(false);
    this.boolFormModific = false;
  }

  /** Método para abrir el dialogo de Campos pendientes */
  openDialogUpdate(): Promise<boolean> {
    const dialogRef = this.__dialog.open(DialogUpdateComponent, {});

    return dialogRef.afterClosed().toPromise();
  }

}
