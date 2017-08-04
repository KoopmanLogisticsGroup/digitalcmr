import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from './guards/index';
import {LoginComponent} from './components/login/login.component';
import {ThingsComponent} from './components/things/things.component';
import {OverviewComponent} from './components/overview/overview.component';
import {EcmrsComponent} from './components/overview/ecmrs/ecmrs.component';
import {GoodsComponent} from "./components/ecmr-detail/goods/goods.component"

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'things', component: ThingsComponent, canActivate: [AuthGuard]},
  {path: 'overview', component: OverviewComponent},
  {path: 'ecmrs', component: EcmrsComponent},
  {path: 'goods', component: GoodsComponent},

  // otherwise redirect to login
  {path: '**', redirectTo: 'things'}
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
