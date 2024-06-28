import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoFlexyModule } from '../demo-flexy-module'
import { DashboardComponent } from './dashboard.component';
import { CardsComponent } from './dashboard-components/cards/cards.component';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';

import { SalesComponent } from './dashboard-components/sales/sales.component';
import { ActivityComponent } from './dashboard-components/activity/activity.component';
import { ProductComponent } from './dashboard-components/product/product.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';



@NgModule({
  declarations: [
    DashboardComponent,
    SalesComponent,
    ActivityComponent,
    ProductComponent,
    CardsComponent,
  ],
  imports: [
    CommonModule,
    DemoFlexyModule,
    FormsModule,
    NgApexchartsModule,
    MatTableModule,
    MatPaginatorModule
  ],
  exports: [
    DashboardComponent,
    SalesComponent,
    ActivityComponent,
    ProductComponent,
  ]
})
export class DashboardModule { }
