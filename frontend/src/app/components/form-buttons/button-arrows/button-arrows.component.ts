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

  @Input() numIndexButtonInput: number  = 0;
  @Input() numTotalDataTable  : number  = 0;
  @Input() boolFormModific    : boolean = false;
  
  @Output() numIndexButtonOutput  = new EventEmitter<number>();
  @Output() boolActionButton      = new EventEmitter<boolean>();
  @Output() boolDisable           = new EventEmitter<boolean>();

  boolDisabledButtonBack: boolean = false;
  boolDisabledButtonNext: boolean = false;
  boolActionButtonArrows: boolean = false;
  //boolFormModificForm   : boolean = false;

  constructor(
    private __dialog: MatDialog
  ) {}

  ngOnChanges() {

    this.boolDisabledButtonBack = this.numIndexButtonInput == 0 ? true : false;
    this.boolDisabledButtonNext = this.numIndexButtonInput == this.numTotalDataTable - 1 ? true : false;
    //this.boolFormModificForm    = this.boolFormModific;
    
    
  }

  async backButton() {
    if(this.boolFormModific){
      
      const validation = await this.openDialogUpdate();
      if(validation){
        this.numIndexButtonInput--;
        this.boolActionButtonArrows = !this.boolActionButtonArrows;
        this.numIndexButtonOutput.emit(this.numIndexButtonInput);
        this.boolActionButton.emit(this.boolActionButtonArrows);
        this.boolDisable.emit(false);
        this.boolFormModific = false;
      }
    } else {
      this.numIndexButtonInput--;
      this.boolActionButtonArrows = !this.boolActionButtonArrows;
      this.numIndexButtonOutput.emit(this.numIndexButtonInput);
      this.boolActionButton.emit(this.boolActionButtonArrows);
      this.boolDisable.emit(false);
      this.boolFormModific = false;
    }
  }

  async nextButton() {
    if(this.boolFormModific){
      console.log('Formulario modificado', this.boolFormModific);

      const validation = await this.openDialogUpdate();
      if(validation){
        this.numIndexButtonInput++;
        this.boolActionButtonArrows = !this.boolActionButtonArrows;
        this.numIndexButtonOutput.emit(this.numIndexButtonInput);
        this.boolActionButton.emit(this.boolActionButtonArrows);
        this.boolDisable.emit(false);
        this.boolFormModific = false;
      }
    } else {
      this.numIndexButtonInput++;
      this.boolActionButtonArrows = !this.boolActionButtonArrows;
      this.numIndexButtonOutput.emit(this.numIndexButtonInput);
      this.boolActionButton.emit(this.boolActionButtonArrows);
      this.boolDisable.emit(false);
      this.boolFormModific = false;
    }
  }

  /** Método para abrir el dialogo de Campos pendientes */
  openDialogUpdate(): Promise<boolean> {
    const dialogRef = this.__dialog.open(DialogUpdateComponent, {});

    return dialogRef.afterClosed().toPromise();
  }

}
