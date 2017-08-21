import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

import {Configuration} from '../app.constants';
import {AuthenticationService} from './authentication.service';
import {Ecmr} from '../classes/ecmr.model';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class EcmrService {
  private actionUrl: string;
  private headers: any;

  public constructor(private _http: Http,
                     private _configuration: Configuration,
                     private _authenticationService: AuthenticationService) {
    this.actionUrl = `${_configuration.composerHost}${_configuration.composerPrefix}ECMR/`;
    this.headers = _authenticationService.createAuthorizationHeader();
    console.log(this.headers);
  }

  public getAllEcmrs(ecmrID: string) {
    const user: any = JSON.parse(localStorage.getItem('currentUser')).user;
    return this._http
      .get(this.actionUrl + ecmrID, {headers: this.headers})
      .map(res => res.json());
  }

  public updateEcmr(ecmr: Ecmr) {
    // return this._http.post(this.actionUrl, ecmr, {headers: this.headers})
    //   .map(res => res.json())
    //   .catch(this.handleErrorObservable);
  }

  private handleErrorObservable(error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }
}
