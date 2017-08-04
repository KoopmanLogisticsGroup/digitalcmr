import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

import {Configuration} from '../app.constants';
import {AuthenticationService} from './authentication.service';

@Injectable()
export class EcmrService {
  private actionUrl: string;
  private headers: any;

  private testEcmr = {
    '$class':                 'org.digitalcmr.ECMR',
    'ecmrID':                 'A123456789X',
    'status':                 'OPEN',
    'loadingAddress':         {
      '$class':  'org.digitalcmr.Loading',
      'address': {
        '$class':      'org.digitalcmr.Address',
        'name':        'Amsterdam Compound',
        'street':      'compenstraat',
        'houseNumber': '21',
        'city':        'Assen',
        'zipCode':     '9976ZH',
        'country':     'Netherlands',
        'latitude':    43.1927,
        'longitude':   23.3249,
        'id':          'string'
      },
      'date':    '08/09/2017',
      'id':      'id'
    },
    'deliveryAddress':        {
      '$class':  'org.digitalcmr.Delivery',
      'address': {
        '$class':      'org.digitalcmr.Address',
        'name':        'Rob Carman',
        'street':      'autostraat',
        'houseNumber': '12',
        'city':        'Rotterdam',
        'zipCode':     '9442KO',
        'country':     'Netherlands',
        'latitude':    51.4443,
        'longitude':   60.3323,
        'id':          'id'
      },
      'date':    '10/09/2017',
      'id':      'id'
    },
    'owner':                  'resource:org.digitalcmr.LegalOwnerOrg#leaseplan',
    'source':                 'resource:org.digitalcmr.CompoundOrg#amsterdamcompound',
    'transporter':            'participant:org.digitalcmr.CarrierMember#harry@koopman.org',
    'carrier':                'resource:org.digitalcmr.CarrierOrg#koopman',
    'recipientOrg':           'resource:org.digitalcmr.RecipientOrg#cardealer',
    'recipient':              'participant:org.digitalcmr.RecipientMember#rob@cardealer.org',
    'issueDate':              0,
    'carrierComments':        'No comments',
    'documents':              'documents',
    'goods':                  [
      {
        '$class':       'org.digitalcmr.Good',
        'vehicle':      {
          '$class': 'org.digitalcmr.Vehicle',
          'frameNumber': '183726339N',
          'description': 'Audi A1 sportback',
          'manufacturer': 'Audi',
        },
        'licensePlate': 'AV198RX',
        'weight':       1500,
        'id':           'string'
      },
      {
        '$class':       'org.digitalcmr.Good',
        'vehicle':      {
          '$class': 'org.digitalcmr.Vehicle',
          'frameNumber': '183726339N',
          'description': 'Audi A2 sportback',
          'manufacturer': 'Audi',
        },
        'licensePlate': 'AV198RX',
        'weight':       1500,
        'id':           'string'
      },
      {
        '$class':       'org.digitalcmr.Good',
        'vehicle':      {
          '$class': 'org.digitalcmr.Vehicle',
          'frameNumber': '183726339N',
          'description': 'Audi A3 sportback',
          'manufacturer': 'Audi',
        },
        'licensePlate': 'AV198RX',
        'weight':       1500,
        'id':           'string'
      }
    ],
    'legalOwnerInstructions': 'string',
    'paymentInstructions':    'string',
    'payOnDelivery':          'string'
  };

  public constructor(private _http: Http,
                     private _configuration: Configuration,
                     private _authenticationService: AuthenticationService) {
    this.actionUrl = `${_configuration.apiHost}${_configuration.apiPrefix}things`;
    this.headers   = _authenticationService.createAuthorizationHeader();
  }

  public getEcmrByUser() {
    // const user: any = JSON.parse(localStorage.getItem('currentUser')).user;
    // return this._http
    //   .get(this.actionUrl + '/' + user.userID, {headers: this.headers})
    //   .map(res => res.json());
    const ecmrArr     = [];
    ecmrArr[0]        = this.testEcmr;
    ecmrArr[1]        = this.cloneObject(ecmrArr[0]);
    ecmrArr[1].status = 'PROGRESS';
    ecmrArr[2]        = this.cloneObject(ecmrArr[0]);
    ecmrArr[2].status = 'COMPLETED';
    return ecmrArr;
  }

  private cloneObject(obj: any): any {
    const obj2: any = {};
    Object.keys(obj).forEach(function (key, index) {
      obj2[key] = obj[key];
    });
    return obj2;
  }
}
