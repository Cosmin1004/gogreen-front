import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginFormComponent } from './login-form/login-form.component';
import { MainMapComponent } from './main-map/main-map.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { CitizenDashboardComponent } from './citizen-dashboard/citizen-dashboard.component';
import { CompanyDashboardComponent } from './company-dashboard/company-dashboard.component';
const routes: Routes = [
  { path: 'login', component: LoginFormComponent },
  { path: 'signup', component: SignupFormComponent },
  { path: 'dashboard', component: UserDashboardComponent },
  { path: 'citizen-dashboard', component: CitizenDashboardComponent },
  { path: 'company-dashboard', component: CompanyDashboardComponent },
  { path: '', component: MainMapComponent },
  {
    path: '*',
    redirectTo: '/',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
