import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

import {Configuration} from '../app.constants';
import {AuthenticationService} from './authentication.service';

@Injectable()
export class EcmrService {
  private actionUrl: string;
  private headers: any;

  public constructor(private _http: Http,
                     private _configuration: Configuration,
                     private _authenticationService: AuthenticationService) {
    this.actionUrl = `${_configuration.composerHost}${_configuration.composerPrefix}ECMR/`;
    this.headers   = _authenticationService.createAuthorizationHeader();
  }

  public getAllEcmrs(ecmrID: string) {
    const user: any = JSON.parse(localStorage.getItem('currentUser')).user;
    return this._http
      .get(this.actionUrl + ecmrID, {headers: this.headers})
      .map(res => res.json());
  }


  // private cloneObject(obj: any): any {
  //   const obj2: any = {};
  //   Object.keys(obj).forEach(function (key, index) {
  //     obj2[key] = obj[key];
  //   });
  //   return obj2;
  // }
}
