import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from './guards/index';
import {LoginComponent} from './components/login/login.component';
import {ThingsComponent} from './components/things/things.component';
import {OverviewComponent} from './components/overview/overview.component';

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'overview', component: OverviewComponent, canActivate: [AuthGuard]},

  // otherwise redirect to login
  {path: '**', redirectTo: 'overview'}
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
