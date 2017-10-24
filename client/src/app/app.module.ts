import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {routing, appRoutingProviders} from './app.routing';
import {Configuration} from './app.constants';

import {AuthGuard} from './guards/index';

import {AppComponent} from './app.component';
import {LoginComponent} from './components/login/login.component';

import {AuthenticationService} from './services/authentication.service';
import {EcmrService} from './services/ecmr.service';
import {HeaderComponent} from './components/overview/header/header.component';
import {OverviewComponent} from './components/overview/overview.component';
import {EcmrsComponent} from './components/overview/ecmrs/ecmrs.component';
import {EcmrDetailComponent} from './components/ecmr-detail/ecmr-detail.component';
import {GeneralInfoComponent} from './components/ecmr-detail/general-info/general-info.component';
import {GoodsComponent} from './components/ecmr-detail/goods/goods.component';
import {SignOffModalComponent} from './components/ecmr-detail/sign-off-modal/sign-off-modal.component';
import {FilterByPipe} from '../../src/app/utils/filterBy.pipe';
import {SearchService} from './services/search.service';
import {NavbarService} from './services/navbar.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    OverviewComponent,
    EcmrsComponent,
    EcmrDetailComponent,
    GeneralInfoComponent,
    GoodsComponent,
    SignOffModalComponent,
    FilterByPipe
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
    EcmrService,
    SearchService,
    NavbarService
  ],
  bootstrap:    [AppComponent]
})
export class AppModule {
}
