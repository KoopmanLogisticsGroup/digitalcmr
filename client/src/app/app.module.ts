import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {routing, appRoutingProviders} from './app.routing';
import {Configuration} from './app.constants';

import {AuthGuard} from './guards/index';

import {AppComponent} from './app.component';
import {LoginComponent} from './components/login/login.component';
import {ThingsComponent} from './components/things/things.component';

import {ThingService} from './services/thing.service';
import {AuthenticationService} from './services/authentication.service';
import {EcmrService} from './services/ecmr.service';
import {HeaderComponent} from './components/header/header.component';
import {OverviewComponent} from './components/overview/overview.component';
import {EcmrsComponent} from './components/overview/ecmrs/ecmrs.component';
import {EcmrDetailComponent} from './components/ecmr-detail/ecmr-detail.component';
import {GeneralInfoComponent} from './components/ecmr-detail/general-info/general-info.component';
import {GoodsComponent} from './components/ecmr-detail/goods/goods.component';
import {VehicleService} from 'app/services/vehicle.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ThingsComponent,
    HeaderComponent,
    OverviewComponent,
    EcmrsComponent,
    EcmrDetailComponent,
    GeneralInfoComponent,
    GoodsComponent
  ],
  imports:      [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers:    [
    appRoutingProviders,
    Configuration,
    AuthenticationService,
    AuthGuard,
    ThingService,
    EcmrService
  ],
  bootstrap:    [AppComponent]
})
export class AppModule {
}
