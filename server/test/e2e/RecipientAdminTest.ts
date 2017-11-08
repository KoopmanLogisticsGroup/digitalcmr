import * as supertest from 'supertest';
import '../../node_modules/mocha';
import * as chai from 'chai';
import * as http from 'http';
import {TransportOrder} from '../../resources/interfaces/transportOrder.interface';
import {Ecmr} from '../../resources/interfaces/ecmr.interface';

const server = supertest.agent('http://localhost:8080');
const should = chai.should();
let token: string;

const ok = (res) => {
  if (res.status !== 200) {
    const status = http.STATUS_CODES[res.status];
    return new Error(`Expected 200, got ${res.status} ${status} with message: ${res.body.message}`);
  }
};

const buildECMR = (ecmrID: string): Ecmr => {
  return <Ecmr>{
    ecmrID:                 ecmrID,
    status:                 'LOADED',
    issuedDate:             1502402400000,
    agreementTerms:         'agreement terms here',
    agreementTermsSec:      'agreement terms sec',
    legalOwnerRef:          'ASD213123S',
    carrierRef:             'H2238723VASD',
    recipientRef:           'SDADHGA21312312',
    orderID:                'AAAA123456',
    creation:               {
      address: {
        name:        'Amsterdam Compound',
        street:      'compenstraat',
        houseNumber: '21',
        city:        'Assen',
        zipCode:     '9976ZH',
        country:     'Netherlands',
        latitude:    51.917153,
        longitude:   4.474623
      },
      date:    1502402400000
    },
    loading:                {
      address:    {
        name:        'Amsterdam Compound',
        street:      'compenstraat',
        houseNumber: '21',
        city:        'Amsterdam',
        zipCode:     '9976ZH',
        country:     'Netherlands',
        latitude:    52.377698,
        longitude:   4.896555
      },
      actualDate: 1502402400000
    },
    delivery:               {
      address:    {
        name:        'Rob Carman',
        street:      'autostraat',
        houseNumber: '12',
        city:        'Rotterdam',
        zipCode:     '9442KO',
        country:     'Netherlands',
        latitude:    51.917153,
        longitude:   4.474623
      },
      actualDate: 1502488800000
    },
    owner:                  'leaseplan',
    source:                 'amsterdamcompound',
    transporter:            'harry@koopman.org',
    carrier:                'koopman',
    recipientOrg:           'cardealer',
    recipient:              'rob@cardealer.org',
    issueDate:              0,
    issuedBy:               'koopman',
    carrierComments:        'No comments',
    documents:              [
      'doc1'
    ],
    goods:                  [
      {
        vehicle:           {
          vin:             '183726339N',
          manufacturer:    'Audi',
          model:           'A1',
          type:            'sportback',
          ecmrs:           [],
          odoMeterReading: 0,
          plateNumber:     'AV198RX'
        },
        description:       'vehicle',
        weight:            1500,
        loadingStartDate:  1502834400000,
        loadingEndDate:    1502834400000,
        deliveryStartDate: 1502834400000,
        deliveryEndDate:   1502834400000
      },
      {
        vehicle:           {
          vin:             '736182CHD28172',
          manufacturer:    'Mercedes',
          model:           'SLK',
          type:            'Station',
          ecmrs:           [],
          odoMeterReading: 0,
          plateNumber:     'I827YE'
        },
        description:       'vehicle',
        weight:            1800,
        loadingStartDate:  1502834400000,
        loadingEndDate:    1502834400000,
        deliveryStartDate: 1502834400000,
        deliveryEndDate:   1502834400000
      }
    ],
    legalOwnerInstructions: 'string',
    paymentInstructions:    'string',
    payOnDelivery:          'string'
  };
};

