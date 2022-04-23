import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { DashboardComponent } from './dashboard/dashboard.component';
// import { CalendarComponent } from './calendar/calendar.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationGuard } from './guards/authentication.guard';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent,canActivate: [AuthenticationGuard] },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/