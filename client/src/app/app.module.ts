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
import {HeaderComponent} from './components/header/header.component';
import {OverviewComponent} from './components/overview/overview.component';
import {EcmrDetailComponent} from './components/ecmr-detail/ecmr-detail.component';
import {GeneralInfoComponent} from './components/ecmr-detail/general-info/general-info.component';
import {GoodsComponent} from './components/ecmr-detail/goods/goods.component';
import {SignOffModalComponent} from './components/ecmr-detail/sign-off-modal/sign-off-modal.component';
import {FilterByPipe} from '../../src/app/utils/filterBy.pipe';
import {SearchService} from './services/search.service';
import {NavbarService} from './services/navbar.service';
import {TransportOrderService} from './services/transportorder.service';
import {TransportorderDetailComponent} from './components/transportorder-detail/transportorder-detail.component';
import {TransportorderGoodsComponent} from './components/transportorder-detail/transportorder-goods/transportorder-goods.component';
import {EcmrOverviewComponent} from './components/overview/ecmr-overview/ecmr-overview.component';
import {TransportorderOverviewComponent} from './components/overview/transportorder-overview/transportorder-overview.component';
import {CancelModalComponent} from './components/transportorder-detail/cancel-modal/cancel-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    OverviewComponent,
    EcmrDetailComponent,
    GeneralInfoComponent,
    GoodsComponent,
    SignOffModalComponent,
    FilterByPipe,
    TransportorderDetailComponent,
    TransportorderGoodsComponent,
    EcmrOverviewComponent,
    TransportorderOverviewComponent,
    CancelModalComponent
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
    NavbarService,
    TransportOrderService
  ],
  bootstrap:    [AppComponent]
})
export class AppModule {
}
