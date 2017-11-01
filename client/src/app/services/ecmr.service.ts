import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

import {Configuration} from '../app.constants';
import {AuthenticationService} from './authentication.service';
import {Observable} from 'rxjs/Observable';
import {EcmrInterface} from '../interfaces/ecmr.interface';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';

@Injectable()
export class EcmrService {
  private actionUrl: string;
  private headers: Headers;

  public constructor(private _http: Http,
                     private _configuration: Configuration,
                     private _authenticationService: AuthenticationService) {
    this.actionUrl = `${_configuration.apiHost}${_configuration.apiPrefix}ECMR/`;
    this.headers   = _authenticationService.createAuthorizationHeader();
  }

  public getECMRByID(ecmrID: string): Observable<any> {
    return this._http
      .get(this.actionUrl + 'ecmrID/' + ecmrID, {headers: this.headers})
      .map(res => res.json())
  }

  public getAllEcmrs(): Observable<any> {
    return this._http
      .get(this.actionUrl, {headers: this.headers})
      .map(res => res.json())
  }

  public updateEcmr(ecmr: any): Observable<any> {
    return this._http.put(this.actionUrl, ecmr, {headers: this.headers})
      .map(res => res.json())
  }

  private handleErrorObservable(error: Response | any): ErrorObservable {
    return Observable.throw(error.message || error);
  }
}
