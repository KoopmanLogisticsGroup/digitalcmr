import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from './guards/index';
import {LoginComponent} from './components/login/login.component';
import {ThingsComponent} from './components/things/things.component';
import {OverviewComponent} from './components/overview/overview.component';
import {EcmrsComponent} from './components/overview/ecmrs/ecmrs.component';
import {EcmrDetailComponent} from './components/ecmr-detail/ecmr-detail.component';

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'overview', component: OverviewComponent, canActivate: [AuthGuard]},
  {path: 'ecmr-detail', component: EcmrDetailComponent, canActivate: [AuthGuard]},

  // otherwise redirect to login
  {path: '**', redirectTo: 'login'}
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
