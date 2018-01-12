import * as supertest from 'supertest';
import '../../node_modules/mocha';
import * as chai from 'chai';
import {Ecmr, EcmrStatus} from '../../src/interfaces/ecmr.interface';
import {TransportOrder, TransportOrderStatus} from '../../src/interfaces/transportOrder.interface';
import {StatusCode} from './common/StatusCode';
import {Cancellation, EcmrCancellation, TransportOrderCancellation} from '../../src/interfaces/cancellation.interface';
import {Builder} from './common/Builder';
import {ExpectedWindow} from '../../src/interfaces/expectedWindow.interface';
import {DeliveryWindow} from '../../src/interfaces/deliveryWindow.interface';
import {PickupWindow} from '../../src/interfaces/pickupWindow.interface';
import {UpdateEcmrStatus} from '../../src/interfaces/updateEcmrStatus.interface';
import {Vehicle} from '../../src/interfaces/vehicle.interface';
import {Response} from 'superagent';
import {DateWindow} from '../../src/interfaces/dateWindow.interface';

const baseEndPoint = '/api/v1';
const server       = supertest.agent('http://localhost:8080');
const should       = chai.should();
let token: string;
let transportOrder: TransportOrder;
let updateEcmr: Ecmr;

describe('A Carrier member can', () => {
  before((done) => {
    transportOrder = Builder.buildTransportOrder();

    const loginParamsCarrierMember = {
      'username': 'harry@koopman.org',
      'password': 'passw0rd'
    };

    server
      .post(baseEndPoint + '/login')
      .send(loginParamsCarrierMember)
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

  it('get the ECMRs linked to a vin', (done) => {
    server
      .get(baseEndPoint + '/ECMR/vehicle/vin/183726339N')
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
      .get(baseEndPoint + '/ECMR/vehicle/plateNumber/AV198RX')
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
      .get(baseEndPoint + '/ECMR/ecmrID/A1234567890')
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

  it('not create an ECMR', (done) => {
    const ecmr = Builder.buildECMR('ecmr1');

    server
      .post(baseEndPoint + '/ECMR/')
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
      .get(baseEndPoint + '/ECMR')
      .set('x-access-token', token)
      .expect(StatusCode.ok)
      .end((err: Error, res: Response) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }

        res.body.length.should.be.greaterThan(0, 'No ECMRs for kooopman were found.');
        should.exist(res.body.find((ecmr: Ecmr) => ecmr.carrier === 'resource:org.digitalcmr.CarrierOrg#koopman'));

        done(err);
      });
  });

  it('not read an ECMR where his org is not the carrier', (done) => {
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

  it('not read an ECMR where the status is created', (done) => {
    server
      .get(baseEndPoint + '/ECMR/ecmrID/B1234567890')
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

  it('not submit an update transaction for an ECMR with status created', (done) => {
    const updateTransaction: UpdateEcmrStatus = {
      ecmrID:    'A1234567890',
      goods:     updateEcmr.goods,
      signature: Builder.buildSignature('harry@koopman.org')
    };

    server
      .put(baseEndPoint + '/ECMR/status/' + EcmrStatus.Loaded)
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
    const updateTransaction: UpdateEcmrStatus = {
      ecmrID:    'H1234567890',
      goods:     updateEcmr.goods,
      signature: Builder.buildSignature('harry@koopman.org')
    };

    server
      .put(baseEndPoint + '/ECMR/status/' + EcmrStatus.Loaded)
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
    const updateTransaction: UpdateEcmrStatus = {
      ecmrID:    updateEcmr.ecmrID,
      goods:     updateEcmr.goods,
      signature: Builder.buildSignature('harry@koopman.org')
    };

    server
      .put(baseEndPoint + '/ECMR/status/' + EcmrStatus.InTransit)
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
    const updateTransaction: UpdateEcmrStatus = {
      ecmrID:    updateEcmr.ecmrID,
      orderID:   updateEcmr.orderID,
      goods:     updateEcmr.goods,
      signature: Builder.buildSignature('harry@koopman.org')
    };

    server
      .put(baseEndPoint + '/ECMR/status/' + EcmrStatus.Delivered)
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
      .get(baseEndPoint + '/ECMR/status/' + EcmrStatus.Created)
      .set('x-access-token', token)
      .end((err: Error, res: Response) => {
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
      .get(baseEndPoint + '/ECMR/status/' + EcmrStatus.Loaded)
      .set('x-access-token', token)
      .end((err: Error, res: Response) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body.length.should.be.greaterThan(0, 'No LOADED ECMRs were found.');
        should.exist(res.body.find(ecmr => ecmr.status === EcmrStatus.Loaded));

        done(err);
      });
  });

  it('get ecmr by status IN_TRANSIT', (done) => {
    server
      .get(baseEndPoint + '/ECMR/status/' + EcmrStatus.InTransit)
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

  it('get ecmr by status DELIVERED', (done) => {
    server
      .get(baseEndPoint + '/ECMR/status/' + EcmrStatus.Delivered)
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

  it('get ecmr by status CONFIRMED_DELIVERED', (done) => {
    server
      .get(baseEndPoint + '/ECMR/status/' + EcmrStatus.ConfirmedDelivered)
      .set('x-access-token', token)
      .end((err: Error, res: Response) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body.length.should.be.greaterThan(0, 'No CONFIRMED_DELIVERED ECMRs were found.');
        should.exist(res.body.find((ecmr: Ecmr) => ecmr.status === EcmrStatus.ConfirmedDelivered));

        done(err);
      });
  });

  it('not be able to cancel an ECMR', (done) => {
    let cancel: EcmrCancellation = {
      ecmrID:       updateEcmr.ecmrID,
      cancellation: <Cancellation> {
        cancelledBy: 'harry@koopman.org',
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

  it('not get a specific TransportOrder based on ID', (done) => {
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

  it('get a specific TransportOrder when status is IN_PROGRESS', (done) => {
    server
      .get(baseEndPoint + '/transportOrder/status/' + TransportOrderStatus.InProgress)
      .set('x-access-token', token)
      .expect(StatusCode.ok)
      .expect('Content-Type', /json/)
      .end((err: Error, res: Response) => {
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
    const transportOrder = Builder.buildTransportOrder();

    server
      .post(baseEndPoint + '/transportOrder')
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

  it('get all vehicles', (done) => {
    server
      .get(baseEndPoint + '/vehicle')
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

  it('get a specific vehicle based on vin', (done) => {
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

  it('get a specific vehicle based on license plate', (done) => {
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

  it('not cancel a transportOrder', (done) => {
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
    const pickupWindow: PickupWindow = {
      orderID:    '12345567890',
      vin:        '183726339N',
      dateWindow: {
        startDate: 1010101010,
        endDate:   2020202020
      }
    };

    server
      .put(baseEndPoint + '/transportOrder/updatePickupWindow')
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
    const deliveryWindow: DeliveryWindow = {
      orderID:    '12345567890',
      vin:        '183726339N',
      dateWindow: {
        startDate: 1010101010,
        endDate:   2020202020
      }
    };

    server
      .put(baseEndPoint + '/transportOrder/updateDeliveryWindow')
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
    const expectedWindow: ExpectedWindow = {
      ecmrID:         'A1234567890',
      expectedWindow: <DateWindow> {
        startDate: 7247832478934,
        endDate:   212213821321
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
      ecmrID:         'A1234567890',
      expectedWindow: <DateWindow> {
        startDate: 7247832478934,
        endDate:   212213821321
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
