import { NgModule } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { AlertsComponent } from './alerts/alerts.component';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { FormsComponent } from './forms/forms.component';
import { DemoFlexyModule } from '../demo-flexy-module';
import { GridListComponent } from './grid-list/grid-list.component';
import { MenuComponent } from './menu/menu.component';
import { TabsComponent } from './tabs/tabs.component';
import { ExpansionComponent } from './expansion/expansion.component';
import { ChipsComponent } from './chips/chips.component';
import { ProgressComponent } from './progress/progress.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ProgressSnipperComponent } from './progress-snipper/progress-snipper.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { SliderComponent } from './slider/slider.component';
import { SlideToggleComponent } from './slide-toggle/slide-toggle.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { TooltipsComponent } from './tooltips/tooltips.component';
import { RemisionComponent } from './remision/remision.component';
import { TerceroComponent } from './tercero/tercero.component';
import { NotifierModule } from 'angular-notifier';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CterdireComponent } from './cterdire/cterdire.component';
import { DialogDeleteComponent } from './dialogs/dialog-delete/dialog-delete.component';
import { DialogUpdateComponent } from './dialogs/dialog-update/dialog-update.component';
import { FiltersComponent } from './filters/filters.component';
import { DialogFilterComponent } from './dialogs/dialog-filter/dialog-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FeatherModule.pick(allIcons),
    ReactiveFormsModule,
    DemoFlexyModule,
    ButtonsComponent,
    SlideToggleComponent,
    SliderComponent,
    ToolbarComponent,
    ProgressSnipperComponent,
    SnackbarComponent,
    MenuComponent,
    TabsComponent,
    ExpansionComponent,
    ChipsComponent,
    ProgressComponent,
    FormsComponent,
    AlertsComponent,
    GridListComponent,
    TooltipsComponent,
    FormsModule,
    NotifierModule,
    MatSelectModule,
    MatOptionModule,
    NgFor
  ],
  exports: [
    ReactiveFormsModule,
    AlertsComponent,
    FormsComponent,
    GridListComponent,
    MenuComponent,
    TabsComponent,
    ExpansionComponent,
    ChipsComponent,
    ProgressComponent,
    ToolbarComponent,
    ProgressSnipperComponent,
    SnackbarComponent,
    SliderComponent,
    SlideToggleComponent,
    ButtonsComponent,
    NotifierModule,
    DemoFlexyModule,
    MatSelectModule,
    MatOptionModule,
    NgFor,
  ],
  declarations: [
    RemisionComponent,
    TerceroComponent,
    CterdireComponent,
    DialogDeleteComponent,
    DialogUpdateComponent,
    FiltersComponent,
    DialogFilterComponent,
  ]
})
export class ComponentsModule { }
