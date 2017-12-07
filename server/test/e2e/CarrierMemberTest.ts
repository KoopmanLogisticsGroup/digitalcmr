import * as supertest from 'supertest';
import '../../node_modules/mocha';
import * as chai from 'chai';
import * as http from 'http';
import {Ecmr, EcmrStatus} from '../../src/interfaces/ecmr.interface';
import {TransportOrder} from '../../src/interfaces/transportOrder.interface';
import {Address} from '../../src/interfaces/address.interface';
import {StatusCode} from './common/StatusCode';
import {EcmrCancellation, TransportOrderCancellation} from '../../src/interfaces/cancellation.interface';
import {Builder} from './common/Builder';

const server = supertest.agent('http://localhost:8080');
const should = chai.should();
let token: string;
let transportOrder: TransportOrder;
let updateEcmr: Ecmr;

const ok = (res) => {
  if (res.status !== 200) {
    const status = http.STATUS_CODES[res.status];
    return new Error(`Expected 200, got ${res.status} ${status} with message: ${res.body.message}`);
  }
};

const buildAddress = (): Address => {
  return <Address> {
    name:        'name',
    street:      'street',
    houseNumber: 'housenumber',
    city:        'city',
    zipCode:     'zipcode',
    country:     'country',
    longitude:   0,
    latitude:    0
  };
};

const buildECMR = (ecmrID: string): Ecmr => {
  return <Ecmr>{
    ecmrID:                 ecmrID,
    status:                 EcmrStatus.Created,
    issueDate:              1502402400000,
    agreementTerms:         'agreement terms here',
    agreementTermsSec:      'agreement terms sec',
    legalOwnerRef:          'ASD213123S',
    carrierRef:             'H2238723VASD',
    recipientRef:           'SDADHGA21312312',
    orderID:                'AAAA123456',
    creation:               {
      address: buildAddress(),
      date:    1502402400000
    },
    loading:                {
      address:    buildAddress(),
      actualDate: 1502402400000
    },
    delivery:               {
      address:    buildAddress(),
      actualDate: 1502488800000
    },
    owner:                  'leaseplan',
    source:                 'amsterdamcompound',
    transporter:            'harry@koopman.org',
    carrier:                'koopman',
    recipientOrg:           'cardealer',
    recipient:              'rob@cardealer.org',
    issuedBy:               'koopman',
    carrierComments:        'No comments',
    documents:              [],
    goods:                  [],
    legalOwnerInstructions: 'string',
    paymentInstructions:    'string',
    payOnDelivery:          'string'
  };
};

const buildTransportOrder = (): TransportOrder => {
  return <TransportOrder> {
    orderID:   String(new Date().getTime()),
    carrier:   'koopman',
    source:    'amsterdamcompound',
    goods:     [],
    status:    'OPEN',
    issueDate: 1502834400000,
    ecmrs:     [],
    orderRef:  'ref',
    owner:     'leaseplan'
  };
};

