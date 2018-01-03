import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Configuration} from '../app.constants';
import {AuthenticationService} from './authentication.service';
import {Observable} from 'rxjs/Observable';
import {UpdateEcmrStatus} from '../interfaces/updateEcmrStatus.interface';
import {EcmrStatus} from '../interfaces/ecmr.interface';

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
      .map(res => res.json());
  }

  public getAllEcmrs(): Observable<any> {
    return this._http
      .get(this.actionUrl, {headers: this.headers})
      .map(res => res.json());
  }

  public updateEcmr(data: UpdateEcmrStatus, ecmrStatus: EcmrStatus): Observable<any> {
    if (ecmrStatus === EcmrStatus.Created) {
      return this._http.put(this.actionUrl + 'status/LOADED', data, {headers: this.headers})
        .map(res => res.json());
    } else if (ecmrStatus === EcmrStatus.Loaded) {
      return this._http.put(this.actionUrl + 'status/IN_TRANSIT', data, {headers: this.headers})
        .map(res => res.json());
    } else if (ecmrStatus === EcmrStatus.InTransit) {
      return this._http.put(this.actionUrl + 'status/DELIVERED', data, {headers: this.headers})
        .map(res => res.json());
    } else if (ecmrStatus === EcmrStatus.Delivered) {
      return this._http.put(this.actionUrl + 'status/CONFIRMED_DELIVERED', data, {headers: this.headers})
        .map(res => res.json());
    }
  }

  public getEcmrsByTransportOrderID(orderID: string): Observable<any> {
    return this._http.get(this.actionUrl + 'orderID/' + orderID, {headers: this.headers})
      .map(res => res.json());
  }
}
