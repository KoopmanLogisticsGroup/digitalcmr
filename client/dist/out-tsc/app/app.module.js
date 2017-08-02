var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing, appRoutingProviders } from './app.routing';
import { Configuration } from './app.constants';
import { AuthGuard } from './guards/index';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ThingsComponent } from './components/things/things.component';
import { ThingService } from './services/thing.service';
import { AuthenticationService } from './services/authentication.service';
export var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            declarations: [
                AppComponent,
                LoginComponent,
                ThingsComponent
            ],
            imports: [
                BrowserModule,
                FormsModule,
                HttpModule,
                routing
            ],
            providers: [
                appRoutingProviders,
                Configuration,
                AuthenticationService,
                AuthGuard,
                ThingService
            ],
            bootstrap: [AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=/Users/luigiventi/Projects/node-boilerplate/node-boilerplate/client/src/app/app.module.js.map