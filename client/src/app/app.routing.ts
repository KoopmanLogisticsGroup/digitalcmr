import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from './guards/index';
import {LoginComponent} from './components/login/login.component';
import {OverviewComponent} from './components/overview/overview.component';
import {EcmrDetailComponent} from './components/overview/ecmr-overview/ecmr-detail/ecmr-detail.component';
import {
  TransportorderDetailComponent
} from './components/overview/transportorder-overview/transportorder-detail/transportorder-detail.component';

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'overview', component: OverviewComponent, canActivate: [AuthGuard]},
  {path: 'ecmr/:ecmrID', component: EcmrDetailComponent, canActivate: [AuthGuard], pathMatch: 'full'},
  {
    path:        'transportorder/:orderID',
    component:   TransportorderDetailComponent,
    canActivate: [AuthGuard],
    pathMatch:   'full'
  },

  // otherwise redirect to login
  {path: '**', redirectTo: 'login'}
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
