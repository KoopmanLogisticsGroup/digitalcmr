import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

import {Configuration} from '../app.constants';
import {AuthenticationService} from './authentication.service';
import {Observable} from 'rxjs/Observable';
import {Ecmr} from '../interfaces/ecmr.interface';

@Injectable()
export class EcmrService {
  private actionUrl: string;
  private headers: Headers;

  public EcmrStatus = {
    Created:            'CREATED',
    Loaded:             'LOADED',
    InTransit:          'IN_TRANSIT',
    Delivered:          'DELIVERED',
    ConfirmedDelivered: 'CONFIRMED_DELIVERED'
  };

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

  public updateEcmr(ecmr: Ecmr): Observable<any> {
    if (ecmr.status === this.EcmrStatus.Created) {
      return this._http.put(this.actionUrl + 'status/LOADED', ecmr, {headers: this.headers})
        .map(res => res.json())
    } else if (ecmr.status === this.EcmrStatus.Loaded) {
      return this._http.put(this.actionUrl + 'status/IN_TRANSIT', ecmr, {headers: this.headers})
        .map(res => res.json())
    } else if (ecmr.status === this.EcmrStatus.InTransit) {
      return this._http.put(this.actionUrl + 'status/DELIVERED', ecmr, {headers: this.headers})
        .map(res => res.json())
    } else if (ecmr.status === this.EcmrStatus.Delivered) {
      return this._http.put(this.actionUrl + 'status/CONFIRMED_DELIVERED', ecmr, {headers: this.headers})
        .map(res => res.json())
    }
  }

  public getEcmrsByTransportOrderID(orderID: string): Observable<any> {
    return this._http.get(this.actionUrl + 'orderID/' + orderID, {headers: this.headers})
      .map(res => res.json())
  }
}
