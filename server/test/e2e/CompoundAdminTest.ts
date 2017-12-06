import * as supertest from 'supertest';
import '../../node_modules/mocha';
import * as chai from 'chai';
import {Ecmr, EcmrStatus} from '../../src/interfaces/ecmr.interface';
import {UpdateEcmrStatus} from '../../src/interfaces/updateEcmrStatus.interface';
import {StatusCode} from './common/StatusCode';
import {Response} from 'superagent';
import {Builder} from './common/Builder';
import {Vehicle} from '../../src/interfaces/vehicle.interface';
import {PickupWindow} from '../../src/interfaces/pickupWindow.interface';
import {TransportOrderStatus, TransportOrder} from '../../src/interfaces/transportOrder.interface';
import {CreateEcmrs} from '../../src/interfaces/createEcmrs.interface';
import {TransportOrderCancellation} from '../../src/interfaces/cancellation.interface';

const server = supertest.agent('http://localhost:8080');
const should = chai.should();

const baseEndPoint = '/api/v1';
let token: string;
let transportOrder: TransportOrder;
let updateEcmr: Ecmr;

describe('A Compound Admin can', () => {
  before((done) => {
    transportOrder = Builder.buildTransportOrder();
    updateEcmr     = Builder.buildECMR('ecmr1');

    const loginParams = {
      'username': 'willem@amsterdamcompound.org',
      'password': 'passw0rd'
    };

    server
      .post(`${baseEndPoint}/login`)
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
      .get(`${baseEndPoint}/ECMR/vehicle/vin/183726339N`)
      .set('x-access-token', token)
      .end((err: Error, res: Response) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        should.exist(res.body.find((ecmr: Ecmr) => ecmr.ecmrID === 'A1234567890'));
        should.exist(res.body.find((ecmr: Ecmr) => ecmr.ecmrID === 'B1234567890'));

        done(err);
      });
  });

  it('get the ECMRs linked to a plate number', (done) => {
    server
      .get(`${baseEndPoint}/ECMR/vehicle/plateNumber/AV198RX`)
      .set('x-access-token', token)
      .end((err: Error, res: Response) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body[0].ecmrID.should.be.equal('A1234567890');
        res.body[1].ecmrID.should.be.equal('B1234567890');

        done(err);
      });
  });

  it('get an ECMR by ecmrID', (done) => {
    server
      .get(`${baseEndPoint}/ECMR/ecmrID/A1234567890`)
      .set('x-access-token', token)
      .expect(StatusCode.ok)
      .end((err: Error, res: Response) => {
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
      .get(`${baseEndPoint}/ECMR`)
      .set('x-access-token', token)
      .expect(StatusCode.ok)
      .end((err: Error, res: Response) => {
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
      .get(`${baseEndPoint}/ECMR/ecmrID/H1234567890`)
      .set('x-access-token', token)
      .expect(200)
      .end((err: Error, res: Response) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body.length.should.equal(0);

        done(err);
      });
  });

  it('not create ECMRs', (done) => {
    const ecmrs = [Builder.buildECMR('randomEcmr')];

    const payload: CreateEcmrs = {
      ecmrs:   ecmrs,
      orderID: ecmrs[0].orderID
    };

    server
      .post(`${baseEndPoint}/ECMR`)
      .set('x-access-token', token)
      .send(payload)
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
    const payload = <UpdateEcmrStatus> {
      ecmrID:    updateEcmr.ecmrID,
      goods:     updateEcmr.goods,
      signature: Builder.buildSignature('willem@amsterdamcompound.org')
    };

    server
      .put(`${baseEndPoint}/ECMR/status/${EcmrStatus.Loaded}`)
      .set('x-access-token', token)
      .send(payload)
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
    const payload = <UpdateEcmrStatus> {
      ecmrID:    updateEcmr.ecmrID,
      goods:     updateEcmr.goods,
      signature: Builder.buildSignature('willem@amsterdamcompound.org')
    };

    server
      .put(`${baseEndPoint}/ECMR/status/${EcmrStatus.Loaded}`)
      .set('x-access-token', token)
      .send(payload)
      .expect(500)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        done(err);
      });
  });

  it('can get ecmr by status CREATED', (done) => {
    server
      .get(`${baseEndPoint}/ECMR/status/${EcmrStatus.Created}`)
      .set('x-access-token', token)
      .end((err: Error, res: Response) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body.length.should.be.greaterThan(0, 'No CREATED ECMRs were found.');
        should.exist(res.body.find((ecmr: Ecmr) => ecmr.status === EcmrStatus.Created));

        done(err);
      });
  });

  it('can get ecmr by status LOADED', (done) => {
    server
      .get(`${baseEndPoint}/ECMR/status/${EcmrStatus.Loaded}`)
      .set('x-access-token', token)
      .end((err: Error, res: Response) => {
          if (err) {
            console.log(err.stack);

            return done(err);
          }
        res.body.length.should.be.greaterThan(0, 'No LOADED ECMRs were found.');
        should.exist(res.body.find((ecmr: Ecmr) => ecmr.status === EcmrStatus.Loaded));

        done(err);
        }
      );
  });

  it('can get ecmr by status IN_TRANSIT', (done) => {
    server
      .get(`${baseEndPoint}/ECMR/status/${EcmrStatus.InTransit}`)
      .set('x-access-token', token)
      .end((err: Error, res: Response) => {
          if (err) {
            console.log(err.stack);

            return done(err);
          }
        res.body.length.should.be.greaterThan(0, 'No IN_TRANSIT ECMRs were found.');
        should.exist(res.body.find((ecmr: Ecmr) => ecmr.status === EcmrStatus.InTransit));

        done(err);
        }
      );
  });

  it('can get ecmr by status DELIVERED', (done) => {
    server
      .get(`${baseEndPoint}/ECMR/status/${EcmrStatus.Delivered}`)
      .set('x-access-token', token)
      .end((err: Error, res: Response) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body.length.should.be.greaterThan(0, 'No DELIVERED ECMRs were found.');
        should.exist(res.body.find((ecmr: Ecmr) => ecmr.status === EcmrStatus.Delivered));

        done(err);
      });
  });

  it('can get ecmr by status CONFIRMED_DELIVERED', (done) => {
    server
      .get(`${baseEndPoint}/ECMR/status/${EcmrStatus.ConfirmedDelivered}`)
      .set('x-access-token', token)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body.length.should.be.greaterThan(0, 'No CONFIRMED_DELIVERED ECMRs were found.');
        should.exist(res.body.find((ecmr: Ecmr) => ecmr.status === EcmrStatus.ConfirmedDelivered));

        done(err);
      });
  });

  it('cannot update an ECMR for his org and if status is IN_TRANSIT', (done) => {
    updateEcmr.status = EcmrStatus.InTransit;

    server
      .put(`${baseEndPoint}/ECMR/status/${EcmrStatus.InTransit}`)
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

  it('can get all vehicles', (done) => {
    server
      .get(`${baseEndPoint}/vehicle`)
      .set('x-access-token', token)
      .expect(StatusCode.ok)
      .end((err: Error, res: Response) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        should.exist(res.body.find((vehicle: Vehicle) => vehicle.plateNumber));

        done(err);
      });
  });

  it('can get a vehicle by vin', (done) => {
    server
      .get(`${baseEndPoint}/vehicle/vin/183726339N`)
      .set('x-access-token', token)
      .expect(StatusCode.ok)
      .end((err: Error, res: Response) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body.vin.should.equal('183726339N');

        done(err);
      });
  });

  it('can get a vehicle by license plate', (done) => {
    server
      .get(`${baseEndPoint}/vehicle/plateNumber/AV198RX`)
      .set('x-access-token', token)
      .expect(StatusCode.ok)
      .end((err: Error, res: Response) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body.plateNumber.should.equal('AV198RX');

        done(err);
      });
  });

  it('cannot create a transport order', (done) => {
    const transportOrder = Builder.buildTransportOrder();

    server
      .post(`${baseEndPoint}/transportOrder`)
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

  it('cannot get a transport orderby orderID', (done) => {
    server
      .get(`${baseEndPoint}/transportOrder/orderID/12345567890`)
      .set('x-access-token', token)
      .expect(StatusCode.ok)
      .expect('Content-Type', /json/)
      .end((err: Error, res: Response) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body.length.should.equal(0);

        done(err);
      });
  });

  it('cannot get a transportOrder by status', (done) => {
    server
      .get(`${baseEndPoint}/transportOrder/status/${TransportOrderStatus.InProgress}`)
      .set('x-access-token', token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err: Error, res: Response) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body.length.should.equal(0);

        done(err);
      });
  });

  it('cannot get a transportOrder by vin', (done) => {
    server
      .get(`${baseEndPoint}/transportOrder/vin/183726339N`)
      .set('x-access-token', token)
      .expect(StatusCode.ok)
      .expect('Content-Type', /json/)
      .end((err: Error, res: Response) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body.length.should.equal(0);

        done(err);
      });
  });

  it('cannot update a pickup window of a transport order', (done) => {
    const pickupWindow: PickupWindow = {
      orderID:    '12345567890',
      vin:        '183726339N',
      dateWindow: [1010101010, 2020202020]
    };

    server
      .put(`${baseEndPoint}/transportOrder/updatePickupWindow`)
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
      .put(`${baseEndPoint}/transportOrder/updateDeliveryWindow`)
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
