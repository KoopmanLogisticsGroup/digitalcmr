import * as supertest from 'supertest';
import '../../node_modules/mocha';
import * as chai from 'chai';
import {Ecmr} from '../../src/interfaces/ecmr.interface';
import {TransportOrder, TransportOrderStatus} from '../../src/interfaces/transportOrder.interface';
import {EcmrStatus} from '../../src/interfaces/ecmr.interface';
import {StatusCode} from './common/StatusCode';
import {Builder} from './common/Builder';
import {EcmrCancellation, TransportOrderCancellation} from '../../src/interfaces/cancellation.interface';
import {CreateEcmrs} from '../../src/interfaces/createEcmrs.interface';
import {UpdateEcmrStatus} from '../../src/interfaces/updateEcmrStatus.interface';
import {PickupWindow} from '../../src/interfaces/pickupWindow.interface';
import {DeliveryWindow} from '../../src/interfaces/deliveryWindow.interface';
import {ExpectedWindow} from '../../src/interfaces/expectedWindow.interface';
import {DateWindow} from '../../../client/src/app/interfaces/dateWindow.interface';

const baseEndPoint = '/api/v1';
const server       = supertest.agent('http://localhost:8080');
const should       = chai.should();
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
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        should.exist(res.body.find(ecmr => ecmr.ecmrID === 'C1234567890'));

        done(err);
      });
  });

  it('get the ECMRs linked to a plate number', (done) => {
    server
      .get(`${baseEndPoint}/ECMR/vehicle/plateNumber/AV198RX`)
      .set('x-access-token', token)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        should.exist(res.body.find(ecmr => ecmr.ecmrID === 'C1234567890'));

        done(err);
      });
  });

  it('get a specific ECMR by ecmrID', (done) => {
    server
      .get(`${baseEndPoint}/ECMR/ecmrID/A1234567890`)
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
      .get(`${baseEndPoint}/ECMR`)
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
      .get(baseEndPoint + '/ECMR/ecmrID/H1234567890')
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
    let ecmrList: Ecmr[] = [Builder.buildECMR('ecmr1')];

    const ecmrs: CreateEcmrs = {
      orderID: '12345567890',
      ecmrs:   ecmrList
    };

    server
      .post(baseEndPoint + '/ECMR/createECMRs')
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
    let cancel: EcmrCancellation = {
      ecmrID:       'ecmr1',
      cancellation: {
        cancelledBy: 'pete@koopman.org',
        reason:      'no reason',
        date:        123
      }
    };

    server
      .put(baseEndPoint + '/ECMR/cancel')
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
    const updateTransaction: UpdateEcmrStatus = {
      ecmrID:    updateEcmr.ecmrID,
      goods:     updateEcmr.goods,
      signature: Builder.buildSignature('harry@koopman.org')
    };

    server
      .put(baseEndPoint + '/ECMR/status/' + EcmrStatus.InTransit)
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
      .get(baseEndPoint + '/ECMR/status/' + EcmrStatus.Created)
      .set('x-access-token', token)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        res.body.length.should.be.greaterThan(0, 'No CREATED ECMRs were found.');
        should.exist(res.body.find((ecmr: Ecmr) => ecmr.status === EcmrStatus.Created));

        done(err);
      });
  });

  it('get ecmr by status LOADED', (done) => {
    server
      .get(baseEndPoint + '/ECMR/status/' + EcmrStatus.Loaded)
      .set('x-access-token', token)
      .end((err: Error, res) => {
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

  it('get ecmr by status IN_TRANSIT', (done) => {
    server
      .get(baseEndPoint + '/ECMR/status/' + EcmrStatus.InTransit)
      .set('x-access-token', token)
      .end((err: Error, res) => {
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
      .end((err: Error, res) => {
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

  it('get all vehicles', (done) => {
    server
      .get(baseEndPoint + '/vehicle')
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
      .get(baseEndPoint + '/vehicle/vin/183726339N')
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
      .get(baseEndPoint + '/vehicle/plateNumber/AV198RX')
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

  it('get a TransportOrder', (done) => {
    server
      .get(baseEndPoint + '/transportOrder')
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
      .get(baseEndPoint + '/transportOrder/orderID/12345567890')
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
      .get(baseEndPoint + '/transportOrder/status/' + TransportOrderStatus.InProgress)
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

  it('get a specific TransportOrder based on vin', (done) => {
    server
      .get(baseEndPoint + '/transportOrder/vin/183726339N')
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
      dateWindow: <DateWindow> {
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

  it('update an expectedPickupWindow of an ECMR', (done) => {
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
    const expectedWindow: ExpectedWindow = {
      ecmrID:         'E1234567890',
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

  it(' update an expectedDeliveryWindow of an ECMR with status IN_TRANSIT', (done) => {
    const expectedWindow: ExpectedWindow = {
      ecmrID:         'E1234567890',
      expectedWindow: <DateWindow> {
        startDate: 7247832478934,
        endDate:   212213821321
      }
    };

    server
      .put(baseEndPoint + '/ECMR/updateExpectedDeliveryWindow')
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
