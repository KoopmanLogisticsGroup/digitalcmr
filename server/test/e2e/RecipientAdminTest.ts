import * as supertest from 'supertest';
import '../../node_modules/mocha';
import * as chai from 'chai';
import * as http from 'http';
import {TransportOrder, TransportOrderStatus} from '../../src/interfaces/transportOrder.interface';
import {Ecmr, EcmrStatus} from '../../src/interfaces/ecmr.interface';
import {Address} from '../../src/interfaces/address.interface';
import {Builder} from './common/Builder';
import {ExpectedWindow} from '../../src/interfaces/expectedWindow.interface';
import {DeliveryWindow} from '../../src/interfaces/deliveryWindow.interface';
import {PickupWindow} from '../../src/interfaces/pickupWindow.interface';
import {DateWindow} from '../../src/interfaces/dateWindow.interface';
import {UpdateEcmrStatus} from '../../src/interfaces/updateEcmrStatus.interface';

const server       = supertest.agent('http://localhost:8080');
const baseEndPoint = '/api/v1';
const should       = chai.should();
let token: string;
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
  return <Ecmr> {
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
    recipient:              'cardealer',
    recipientMember:        'rob@cardealer.org',
    issuedBy:               'koopman',
    carrierComments:        'No comments',
    documents:              [
      'doc1'
    ],
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

describe('A Recipient Admin can', () => {
  before((done) => {
    const loginParams = {
      'username': 'clara@cardealer.org',
      'password': 'passw0rd'
    };

    server
      .post(baseEndPoint + '/login')
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

  it('read ECMRs when his org is the recipient', (done) => {
    server
      .get(baseEndPoint + '/ECMR')
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

  it('not read an ECMR where his org is not the recipient', (done) => {
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

  it('get all ECMRs containing a vehicle with the provided vin', (done) => {
    server
      .get(baseEndPoint + '/ECMR/vehicle/vin/183726339N')
      .set('x-access-token', token)
      .expect(ok)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        should.exist(res.body.find(ecmr => ecmr.ecmrID === 'C1234567890'));

        done(err);
      });
  });

  it('get all ECMRs containing a vehicle with the plate number', (done) => {
    server
      .get(baseEndPoint + '/ECMR/vehicle/plateNumber/AV198RX')
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

  it('get an ECMR by ecmrID', (done) => {
    server
      .get(baseEndPoint + '/ECMR/ecmrID/D1234567890')
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

  it('get an ECMR by status', (done) => {
    server
      .get(baseEndPoint + '/ECMR/status/' + EcmrStatus.Delivered)
      .set('x-access-token', token)
      .expect(ok)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);

          return done(err);
        }
        should.exist(res.body.find(ecmr => ecmr.status === 'DELIVERED'));

        done(err);
      });
  });

  it('not update an ECMR from DELIVERED to CONFIRMED_DELIVERED', (done) => {
    const updateTransaction: UpdateEcmrStatus = {
      ecmrID:    'A1234567890',
      goods:     updateEcmr.goods,
      signature: Builder.buildSignature('rob@cardealer.org')
    };

    server
      .put(baseEndPoint + '/ECMR/status/' + EcmrStatus.ConfirmedDelivered)
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

  it('get all vehicles', (done) => {
    server
      .get(baseEndPoint + '/vehicle/')
      .set('x-access-token', token)
      .expect(ok)
      .end((err: Error, res) => {
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

  it('get vehicle by plateNumber', (done) => {
    server
      .get(baseEndPoint + '/vehicle/plateNumber/AV198RX')
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

  it('not get a specific TransportOrder based on ID', (done) => {
    server
      .get(baseEndPoint + '/transportOrder/orderID/12345567890')
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

  it('not get a specific TransportOrder based on status', (done) => {
    server
      .get(baseEndPoint + '/transportOrder/status/' + TransportOrderStatus.InProgress)
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

  it('not create a TransportOrder', (done) => {
    const transportOrder = buildTransportOrder();
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

  it('not update an estimatedPickupWindow of a TransportOrder', (done) => {
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

  it('can not update an expectedPickupWindow of an ECMR', (done) => {
    const expectedWindow: ExpectedWindow = {
      ecmrID:         'B1234567890',
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
      ecmrID:         'A1234567890',
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
