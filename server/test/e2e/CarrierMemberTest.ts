import * as supertest from 'supertest';
import '../../node_modules/mocha';
import * as chai from 'chai';
import * as http from 'http';
import {Ecmr} from '../../resources/interfaces/ecmr.interface';
import {TransportOrder} from '../../resources/interfaces/transportOrder.interface';

const server = supertest.agent('http://localhost:8080');
const should = chai.should();
let token: string;
let updateEcmr: Ecmr;

const ok = (res) => {
  if (res.status !== 200) {
    const status = http.STATUS_CODES[res.status];
    return new Error(`Expected 200, got ${res.status} ${status} with message: ${res.body.message}`);
  }
};

const buildECMR = (ecmrID: string): Ecmr => {
  return <Ecmr>{
    ecmrID:                 ecmrID,
    status:                 'CREATED',
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
  }

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
  }
};


describe('An Carrier member can', () => {

  it('login as a carrier member', (done) => {
    const loginParams = {
      'username': 'harry@koopman.org',
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

  it('get a specific ECMR', (done) => {
    server
      .get('/api/v1/ECMR/ecmrID/D1234567890')
      .set('x-access-token', token)
      .expect(ok)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);
          return done(err);
        }
        updateEcmr = res.body;
        done(err);
      });
  });

  it('can not create an eCMR', (done) => {
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

  it('can read ECMRs where his org is the carrier', (done) => {
    server
      .get('/api/v1/ECMR')
      .set('x-access-token', token)
      .expect(ok)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);
        }
        res.body.length.should.be.greaterThan(0, 'no eCMRs were found.');
        done(err);
      });
  });

  it('can not read an eCMR where his org is not the carrier', (done) => {
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

  it('can not read an eCMR where the status is created', (done) => {
    server
      .get('/api/v1/ECMR/ecmrID/B1234567890')
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

  it('can not create a transport order', (done) => {
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

  it('can not submit an update transaction for an eCMR with status created', (done) => {
    server
      .put('/api/v1/ECMR')
      .set('x-access-token', token)
      .send(buildECMR('ecmr1234'))
      .expect(500)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);
        }
        done(err);
      });
  });

  it('can not submit an update transaction for a different transport org', (done) => {
    const wrongOrgEcmr   = buildECMR('D1234567890');
    wrongOrgEcmr.carrier = 'notKoopman';
    server
      .put('/api/v1/ECMR')
      .set('x-access-token', token)
      .send(updateEcmr)
      .expect(500)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);
        }
        done(err);
      });
  });

  it('submit an update status from LOADED to IN_TRANSIT', (done) => {
    updateEcmr.status                  = 'IN_TRANSIT';
    updateEcmr.carrierLoadingSignature = {
      certificate: 'harry@koopman.org', timestamp: 0
    };
    server
      .put('/api/v1/ECMR')
      .set('x-access-token', token)
      .send(updateEcmr)
      .expect(200)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);
        }
        done(err);
      });
  });

  it('submit an update status from IN_TRANSIT to DELIVERED', (done) => {
    updateEcmr.status                   = 'DELIVERED';
    updateEcmr.carrierDeliverySignature = {
      certificate: 'harry@koopman.org', timestamp: 0
    };
    server
      .put('/api/v1/ECMR')
      .set('x-access-token', token)
      .send(updateEcmr)
      .expect(200)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);
        }
        done(err);
      });
  });
  // it('can  submit an update transaction for his org and status from LOADED to IN_TRANSIT', (done) => {
  //   updateEcmr.status  = 'IN_TRANSIT';
  //   updateEcmr.carrierLoadingSignature = {'certificate': 'harry@koopman.org', 'timestamp': 0 };
  //   server
  //     .put('/api/v1/ECMR')
  //     .set('x-access-token', token)
  //     .send(updateEcmr)
  //     .expect(200)
  //     .end((err: Error) => {
  //       if (err) {
  //         console.log(err.stack);
  //       }
  //       done(err);
  //     });
  // });
  //
  // it('can  submit an update transaction for his org and status from IN_TANSIT to DELIVERED', (done) => {
  //   updateEcmr.status = 'DELIVERED';
  //   updateEcmr.carrierDeliverySignature = {'certificate': 'harry@koopman.org', 'timestamp': 0 };
  //   server
  //     .put('/api/v1/ECMR')
  //     .set('x-access-token', token)
  //     .send(updateEcmr)
  //     .expect(200)
  //     .end((err: Error) => {
  //       if (err) {
  //         console.log(err.stack);
  //       }
  //       done(err);
  //     });
  // });
});
