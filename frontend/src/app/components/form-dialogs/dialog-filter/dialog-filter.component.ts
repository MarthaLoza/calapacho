import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-filter',
  templateUrl: './dialog-filter.component.html',
  styleUrls: ['./dialog-filter.component.scss']
})
export class DialogFilterComponent {

  constructor(
    public __dialog: MatDialogRef<DialogFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: boolean,
  ) {}

}
