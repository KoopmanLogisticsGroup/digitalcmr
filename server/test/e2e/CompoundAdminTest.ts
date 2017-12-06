import * as supertest from 'supertest';
import '../../node_modules/mocha';
import * as chai from 'chai';
import * as http from 'http';
import {TransportOrder} from '../../src/interfaces/transportOrder.interface';
import {Ecmr, EcmrStatus} from '../../src/interfaces/ecmr.interface';
import {Address} from '../../src/interfaces/address.interface';
import {PickupWindow} from '../../src/interfaces/pickupWindow.interface';
import {TransportOrderCancellation} from '../../src/interfaces/cancellation.interface';

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
    loading:   {
      actualDate: 1502834400000,
      address:    buildAddress(),
    },
    delivery:  {
      actualDate: 1502834400000,
      address:    buildAddress(),
    },
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

describe('A Compound Admin can', () => {
  before((done) => {
    transportOrder = buildTransportOrder();
    updateEcmr     = buildECMR('ecmr1');

    const loginParams = {
      'username': 'willem@amsterdamcompound.org',
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

  it('get the ECMRs linked to a vin', (done) => {
    server
      .get('/api/v1/ECMR/vehicle/vin/183726339N')
      .set('x-access-token', token)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        should.exist(res.body.find((ecmr) => ecmr.ecmrID === 'A1234567890'));
        should.exist(res.body.find((ecmr) => ecmr.ecmrID === 'B1234567890'));
        done(err);
      });
  });

  it('get the ECMRs linked to a plate number', (done) => {
    server
      .get('/api/v1/ECMR/vehicle/plateNumber/AV198RX')
      .set('x-access-token', token)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body[0].ecmrID.should.be.equal('A1234567890');
        res.body[1].ecmrID.should.be.equal('B1234567890');
        done(err);
      });
  });

  it('get specific ECMRs by ecmrID', (done) => {
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

  it('read ECMRs where his org is the source', (done) => {
    server
      .get('/api/v1/ECMR')
      .set('x-access-token', token)
      .expect(ok)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body.length.should.be.greaterThan(0, 'no ECMRs were found.');
        done(err);
      });
  });

  it('not read an ECMR where his org is not the source', (done) => {
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

  it('not create an ECMR', (done) => {
    const ecmr = buildECMR('ecmr1');
    server
      .post('/api/v1/ECMR')
      .set('x-access-token', token)
      .send(ecmr)
      .expect('Content-Type', /json/)
      .expect(500)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        done(err);
      });
  });

  it('not cancel an ECMR', (done) => {
    let cancel = {
      'ecmrID':       updateEcmr.ecmrID,
      'cancellation': {
        'cancelledBy': 'willem@amsterdamcompound.org',
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

  it('submit an update status from CREATED to LOADED', (done) => {
    updateEcmr.status            = EcmrStatus.Loaded;
    updateEcmr.compoundSignature = {
      certificate: 'willem@amsterdamcompound.org',
      timestamp:   0
    };

    server
      .put('/api/v1/ECMR')
      .set('x-access-token', token)
      .send(updateEcmr)
      .expect(200)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        done(err);
      });
  });

  it('not update an ECMR when his org is not the source', (done) => {
    updateEcmr.source = 'rotterdamCompound';
    server
      .put('/api/v1/ECMR')
      .set('x-access-token', token)
      .send(updateEcmr)
      .expect(500)
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
        res.body.length.should.be.greaterThan(0, 'No CREATED ECMRs were found.');
        should.exist(res.body.find(ecmr => ecmr.status === 'CREATED'));
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
        should.exist(res.body.find(ecmr => ecmr.status === 'LOADED'));
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
        should.exist(res.body.find(ecmr => ecmr.status === 'IN_TRANSIT'));
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
        should.exist(res.body.find(ecmr => ecmr.status === 'DELIVERED'));
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
        should.exist(res.body.find((ecmr) => ecmr.status === 'CONFIRMED_DELIVERED'));
        done(err);
      });
  });

  it('not update an ECMR for his org and status is IN_TRANSIT', (done) => {
    updateEcmr.status = EcmrStatus.InTransit;
    server
      .put('/api/v1/ECMR')
      .set('x-access-token', token)
      .send(updateEcmr)
      .expect(500)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);
          return done(err);
        }
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

          return done(err);
        }
        done(err);
      });
  });

  it('not get a specific transport order based on ID', (done) => {
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
        res.body.length.should.equal(0);
        done(err);
      });
  });

  it('not get a specific transport order based on status', (done) => {
    server
      .get('/api/v1/transportOrder/status/IN_PROGRESS')
      .set('x-access-token', token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body.length.should.equal(0);
        done(err);
      });
  });

  it('not get a specific transport order based on vin', (done) => {
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
        res.body.length.should.equal(0);
        done(err);
      });
  });

  it('not update a pickup window of a transport order', (done) => {
    const pickupWindow: PickupWindow = {
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

  it('not update a delivery window of a transport order', (done) => {
    const pickupWindow: PickupWindow = {
      orderID:    '12345567890',
      vin:        '183726339N',
      dateWindow: [1010101010, 2020202020]
    };

    server
      .put('/api/v1/transportOrder/updateDeliveryWindow')
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

  it('can not update an expectedDeliveryWindow of an ECMR with a status other than IN_TRANSIT', (done) => {
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
