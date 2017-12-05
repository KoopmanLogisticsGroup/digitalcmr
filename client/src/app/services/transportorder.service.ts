import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

import {Configuration} from '../app.constants';
import {AuthenticationService} from './authentication.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class TransportOrderService {
  private actionUrl: string;
  private headers: Headers;

  public constructor(private _http: Http,
                     private _configuration: Configuration,
                     private _authenticationService: AuthenticationService) {
    this.actionUrl = `${_configuration.apiHost}${_configuration.apiPrefix}transportOrder/`;
    this.headers   = _authenticationService.createAuthorizationHeader();
  }

  public getTransportOrderByOrderID(orderID: string): Observable<any> {
    return this._http
      .get(this.actionUrl + 'orderID/' + orderID, {headers: this.headers})
      .map(res => res.json())
  }

  public getAllTransportOrders(): Observable<any> {
    return this._http
      .get(this.actionUrl, {headers: this.headers})
      .map(res => res.json())
  }

  public cancelTransportOrder(transportOrder): Observable<any> {
    return this._http
      .put(this.actionUrl + 'cancel', transportOrder, {headers: this.headers})
      .map(res => res.json())
  }
}
