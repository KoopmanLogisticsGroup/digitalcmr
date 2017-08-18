import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

import {Configuration} from '../app.constants';
import {AuthenticationService} from './authentication.service';

@Injectable()
export class EcmrService {
  private actionUrl: string;
  private headers: any;

  public userRole: string;

  public constructor(private _http: Http,
                     private _configuration: Configuration,
                     private _authenticationService: AuthenticationService) {
    this.actionUrl = `${_configuration.composerHost}${_configuration.composerPrefix}ECMR/`;
    this.headers = _authenticationService.createAuthorizationHeader();
  }

  public getAllEcmrs(ecmrID: string) {
    const user: any = JSON.parse(localStorage.getItem('currentUser')).user;
    this.userRole = JSON.parse(localStorage.getItem('currentUser')).user.role;
    return this._http
      .get(this.actionUrl + ecmrID, {headers: this.headers})
      .map(res => res.json());
  }
}
