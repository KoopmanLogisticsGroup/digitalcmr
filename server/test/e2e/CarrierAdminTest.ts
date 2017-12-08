import * as supertest from 'supertest';
import '../../node_modules/mocha';
import * as chai from 'chai';
import {Ecmr} from '../../src/interfaces/ecmr.interface';
import {TransportOrder} from '../../src/interfaces/transportOrder.interface';
import {EcmrStatus} from '../../src/interfaces/ecmr.interface';
import {StatusCode} from './common/StatusCode';
import {Builder} from './common/Builder';
import {EcmrCancellation, TransportOrderCancellation} from '../../src/interfaces/cancellation.interface';

const server = supertest.agent('http://localhost:8080');
const should = chai.should();
let token: string;
let transportOrder: TransportOrder;
let updateEcmr: Ecmr;

describe('A Carrier Admin can', () => {
  before((done) => {
    transportOrder    = Builder.buildTransportOrder();
    const loginParams = {
      'username': 'pete@koopman.org',
      'password': 'passw0rd'
    };

    server
      .post('/api/v1/login')
      .send(loginParams)
      .expect(StatusCode.ok)
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
        should.exist(res.body.find(ecmr => ecmr.ecmrID === 'A1234567890'));
        should.exist(res.body.find(ecmr => ecmr.ecmrID === 'B1234567890'));
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
        should.exist(res.body.find(ecmr => ecmr.ecmrID === 'A1234567890'));
        should.exist(res.body.find(ecmr => ecmr.ecmrID === 'B1234567890'));
        done(err);
      });
  });

  it('get a specific ECMR by ecmrID', (done) => {
    server
      .get('/api/v1/ECMR/ecmrID/A1234567890')
      .set('x-access-token', token)
      .expect(StatusCode.ok)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        updateEcmr = res.body;
        done(err);
      });
  });

  it('read ECMRs where his org is the transporter and status is not created', (done) => {
    server
      .get('/api/v1/ECMR')
      .set('x-access-token', token)
      .expect(StatusCode.ok)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body.length.should.be.greaterThan(0, 'No ECMRs were found for carrier org');
        should.exist(res.body.find(ecmr => ecmr.carrier === 'resource:org.digitalcmr.CarrierOrg#koopman'));
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

  it('create an ECMR', (done) => {
    let ecmrList: Ecmr[] = [];
    const ecmr: Ecmr     = Builder.buildECMR('ecmr1');
    ecmrList.push(ecmr);
    const ecmrs = {
      orderID: '12345567890',
      ecmrs:   ecmrList
    };

    server
      .post('/api/v1/ECMR')
      .set('x-access-token', token)
      .send(ecmrs)
      .expect(200)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        done(err);
      });
  });

  it('cancel an ECMR', (done) => {
    let cancel = <EcmrCancellation> {
      'ecmrID':       'ecmr1',
      'cancellation': {
        'cancelledBy': 'pete@koopman.org',
        'reason':      'no reason',
        'date':        123
      }
    };

    server
      .put('/api/v1/ECMR/cancel')
      .set('x-access-token', token)
      .send(cancel)
      .expect(200)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        done(err);
      });
  });

  it('not submit an update status from LOADED to IN_TRANSIT', (done) => {
    const updateTransaction = {
      ecmrID:    updateEcmr.ecmrID,
      goods:     updateEcmr.goods,
      signature: Builder.buildSignature('harry@koopman.org')
    };
    server
      .put('/api/v1/ECMR/status/IN_TRANSIT')
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

  it('not submit an update status from IN_TRANSIT to DELIVERED', (done) => {
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
        should.exist(res.body.find(ecmr => ecmr.status === EcmrStatus.Created));
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

  it('get all vehicles', (done) => {
    server
      .get('/api/v1/vehicle')
      .set('x-access-token', token)
      .expect(StatusCode.ok)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        should.exist(res.body);
        res.body.length.should.be.greaterThan(0);
        done(err);
      });
  });

  it('get a specific vehicle', (done) => {
    server
      .get('/api/v1/vehicle/vin/183726339N')
      .set('x-access-token', token)
      .expect(StatusCode.ok)
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
      .expect(StatusCode.ok)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        should.exist(res.body);
        res.body.plateNumber.should.equal('AV198RX');
        done(err);
      });
  });

  it('not create a TransportOrder', (done) => {
    const transportOrder = Builder.buildTransportOrder();
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

  it('get a TransportOrder', (done) => {
    server
      .get('/api/v1/transportOrder')
      .set('x-access-token', token)
      .expect(StatusCode.ok)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body.length.should.be.greaterThan(0);
        should.exist(res.body.find(transportOrder => transportOrder.orderID === '12345567890'));
        done(err);
      });
  });

  it('get a specific TransportOrder based on ID', (done) => {
    server
      .get('/api/v1/transportOrder/orderID/12345567890')
      .set('x-access-token', token)
      .expect(StatusCode.ok)
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

  it('get a specific TransportOrder based on any status', (done) => {
    server
      .get('/api/v1/transportOrder/status/IN_PROGRESS')
      .set('x-access-token', token)
      .expect(StatusCode.ok)
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

  it('get a specific TransportOrder based on vin', (done) => {
    server
      .get('/api/v1/transportOrder/vin/183726339N')
      .set('x-access-token', token)
      .expect(StatusCode.ok)
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

  it('update an expectedPickupWindow of an ECMR', (done) => {
    const expectedWindow = {
      ecmrID:         'A1234567890',
      expectedWindow: [7247832478934, 212213821321]
    };

    server
      .put('/api/v1/ECMR/updateExpectedPickupWindow')
      .set('x-access-token', token)
      .send(expectedWindow)
      .expect(StatusCode.ok)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        done(err);
      });
  });

  it(' not update an expectedPickupWindow of an ECMR with a status other than CREATED', (done) => {
    const expectedWindow = {
      ecmrID:         'E1234567890',
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

  it(' update an expectedDeliveryWindow of an ECMR with status IN_TRANSIT', (done) => {
    const expectedWindow = {
      ecmrID:         'E1234567890',
      expectedWindow: [7247832478934, 212213821321]
    };

    server
      .put('/api/v1/ECMR/updateExpectedDeliveryWindow')
      .set('x-access-token', token)
      .send(expectedWindow)
      .expect(StatusCode.ok)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        done(err);
      });
  });

  it(' not update an expectedDeliveryWindow of an ECMR with a status other than IN_TRANSIT', (done) => {
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
