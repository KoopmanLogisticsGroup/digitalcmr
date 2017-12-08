import * as supertest from 'supertest';
import '../../node_modules/mocha';
import * as chai from 'chai';
import {TransportOrder} from '../../src/interfaces/transportOrder.interface';
import {Ecmr, EcmrStatus} from '../../src/interfaces/ecmr.interface';
import {Builder} from './common/Builder';
import {StatusCode} from './common/StatusCode';
import {Response} from 'superagent';
import {CreateEcmrs} from '../../src/interfaces/createEcmrs.interface';
import {Cancellation, EcmrCancellation, TransportOrderCancellation} from '../../src/interfaces/cancellation.interface';
import {ExpectedWindow} from '../../src/interfaces/expectedWindow.interface';
import {PickupWindow} from '../../src/interfaces/pickupWindow.interface';
import {DateWindow} from '../../src/interfaces/dateWindow.interface';

const baseEndPoint = '/api/v1';
const server       = supertest.agent('http://localhost:8080');
const should       = chai.should();

let transportOrder: TransportOrder;
let token: string;
let ecmrs: Ecmr[];

describe('A legal owner admin can', () => {
  before((done) => {
    transportOrder = Builder.buildTransportOrder();
    ecmrs          = [Builder.buildECMR('randomEcmr')];

    const loginParams = {
      'username': 'lapo@leaseplan.org',
      'password': 'passw0rd'
    };

    server
      .post(baseEndPoint + '/login')
      .send(loginParams)
      .expect(StatusCode.ok)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: Error, res: Response) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        should.exist(res.body.token);
        token = res.body.token;

        done(err);
      });
  });

  it('not create ECMRs', (done) => {
    const payload: CreateEcmrs = {
      ecmrs:   ecmrs,
      orderID: ecmrs[0].orderID
    };

    server
      .post(baseEndPoint + '/ECMR/createECMRs')
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

  it('read all ECMRs for his organisation', (done) => {
    server
      .get(baseEndPoint + '/ECMR')
      .set('x-access-token', token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: Error, res: Response) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body.length.should.be.greaterThan(0, 'No ECMRs found');

        done(err);
      });
  });

  it('get an ECMR by ecmrID', (done) => {
    server
      .get(baseEndPoint + '/ECMR/ecmrID/D1234567890')
      .set('x-access-token', token)
      .expect(StatusCode.ok)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }

        done(err);
      });
  });

  it('get an ECMR by status', (done) => {
    server
      .get(`/api/v1/ECMR/status/${EcmrStatus.Created}`)
      .set('x-access-token', token)
      .expect(StatusCode.ok)
      .end((err: Error, res: Response) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        should.exist(res.body.find((ecmr: Ecmr) => ecmr.status === EcmrStatus.Created));

        done(err);
      });
  });

  it('not read ECMRs when is org is not the legal owner', (done) => {
    server
      .get(baseEndPoint + '/ECMR/ecmrID/H1234567890')
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

  it('get all ECMRs containing a vehicle with the provided vin', (done) => {
    server
      .get(baseEndPoint + '/ECMR/vehicle/vin/183726339N')
      .set('x-access-token', token)
      .expect(StatusCode.ok)
      .end((err: Error, res: Response) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        should.exist(res.body.find((ecmr: Ecmr) => ecmr.ecmrID === 'C1234567890'));

        done(err);
      });
  });

  it('get all ECMRs containing a vehicle with the plate number', (done) => {
    server
      .get(baseEndPoint + '/ECMR/vehicle/plateNumber/AV198RX')
      .set('x-access-token', token)
      .end((err: Error, res: Response) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        should.exist(res.body.find((ecmr: Ecmr) => ecmr.ecmrID === 'C1234567890'));

        done(err);
      });
  });

  it('get all vehicles', (done) => {
    server
      .get(baseEndPoint + '/vehicle/')
      .set('x-access-token', token)
      .expect(StatusCode.ok)
      .end((err: Error, res: Response) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body.length.should.be.greaterThan(0);

        done(err);
      });
  });

  it('get vehicle by vin', (done) => {
    server
      .get(baseEndPoint + '/vehicle/vin/183726339N')
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

  it('get vehicle by plateNumber', (done) => {
    server
      .get(baseEndPoint + '/vehicle/plateNumber/AV198RX')
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

  it('not cancel an ECMR', (done) => {
    let cancel: EcmrCancellation = {
      ecmrID:       ecmrs[0].ecmrID,
      cancellation: <Cancellation> {
        cancelledBy: 'lapo@leaseplan.org',
        reason:      'no reason',
        date:        123
      }
    };

    server
      .put(baseEndPoint + '/ECMR/cancel')
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

  it('create a TransportOrder', (done) => {
    server
      .post(baseEndPoint + '/transportOrder/')
      .set('x-access-token', token)
      .send(transportOrder)
      .expect(StatusCode.ok)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }

        done(err);
      });
  });

  it('get all TransportOrders where his org is the owner', (done) => {
    server
      .get(baseEndPoint + '/transportOrder')
      .set('x-access-token', token)
      .expect(StatusCode.ok)
      .expect('Content-Type', /json/)
      .end((err: Error, res: Response) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        should.exist(res.body.orderID === transportOrder.orderID);

        done(err);
      });
  });

  it('get a specific TransportOrder by orderID', (done) => {
    server
      .get(baseEndPoint + '/transportOrder/orderID/12345567890')
      .set('x-access-token', token)
      .expect(StatusCode.ok)
      .expect('Content-Type', /json/)
      .end((err: Error, res: Response) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        should.exist(res.body.orderID === '12345567890');

        done(err);
      });
  });

  it('get a specific TransportOrder by status', (done) => {
    server
      .get(`/api/v1/transportOrder/status/${transportOrder.status}`)
      .set('x-access-token', token)
      .expect(StatusCode.ok)
      .expect('Content-Type', /json/)
      .end((err: Error, res: Response) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        should.exist(res.body.find((order: TransportOrder) => order.status === transportOrder.status));

        done(err);
      });
  });

  it('cancel a transportOrder', (done) => {
    let cancel: TransportOrderCancellation = {
      orderID:      transportOrder.orderID,
      cancellation: <Cancellation> {
        cancelledBy: 'lapo@leaseplan.org',
        date:        123,
        reason:      'invalid order'
      }
    };

    server
      .put(baseEndPoint + '/transportOrder/cancel')
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

  it('get a specific TransportOrder based on vin', (done) => {
    server
      .get(baseEndPoint + '/transportOrder/vin/183726339N')
      .set('x-access-token', token)
      .expect(StatusCode.ok)
      .expect('Content-Type', /json/)
      .end((err: Error, res: Response) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body.length.should.be.greaterThan(0);

        done(err);
      });
  });

  it('not create a TransportOrder for another legal owner org', (done) => {
    const wrongTransportOrder = Builder.buildTransportOrder();
    wrongTransportOrder.owner = 'notLeaseplan';

    server
      .post(baseEndPoint + '/transportOrder/')
      .set('x-access-token', token)
      .send(wrongTransportOrder)
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

  it('update the expectedPickupWindow of a TransportOrder with status CREATED', (done) => {
    const pickupWindow: PickupWindow = {
      orderID:    '12345567890',
      vin:        '183726339N',
      dateWindow: <DateWindow> {
        startDate: 1010101010,
        endDate:   2020202020
      }
    };

    server
      .put(baseEndPoint + '/transportOrder/updatePickupWindow')
      .set('x-access-token', token)
      .send(pickupWindow)
      .expect(StatusCode.ok)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }

        done(err);
      });
  });

  it('update the expectedDeliveryWindow of a TransportOrder with status IN_TRANSIT', (done) => {
    const pickupWindow: PickupWindow = {
      orderID:    '12345567890',
      vin:        '183726339N',
      dateWindow: <DateWindow> {
        startDate: 1010101010,
        endDate:   2020202020
      }
    };

    server
      .put(baseEndPoint + '/transportOrder/updateDeliveryWindow')
      .set('x-access-token', token)
      .send(pickupWindow)
      .expect(StatusCode.ok)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }

        done(err);
      });
  });

  it('can not update an expectedPickupWindow of an ECMR', (done) => {
    const expectedWindow: ExpectedWindow = {
      ecmrID:         'A1234567890',
      expectedWindow: <DateWindow> {
        startDate: 1010101010,
        endDate:   2020202020
      }
    };

    server
      .put(baseEndPoint + '/ECMR/updateExpectedPickupWindow')
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
    const expectedWindow: ExpectedWindow = {
      ecmrID:         'E1234567890',
      expectedWindow: <DateWindow> {
        startDate: 1010101010,
        endDate:   2020202020
      }
    };

    server
      .put(baseEndPoint + '/ECMR/updateExpectedDeliveryWindow')
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