const buildTransportOrder = (): TransportOrder => {
  return <TransportOrder> {
    orderID:   Math.random().toString(36).substring(7),
    loading:   {
      actualDate: 1502834400000,
      address:    {
        name:        'loading address',
        street:      'een straat',
        houseNumber: '41',
        city:        'Groningen',
        zipCode:     '7811 HC',
        country:     'netherlands',
        longitude:   124,
        latitude:    123
      }
    },
    delivery:  {
      actualDate: 1502834400000,
      address:    {
        name:        'delivery adress',
        street:      'een straat',
        houseNumber: '41',
        city:        'Groningen',
        zipCode:     '7811 HC',
        country:     'netherlands',
        longitude:   124,
        latitude:    123
      }
    },
    carrier:   'koopman',
    source:    'amsterdamcompound',
    goods:     [
      {
        vehicle:           {
          vin:             '183726339N',
          manufacturer:    'Audi',
          model:           'A1',
          type:            'sportback',
          ecmrs:           [],
          odoMeterReading: 0,
          plateNumber:     'AV198RX'
        },
        description:       'vehicle',
        weight:            1500,
        loadingStartDate:  1502834400000,
        loadingEndDate:    1502834400000,
        deliveryStartDate: 1502834400000,
        deliveryEndDate:   1502834400000
      },
      {
        vehicle:           {
          vin:             '736182CHD28172',
          manufacturer:    'Mercedes',
          model:           'SLK',
          type:            'Station',
          ecmrs:           [],
          odoMeterReading: 0,
          plateNumber:     'I827YE'
        },
        description:       'vehicle',
        weight:            1800,
        loadingStartDate:  1502834400000,
        loadingEndDate:    1502834400000,
        deliveryStartDate: 1502834400000,
        deliveryEndDate:   1502834400000
      }
    ],
    status:    'OPEN',
    issueDate: 1502834400000,
    ecmrs:     [],
    orderRef:  'ref',
    owner:     'leaseplan'
  };
};

describe('A Recipient Admin can', () => {
  it('login as a recipient admin', (done) => {
    const loginParams = {
      'username': 'clara@cardealer.org',
      'password': 'passw0rd'
    };

    server
      .post('/api/v1/login')
      .send(loginParams)
      .expect(ok)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);
          return done(err);
        }
        should.exist(res.body.token);
        token = res.body.token;
        done(err);
      });
  });

  it('not create an ECMR', (done) => {
    const ecmr = buildECMR('ecmr1');
    server
      .post('/api/v1/ECMR')
      .set('x-access-token', token)
      .send(ecmr)
      .expect(500)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);
        }
        done(err);
      });
  });

  it('read ECMRs when his org is the recipient', (done) => {
    server
      .get('/api/v1/ECMR')
      .set('x-access-token', token)
      .expect(ok)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);
        }
        res.body.length.should.be.greaterThan(0, 'no ECMRs were found.');
        done(err);
      });
  });

  it('not read an ECMR where his org is not the recipient', (done) => {
    server
      .get('/api/v1/ECMR/ecmrID/H1234567890')
      .set('x-access-token', token)
      .expect(200)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);
        }
        res.body.should.equal(200);
        done(err);
      });
  });

  it('not create an ECMR', (done) => {
    const transportOrder = buildECMR('ecmrRecipient');
    server
      .post('/api/v1/transportOrder')
      .set('x-access-token', token)
      .send(transportOrder)
      .expect(500)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);
        }
        done(err);
      });
  });

  it('not update an ECMR from DELIVERED to Confirmed Delivered', (done) => {
    const transportOrder  = buildECMR('F1234567890');
    transportOrder.status = 'CONFIRMED_DELIVERED';
    server
      .post('/api/v1/transportOrder')
      .set('x-access-token', token)
      .send(transportOrder)
      .expect(500)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);
        }
        done(err);
      });
  });

  it('not create a transport order', (done) => {
    const transportOrder = buildTransportOrder();
    server
      .post('/api/v1/transportOrder')
      .set('x-access-token', token)
      .send(transportOrder)
      .expect(500)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);
        }
        done(err);
      });
  });
});
