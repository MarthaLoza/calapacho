import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector    : 'app-form-table',
  templateUrl : './form-table.component.html',
  styleUrls   : ['./form-table.component.scss']
})
export class FormTableComponent implements AfterViewInit {

  /** Información del padre */
  @Input() numIndexTableInput : number = 0;
  @Input() arrDataTable       : Array<object> = [];

  @Output() searchEvent = new EventEmitter<number>();

  displayedColumns  : string[]  = [];
  dataSource                    = new MatTableDataSource<object>(this.arrDataTable);
  selectedRow       : object    = {};

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor( private __changeDF: ChangeDetectorRef ) {}  

  ngAfterViewInit() {

    this.obtainColumns(this.arrDataTable);
    this.dataSource.paginator = this.paginator || null;
    
    
  }

  /** Método de angular, escucha cambios */
  ngOnChanges(changes: SimpleChanges) {
    
    if (changes['arrDataTable'] || changes['numIndexTableInput']) {

      this.dataSource.data = this.arrDataTable;
      this.obtainColumns(this.arrDataTable);
      this.__changeDF.detectChanges();
      
      this.rowSelection({}, this.numIndexTableInput);
    }
  }

  /** Método para obtener las columnas del array */
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

  /** 
   * Método para generar el nombre de las columnas,
   * Ej.: data_name = Data Name
   */
  generateColumnName( column: string ) {
    const strFrase  = column.split('_');
    let strNewFrase = '';

    for (let rowWord of strFrase) {
      strNewFrase += rowWord[0].toUpperCase() + rowWord.slice(1) + ' ';
    }

    return strNewFrase;
  }

  /** Manejo de la sección de la fila */
  rowSelection(row: object, index: number = 0) {

    if( Object.keys(row).length > 0 ){
      index = this.dataSource.data.indexOf(row);
    }
    
    this.selectedRow = this.dataSource.data[index];

    /**  Calcula la página en la que debe estar el índice seleccionado */
    const pageSize      = this.paginator?.pageSize || 10;
    const newPageIndex  = Math.floor(index / pageSize);

    /** Si hay un paginator, cambia la página */
    if (this.paginator) {
      this.paginator.pageIndex  = newPageIndex;
      this.dataSource.paginator = this.paginator; // Refresca el paginator
    }
    
    this.searchEvent.emit(index);
  }

}