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
import { TerceroComponent } from './tercero/tercero.component';
import { NotifierModule } from 'angular-notifier';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CterdireComponent } from './cterdire/cterdire.component';
import { DialogDeleteComponent } from './form-dialogs/dialog-delete/dialog-delete.component';
import { DialogUpdateComponent } from './form-dialogs/dialog-update/dialog-update.component';
import { FiltersComponent } from './form-filters/filters.component';
import { DialogFilterComponent } from './form-dialogs/dialog-filter/dialog-filter.component';
import { ButtonDeleteComponent } from './form-buttons/button-delete/button-delete.component';
import { FormTableComponent } from './form-table/form-table.component';
import { ButtonArrowsComponent } from './form-buttons/button-arrows/button-arrows.component';
import { TercerosComponent } from './terceros/terceros.component';
import { FormOneDataComponent } from './form-one-data/form-one-data.component';
import { ButtonUpdateComponent } from './form-buttons/button-update/button-update.component';
import { PortalUserComponent } from './portal-user/portal-user.component';

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
    TerceroComponent,
    CterdireComponent,
    DialogDeleteComponent,
    DialogUpdateComponent,
    FiltersComponent,
    DialogFilterComponent,
    ButtonDeleteComponent,
    FormTableComponent,
    ButtonArrowsComponent,
    TercerosComponent,
    FormOneDataComponent,
    ButtonUpdateComponent,
    PortalUserComponent,
  ]
})
export class ComponentsModule { }
