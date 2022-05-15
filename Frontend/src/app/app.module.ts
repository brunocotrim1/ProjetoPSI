import { APP_INITIALIZER, NgModule } from '@angular/core';
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
import { AuthenticationService } from './services/authentication.service';
import { AppInitializer } from './appInitiazlier/AppInitializer';
import { MainMenuComponent } from './mainmenu/mainmenu.component';
import { CreateTeamsComponent } from './create-teams/create-teams.component';
import { ProfileComponent } from './profile/profile.component';
import { CreateUserComponent } from './createuser/createuser.component';
import { NavigbarComponent } from './navbar/navigbar.component';
import { FooterComponent } from './footer/footer.component';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { MultiselectDropdownComponent } from './multiselect-dropdown/multiselect-dropdown.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ProjectsComponent } from './projects/projects.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMatDateFormats, NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatNativeDateModule } from '@angular/material/core';
import { CreateTaskComponent } from './create-task/create-task.component';
import { TasklistComponent } from './tasklist/tasklist/tasklist.component';
import { ManageteamsComponent } from './manageteams/manageteams.component';
import { SchedulereunionComponent } from './schedulereunion/schedulereunion.component';


const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: "l, LTS"
  },
  display: {
    dateInput: "l, LTS",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};
// import {MatButtonModule} from '@angular/material/button';
// import {MatFormFieldModule} from '@angular/material/form-field';
// import {MatInputModule} from '@angular/material/input';
// import { MatOptionModule } from '@angular/material/core';
// import { MatSelectModule } from '@angular/material/select';

// const modules = [
//   MatButtonModule,
//   MatFormFieldModule,
//   MatInputModule,
//   MatOptionModule,
//   MatSelectModule
// ];

// @NgModule({
// imports: [...modules],
// exports: [...modules]
// ,
// })export class MaterialModule {};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    MainMenuComponent,
    CreateTeamsComponent,
    ProfileComponent,
    CreateUserComponent,
    NavigbarComponent,
    FooterComponent,
    TaskDetailComponent,
    MultiselectDropdownComponent,
    ProjectsComponent,
    CreateProjectComponent,
    CreateTaskComponent,
    TasklistComponent,
    ManageteamsComponent,
    SchedulereunionComponent,

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
    NgbModule,
    // CalendarModule.forRoot({
    //   provide: DateAdapter,
    //   useFactory: adapterFactory,
    // }),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgMultiSelectDropDownModule.forRoot(),
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatInputModule,
    NgxMatTimepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatMomentModule,
    MatNativeDateModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    // MaterialModule

  ], providers: [
    { provide: APP_INITIALIZER, useFactory: AppInitializer, multi: true, deps: [AuthenticationService] },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

