import { AfterViewInit, ChangeDetectorRef, Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector    : 'app-form-table',
  templateUrl : './form-table.component.html',
  styleUrls   : ['./form-table.component.scss']
})
export class FormTableComponent implements AfterViewInit {

  /** Información del padre */
  @Input() arrDataTable : Array<object> = [];

  displayedColumns: string[] = [];
  dataSource  = new MatTableDataSource<object>(this.arrDataTable);
  selectedRow : object = {};

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor( private __changeDF: ChangeDetectorRef ) {}  

  ngAfterViewInit() {

    this.obtainColumns(this.arrDataTable);
    this.dataSource.paginator = this.paginator || null;  
    
  }

  /** Método de angular, escucha cambios */
  ngOnChanges(changes: SimpleChanges) {

    if (changes['arrDataTable']) {

      this.dataSource.data = this.arrDataTable;
      this.obtainColumns(this.arrDataTable);
      this.__changeDF.detectChanges();

    }
  }

  /** Método para obtener las columnas */
  obtainColumns( arrData: Array<object> ) {
    if(arrData.length > 0) {

      const objData = arrData[0]
      let arrColumn = [];
      
      for(let rowKey in objData) {
        arrColumn.push(rowKey.toString())
      }

      this.displayedColumns = arrColumn;
    }
  }

  /** Método para generar el nombre de las columnas */
  generateColumnName( column: string ) {
    const strFrase  = column.split('_');
    let strNewFrase = '';

    for (let rowWord of strFrase) {
      strNewFrase += rowWord[0].toUpperCase() + rowWord.slice(1) + ' ';
    }

    return strNewFrase;
  }

  /** Manejo de la sección de la fila */
  rowSelection(row: object) {
    if (row){
      this.selectedRow = row;
      console.log(this.dataSource.data.indexOf(row)); // Index de la fila seleccionada.
    }
  }

}