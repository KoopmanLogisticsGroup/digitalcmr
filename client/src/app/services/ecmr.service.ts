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
    this.actionUrl = `${_configuration.apiHost}${_configuration.apiPrefix}ECMR/`;
    this.headers   = _authenticationService.createAuthorizationHeader();
  }

  public getECMRByID(ecmrID: string) {
    return this._http
      .get(this._configuration.composerHost + this._configuration.composerPrefix + 'ecmrID/' + ecmrID, {headers: this.headers})
      .map(res => res.json());
  }

  public getAllEcmrs() {
    return this._http
      .get(this.actionUrl, {headers: this.headers})
      .map(res => res.json());
  }

  public updateEcmr(ecmr: any) {
    return this._http.put(this.actionUrl, ecmr, {headers: this.headers})
      .map(res => res.json())
      .catch(this.handleErrorObservable);
  }

  private handleErrorObservable(error: Response | any) {
    return Observable.throw(error.message || error);
  }
}
