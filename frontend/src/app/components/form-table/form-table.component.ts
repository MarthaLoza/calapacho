import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogUpdateComponent } from '../form-dialogs/dialog-update/dialog-update.component';

@Component({
  selector    : 'app-form-table',
  templateUrl : './form-table.component.html',
  styleUrls   : ['./form-table.component.scss']
})
export class FormTableComponent implements AfterViewInit {

  /** Información del padre */
  @Input() numIndexTableInput : number        = 0;      // Index de la tabla
  @Input() arrDataTable       : Array<object> = [];     // Datos de la tabla, ordenada para la vista del usuario
  @Input() boolActionButtonA  : boolean       = false;  // Acción de los botones Arrows
  @Input() boolFormModific    : boolean       = false;  // Formulario modificado

  @Output() searchEvent = new EventEmitter<number>();   // Evento que envia el índice seleccionado

  displayedColumns    : string[]  = [];
  dataSource                      = new MatTableDataSource<object>(this.arrDataTable);
  selectedRow         : object    = {};

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor( 
    private __changeDF  : ChangeDetectorRef,
    private __dialog    : MatDialog
  ) {}  

  ngAfterViewInit() {

    this.obtainColumns(this.arrDataTable);
    this.dataSource.paginator = this.paginator || null;

  }

  /** Método de angular, escucha cambios */
  ngOnChanges(changes: SimpleChanges) {
    
    if ((changes['arrDataTable'] && this.arrDataTable.length > 0)) {
      
      this.dataSource.data = this.arrDataTable;
      this.obtainColumns(this.arrDataTable);
      this.__changeDF.detectChanges();

      /**
       * Siempre que el Data table cambie o se actualice, se selecciona la primera fila
       */
      this.rowSelection({}, this.numIndexTableInput);
      //console.log(this.numIndexTableInput);

    } else if (changes['arrDataTable'] && this.arrDataTable.length == 0) {
      this.dataSource.data = [];
      this.__changeDF.detectChanges();
    }

    /**
     * Se llama al rowSelection cuando se cambia el índice y cuando sea una acción 
     * de botón, para evitar que se ejecute al inicio con la seleccion anterior, se 
     * condiciona el initialSelection.
     */
    if(changes['boolActionButtonA'] && changes['numIndexTableInput']) {
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
  async rowSelection(row: object, index: number) {
    
    if(this.boolFormModific) {
      const validation = await this.openDialogUpdate();
      if(validation){
        this.functionSelection(row, index);
      }
    } else {
      this.functionSelection(row, index);
    }
  }

  functionSelection(row: object, index: number) {
    let numIndexSelection = this.dataSource.data.indexOf(row);
    index = numIndexSelection == -1 ? index : numIndexSelection;
    
    this.selectedRow = this.dataSource.data[index]; // Selecciona(pinta) la fila

    /**  Calcula la página en la que debe estar el índice seleccionado */
    const pageSize      = this.paginator?.pageSize || 10;
    const newPageIndex  = Math.floor(index / pageSize);

    /** Si hay un paginator, cambia la página */
    if (this.paginator) {
      this.paginator.pageIndex  = newPageIndex;
      this.dataSource.paginator = this.paginator; // Refresca el paginator
    }
    
    this.searchEvent.emit(index);
    this.boolFormModific = false;
  }

  /** Método para abrir el dialogo de Campos pendientes */
  openDialogUpdate(): Promise<boolean> {
    const dialogRef = this.__dialog.open(DialogUpdateComponent, {});

    return dialogRef.afterClosed().toPromise();
  }

}