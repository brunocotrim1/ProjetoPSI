import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MainMenuComponent } from './mainmenu/mainmenu.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    MainMenuComponent,
  ],
  imports: [    
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    MDBBootstrapModule.forRoot(),
    ReactiveFormsModule,
    // CalendarModule.forRoot({
    //   provide: DateAdapter,
    //   useFactory: adapterFactory,
    // }),
    BrowserModule,
    AppRoutingModule,
  ],providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
],
  bootstrap: [AppComponent]
})
export class AppModule { }
