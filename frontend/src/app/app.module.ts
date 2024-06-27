import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { FormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AddTokenInterceptor } from './utils/add-token.interceptor';

// Componentes
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { LoginComponent } from './login/login.component';
import { FullComponent } from './layouts/full/full.component';

// Modules
import { DemoFlexyModule } from './demo-flexy-module'
import { DashboardModule } from './dashboard/dashboard.module';
import { ComponentsModule } from './components/components.module';
import { LoginModule } from './login/login.module';
import { NotifierModule } from 'angular-notifier';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    LoginComponent,
    FullComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FeatherModule.pick(allIcons),
    DemoFlexyModule,
    ComponentsModule,
    LoginModule,
    DashboardModule,
    FormsModule,
    HttpClientModule,
    NotifierModule.withConfig({
      position: {

          horizontal: {
            position: 'middle'
          },
  
          vertical: {
            position: 'top'
          }
        },
        behaviour: {
          stacking: false
        }
      }),
    
    MatSelectModule,
    MatOptionModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
