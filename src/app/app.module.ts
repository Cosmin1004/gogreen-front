import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AgmCoreModule } from '@agm/core';
import { MainMapComponent } from './main-map/main-map.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HereMapComponent } from './here-map/here-map.component';
import { HttpClientModule } from '@angular/common/http';
import { CitizenService } from './citizen.service';
import { CompanyService } from './company.service';
import { UserService } from './user.service';
import { ValidationErrorMessageComponent } from './validation-error-message/validation-error-message.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { CitizenDashboardComponent } from './citizen-dashboard/citizen-dashboard.component';
import { LoginService } from './login.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompanyDashboardComponent } from './company-dashboard/company-dashboard.component';
import { OptionsListComponent } from './options-list/options-list.component';
import { RequestService } from './request.service';
import { MapsService } from './maps.service';
import { DlDateTimeDateModule, DlDateTimePickerModule } from 'angular-bootstrap-datetimepicker';
import { DateTimePickerComponent } from './date-time-picker/date-time-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    NavbarComponent,
    MainMapComponent,
    SignupFormComponent,
    HereMapComponent,
    ValidationErrorMessageComponent,
    UserDashboardComponent,
    CitizenDashboardComponent,
    DashboardComponent,
    CompanyDashboardComponent,
    OptionsListComponent,
    DateTimePickerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBeDaGcleS7YJk8VrKZIJEhxh-k9ZInmDg'
    }),
    DlDateTimeDateModule, 
    DlDateTimePickerModule
  ],
  providers: [CitizenService, CompanyService, UserService, LoginService, RequestService, MapsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
