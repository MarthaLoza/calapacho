import { Component, EventEmitter, Input, Output } from '@angular/core';

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

  @Input() numIndexButtonInput: number = 0;
  @Input() numTotalDataTable  : number = 0;
  
  @Output() numIndexButtonOutput = new EventEmitter<number>();

  boolDisabledButtonBack: boolean = false;
  boolDisabledButtonNext: boolean = false;

  ngOnChanges() {

    this.boolDisabledButtonBack = this.numIndexButtonInput == 0 ? true : false;
    this.boolDisabledButtonNext = this.numIndexButtonInput == this.numTotalDataTable - 1 ? true : false;
    
  }

  backButton() {
    this.numIndexButtonInput--;
    this.numIndexButtonOutput.emit(this.numIndexButtonInput);
  }

  nextButton() {
    this.numIndexButtonInput++;
    this.numIndexButtonOutput.emit(this.numIndexButtonInput);
  }

}
