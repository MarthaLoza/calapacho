import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button-arrows',
  templateUrl: './button-arrows.component.html',
  styleUrls: ['./button-arrows.component.scss']
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