describe('A Carrier member can', () => {
  before((done) => {
    transportOrder = buildTransportOrder();

    const loginParamsCarrierMember = {
      'username': 'harry@koopman.org',
      'password': 'passw0rd'
    };

    server
      .post('/api/v1/login')
      .send(loginParamsCarrierMember)
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

  it('get the ECMRs linked to a vin', (done) => {
    server
      .get('/api/v1/ECMR/vehicle/vin/183726339N')
      .set('x-access-token', token)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        done(err);
      });
  });

  it('get the ECMRs linked to a plate number', (done) => {
    server
      .get('/api/v1/ECMR/vehicle/plateNumber/AV198RX')
      .set('x-access-token', token)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        done(err);
      });
  });

  it('get a specific ECMR by ecmrID', (done) => {
    server
      .get('/api/v1/ECMR/ecmrID/A1234567890')
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

          return done(err);
        }
        done(err);
      });
  });

  it('read ECMRs where his org is the carrier', (done) => {
    server
      .get('/api/v1/ECMR')
      .set('x-access-token', token)
      .expect(ok)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        if (res.body instanceof Array) {
          res.body.length.should.be.greaterThan(0, 'No ECMRs for kooopman were found.');
          should.exist(res.body.find(ecmr => ecmr.carrier === 'resource:org.digitalcmr.CarrierOrg#koopman'));
        } else if (res.body instanceof Object) {
          res.body.carrier.should.equal('resource:org.digitalcmr.CarrierOrg#koopman');
        } else {
          res.body.should.equal(200);
        }
        done(err);
      });
  });

  it('not read an ECMR where his org is not the carrier', (done) => {
    server
      .get('/api/v1/ECMR/ecmrID/H1234567890')
      .set('x-access-token', token)
      .expect(200)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body.length.should.equal(0);
        done(err);
      });
  });

  it('not read an ECMR where the status is created', (done) => {
    server
      .get('/api/v1/ECMR/ecmrID/B1234567890')
      .set('x-access-token', token)
      .expect(200)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body.length.should.equal(0);
        done(err);
      });
  });

  it('not submit an update transaction for an ECMR with status created', (done) => {
    const updateTransaction = {
      ecmrID:    'A1234567890',
      goods:     updateEcmr.goods,
      signature: Builder.buildSignature('harry@koopman.org')
    };

    server
      .put('/api/v1/ECMR/status/LOADED')
      .set('x-access-token', token)
      .send(updateTransaction)
      .expect(500)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);
          return done(err);
        }
        done(err);
      });
  });

  it('not submit an update transaction for a different transport org', (done) => {
    const updateTransaction = {
      ecmrID:    'H1234567890',
      goods:     updateEcmr.goods,
      signature: Builder.buildSignature('harry@koopman.org')
    };

    server
      .put('/api/v1/ECMR/status/LOADED')
      .set('x-access-token', token)
      .send(updateTransaction)
      .expect(500)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        done(err);
      });
  });

  it('submit an update status from LOADED to IN_TRANSIT', (done) => {
    const updateTransaction = {
      ecmrID:    updateEcmr.ecmrID,
      goods:     updateEcmr.goods,
      signature: Builder.buildSignature('harry@koopman.org')
    };

    server
      .put('/api/v1/ECMR/status/IN_TRANSIT')
      .set('x-access-token', token)
      .send(updateTransaction)
      .expect(StatusCode.ok)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        done(err);
      });
  });

  it('submit an update status from IN_TRANSIT to DELIVERED', (done) => {
    const updateTransaction = {
      ecmrID:    updateEcmr.ecmrID,
      orderID:   updateEcmr.orderID,
      goods:     updateEcmr.goods,
      signature: Builder.buildSignature('harry@koopman.org')
    };

    server
      .put('/api/v1/ECMR/status/DELIVERED')
      .set('x-access-token', token)
      .send(updateTransaction)
      .expect(StatusCode.ok)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        done(err);
      });
  });

  it('get ecmr by status CREATED', (done) => {
    server
      .get('/api/v1/ECMR/status/CREATED')
      .set('x-access-token', token)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body.length.should.equal(0);
        done(err);
      });
  });

  it('get ecmr by status LOADED', (done) => {
    server
      .get('/api/v1/ECMR/status/LOADED')
      .set('x-access-token', token)
      .end((err: Error, res) => {
          if (err) {
            console.log(err.stack);

            return done(err);
          }
        res.body.length.should.be.greaterThan(0, 'No LOADED ECMRs were found.');
        should.exist(res.body.find(ecmr => ecmr.status === EcmrStatus.Loaded));
        done(err);
        }
      );
  });

  it('get ecmr by status IN_TRANSIT', (done) => {
    server
      .get('/api/v1/ECMR/status/IN_TRANSIT')
      .set('x-access-token', token)
      .end((err: Error, res) => {
          if (err) {
            console.log(err.stack);

            return done(err);
          }
        res.body.length.should.be.greaterThan(0, 'No IN_TRANSIT ECMRs were found.');
        should.exist(res.body.find(ecmr => ecmr.status === EcmrStatus.InTransit));
        done(err);
        }
      );
  });

  it('get ecmr by status DELIVERED', (done) => {
    server
      .get('/api/v1/ECMR/status/DELIVERED')
      .set('x-access-token', token)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body.length.should.be.greaterThan(0, 'No DELIVERED ECMRs were found.');
        should.exist(res.body.find(ecmr => ecmr.status === EcmrStatus.Delivered));
        done(err);
      });
  });

  it('get ecmr by status CONFIRMED_DELIVERED', (done) => {
    server
      .get('/api/v1/ECMR/status/CONFIRMED_DELIVERED')
      .set('x-access-token', token)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body.length.should.be.greaterThan(0, 'No CONFIRMED_DELIVERED ECMRs were found.');
        should.exist(res.body.find(ecmr => ecmr.status === EcmrStatus.ConfirmedDelivered));
        done(err);
      });
  });

  it('not be able to cancel an ECMR', (done) => {
    let cancel = <EcmrCancellation> {
      'ecmrID':       updateEcmr.ecmrID,
      'cancellation': {
        'cancelledBy': 'harry@koopman.org',
        'reason':      'no reason',
        'date':        123
      }
    };

    server
      .put('/api/v1/ECMR/cancel')
      .set('x-access-token', token)
      .send(cancel)
      .expect(500)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        done(err);
      });
  });

  it('not get a specific TransportOrder based on ID', (done) => {
    server
      .get('/api/v1/transportOrder/orderID/12345567890')
      .set('x-access-token', token)
      .expect(ok)
      .expect('Content-Type', /json/)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        should.exist(res.body.orderID === '12345567890');
        done(err);
      });
  });

  it('get a specific TransportOrder when status is IN_PROGRESS', (done) => {
    server
      .get('/api/v1/transportOrder/status/IN_PROGRESS')
      .set('x-access-token', token)
      .expect(ok)
      .expect('Content-Type', /json/)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body.length.should.be.greaterThan(0);
        should.exist(res.body.status === transportOrder.status);
        done(err);
      });
  });

  it('not create a TransportOrder', (done) => {
    const transportOrder = buildTransportOrder();
    server
      .post('/api/v1/transportOrder')
      .set('x-access-token', token)
      .send(transportOrder)
      .expect(500)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        done(err);
      });
  });

  it('not get a specific TransportOrder based on vin', (done) => {
    server
      .get('/api/v1/transportOrder/vin/183726339N')
      .set('x-access-token', token)
      .expect(ok)
      .expect('Content-Type', /json/)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body.length.should.be.greaterThan(0);
        done(err);
      });
  });

  it('get all vehicles', (done) => {
    server
      .get('/api/v1/vehicle')
      .set('x-access-token', token)
      .expect(ok)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        should.exist(res.body.find((vehicle) => vehicle.plateNumber));
        done(err);
      });
  });

  it('get a specific vehicle based on vin', (done) => {
    server
      .get('/api/v1/vehicle/vin/183726339N')
      .set('x-access-token', token)
      .expect(ok)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body.vin.should.equal('183726339N');
        done(err);
      });
  });

  it('get a specific vehicle based on license plate', (done) => {
    server
      .get('/api/v1/vehicle/plateNumber/AV198RX')
      .set('x-access-token', token)
      .expect(ok)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body.plateNumber.should.equal('AV198RX');
        done(err);
      });
  });

  it('not cancel a transportOrder', (done) => {
    let cancel = <TransportOrderCancellation> {
      'orderID':      transportOrder.orderID,
      'cancellation': {
        'cancelledBy': 'lapo@leaseplan.org',
        'date':        123,
        'reason':      'invalid order'
      }
    };

    server
      .put('/api/v1/transportOrder/cancel')
      .set('x-access-token', token)
      .send(cancel)
      .expect(500)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        done(err);
      });
  });

  it('not update an estimatedPickupWindow of a TransportOrder', (done) => {
    const pickupWindow = {
      orderID:    '12345567890',
      vin:        '183726339N',
      dateWindow: [1010101010, 2020202020]
    };

    server
      .put('/api/v1/transportOrder/updatePickupWindow')
      .set('x-access-token', token)
      .send(pickupWindow)
      .expect(500)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        done(err);
      });
  });

  it('not update an estimatedDeliveryWindow of a TransportOrder', (done) => {
    const deliveryWindow = {
      orderID:    '12345567890',
      vin:        '183726339N',
      dateWindow: [1010101010, 2020202020]
    };

    server
      .put('/api/v1/transportOrder/updateDeliveryWindow')
      .set('x-access-token', token)
      .send(deliveryWindow)
      .expect(500)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        done(err);
      });
  });

  it('can not update an expectedPickupWindow of an ECMR', (done) => {
    const expectedWindow = {
      ecmrID:         'A1234567890',
      expectedWindow: [7247832478934, 212213821321]
    };

    server
      .put('/api/v1/ECMR/updateExpectedPickupWindow')
      .set('x-access-token', token)
      .send(expectedWindow)
      .expect(500)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        done(err);
      });
  });

  it('can not update an expectedDeliveryWindow of an ECMR', (done) => {
    const expectedWindow = {
      ecmrID:         'A1234567890',
      expectedWindow: [7247832478934, 212213821321]
    };

    server
      .put('/api/v1/ECMR/updateExpectedDeliveryWindow')
      .set('x-access-token', token)
      .send(expectedWindow)
      .expect(500)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        done(err);
      });
  });
});
