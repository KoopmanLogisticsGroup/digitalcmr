var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { Configuration } from '../app.constants';
import 'rxjs/add/operator/map';
export var AuthenticationService = (function () {
    function AuthenticationService(_http, _configuration) {
        this._http = _http;
        this._configuration = _configuration;
        this.TOKEN_KEY = 'token';
        this.USER_KEY = 'currentUser';
        this.actionUrl = "" + _configuration.apiHost + _configuration.apiPrefix + "login";
        // set token if saved in local storage
        this.token = this.getToken();
    }
    AuthenticationService.prototype.login = function (username, password) {
        var _this = this;
        return this._http.post(this.actionUrl, { username: username, password: password })
            .map(function (response) {
            if (!response || !response.json || !response.json()) {
                return false;
            }
            var user = response.json().user;
            var token = response.json().token;
            if (!token) {
                return false; // Login unsuccessful if there's no token in the response
            }
            _this.token = token;
            // store username and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem(_this.TOKEN_KEY, JSON.stringify({ token: token }));
            localStorage.setItem(_this.USER_KEY, JSON.stringify({ user: user }));
            return true;
        }).catch(function (error) { return Observable.throw(error.json().error || 'Server error'); });
    };
    // clear token and remove user from local storage to log user out
    AuthenticationService.prototype.logout = function () {
        this.token = null;
        localStorage.removeItem(this.USER_KEY);
        localStorage.removeItem(this.TOKEN_KEY);
    };
    AuthenticationService.prototype.createAuthorizationHeader = function () {
        var headers = new Headers();
        headers.append('x-access-token', this.getToken());
        headers.append('Content-Type', 'application/json');
        return headers;
    };
    AuthenticationService.prototype.getToken = function () {
        var userToken = JSON.parse(localStorage.getItem(this.TOKEN_KEY));
        return userToken ? userToken.token : null;
    };
    AuthenticationService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [Http, Configuration])
    ], AuthenticationService);
    return AuthenticationService;
}());
//# sourceMappingURL=/Users/luigiventi/Projects/node-boilerplate/node-boilerplate/client/src/app/services/authentication.service.js.map