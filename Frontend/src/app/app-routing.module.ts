import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { DashboardComponent } from './dashboard/dashboard.component';
// import { CalendarComponent } from './calendar/calendar.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationGuard } from './guards/authentication.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainMenuComponent } from './mainmenu/mainmenu.component';
import { CreateTeamsComponent } from './create-teams/create-teams.component';
import { ProfileComponent } from './profile/profile.component';
import { CreateUserComponent } from './createuser/createuser.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { ProjectsComponent } from './projects/projects.component';
import { AdminGuard } from './guards/admin.guard';
import { CreateProjectComponent } from './create-project/create-project.component';
import { CreateTaskComponent } from './create-task/create-task.component';

import { TasklistComponent } from './tasklist/tasklist/tasklist.component';
import { ManageteamsComponent } from './manageteams/manageteams.component';
import { UsersListComponent } from './users-list/users-list/users-list.component';
import { UserPageComponent } from './userPage/user-page/user-page.component';
import { SchedulereunionComponent } from './schedulereunion/schedulereunion.component';
import { TeamListComponent } from './team-list/team-list.component';
import { TeamCalendarComponent } from './team-calendar/team-calendar.component';
const routes: Routes = [
  { path: '', redirectTo: '/mainmenu', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent,canActivate: [AuthenticationGuard] },
  { path: 'login', component: LoginComponent},
  { path: 'mainmenu', component: MainMenuComponent,canActivate: [AuthenticationGuard]  },
  { path: 'createteam', component: CreateTeamsComponent,canActivate: [AuthenticationGuard, AdminGuard]  },
  { path: 'profile', component: ProfileComponent,canActivate: [AuthenticationGuard]},
  { path: 'createuser', component: CreateUserComponent, canActivate: [AuthenticationGuard, AdminGuard]  },
  { path: 'projects', component: ProjectsComponent, canActivate: [AuthenticationGuard, AdminGuard]  },
  { path: 'createproject', component: CreateProjectComponent, canActivate: [AuthenticationGuard, AdminGuard]  },
  { path: 'taskDetail/:id', component: TaskDetailComponent, canActivate: [AuthenticationGuard]  },
  { path: 'createtask', component: CreateTaskComponent, canActivate: [AuthenticationGuard]  },
  { path: 'tasklist', component: TasklistComponent, canActivate: [AuthenticationGuard]  },
  { path: 'manageteams', component: ManageteamsComponent, canActivate: [AuthenticationGuard]  },
  { path: 'userslist', component: UsersListComponent, canActivate: [AuthenticationGuard]  },
  { path: 'profile/:id', component: UserPageComponent, canActivate: [AuthenticationGuard]  },
  { path: 'manageteams', component: ManageteamsComponent, canActivate: [AuthenticationGuard, AdminGuard]  },
  { path: 'schedulereunions', component: SchedulereunionComponent, canActivate: [AuthenticationGuard]  },
  { path: 'teamslist', component: TeamListComponent, canActivate: [AuthenticationGuard]  },
  { path: 'team/:id', component: TeamCalendarComponent, canActivate: [AuthenticationGuard]  }
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