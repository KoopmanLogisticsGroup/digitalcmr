import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

import {Configuration} from '../app.constants';
import {AuthenticationService} from './authentication.service';
import {Observable} from 'rxjs/Observable';
import {TransportOrder} from '../interfaces/transportOrder.interface';

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

  // Change later, when we are using an API
  public generateECMR(transportOrder: TransportOrder) {
    return this._http.post(this.actionUrl + 'generateECMR', {transportOrder: transportOrder}, {headers: this.headers})
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
      .subscribe();
  }
}
