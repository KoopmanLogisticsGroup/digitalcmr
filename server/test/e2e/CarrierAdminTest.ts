import * as supertest from 'supertest';
import '../../node_modules/mocha';
import * as chai from 'chai';
import * as http from 'http';
import {Ecmr} from '../../../client/src/app/interfaces/ecmr.interface';
import {TransportOrder} from '../../resources/interfaces/transportOrder.interface';
import {Address} from '../../resources/interfaces/address.interface';

const server = supertest.agent('http://localhost:8080');
const should = chai.should();
let token: string;
let updateEcmr: Ecmr;

/**
 * Build Address asset
 * @return {Promise} A promise that will be resolved when completed.
 */
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
    status:                 'CREATED',
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
    orderID:   String(new Date()),
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

const ok = (res) => {
  if (res.status !== 200) {
    const status = http.STATUS_CODES[res.status];
    return new Error(`Expected 200, got ${res.status} ${status} with message: ${res.body.message}`);
  }
};

describe('A Carrier admin can', () => {
  before((done) => {
    const loginParams = {
      'username': 'goslin@koopman.org',
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

  it('read ECMRs where his org is the transporter and status is not created', (done) => {
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
          res.body.length.should.be.greaterThan(0, 'No ECMRs were found for carrier org');
          should.exist(res.body.find(ecmr => ecmr.carrier === 'resource:org.digitalcmr.CarrierOrg#koopman'));
        } else if (res.body instanceof Object) {
          res.body.carrier.should.equal('resource:org.digitalcmr.CarrierOrg#koopman');
        } else {
          res.body.should.equal(200);
        }
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
        res.body.should.equal(200);
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

  it('not submit an update status from LOADED to IN_TRANSIT', (done) => {
    updateEcmr.status = 'IN_TRANSIT';
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

  it('not submit an update status from IN_TRANSIT to DELIVERED', (done) => {
    updateEcmr.status = 'DELIVERED';
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
          done(err);
        }
        if (res.body instanceof Array) {
          res.body.length.should.be.greaterThan(0, 'No CREATED ECMRs were found.');
          should.exist(res.body.find(ecmr => ecmr.status === 'CREATED'));
        } else if (res.body instanceof Object) {
          res.body.status.should.equal('CREATED');
        } else {
          res.body.should.equal(200);
        }
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
            done(err);
          }
          if (res.body instanceof Array) {
            res.body.length.should.be.greaterThan(0, 'No LOADED ECMRs were found.');
            should.exist(res.body.find(ecmr => ecmr.status === 'LOADED'));
          } else if (res.body instanceof Object) {
            res.body.status.should.equal('LOADED');
          } else {
            res.body.should.equal(200);
          }
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
            done(err);
          }
          if (res.body instanceof Array) {
            res.body.length.should.be.greaterThan(0, 'No IN_TRANSIT ECMRs were found.');
            should.exist(res.body.find(ecmr => ecmr.status === 'IN_TRANSIT'));
          } else if (res.body instanceof Object) {
            res.body.status.should.equal('IN_TRANSIT');
          } else {
            res.body.should.equal(200);
          }
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
          done(err);
        }
        if (res.body instanceof Array) {
          res.body.length.should.be.greaterThan(0, 'No DELIVERED ECMRs were found.');
          should.exist(res.body.find(ecmr => ecmr.status === 'DELIVERED'));
        } else if (res.body instanceof Object) {
          console.log(res.body);
          res.body.status.should.equal('DELIVERED');
        } else {
          res.body.should.equal(200);
        }
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
          done(err);
        }
        if (res.body instanceof Array) {
          res.body.length.should.be.greaterThan(0, 'No CONFIRMED_DELIVERED ECMRs were found.');
          should.exist(res.body.find(ecmr => ecmr.status === 'CONFIRMED_DELIVERED'));
        } else if (res.body instanceof Object) {
          res.body.status.should.equal('CONFIRMED_DELIVERED');
        } else {
          res.body.should.equal(200);
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
          done(err);
        }
        if (res.body instanceof Array) {
          should.exist(res.body[0].plateNumber);
        } else if (res.body instanceof Object) {
          should.exist(res.body.plateNumber);
        } else {
          res.body.should.equal(200);
        }
        done(err);
      });
  });

  it('get a specific vehicle', (done) => {
    server
      .get('/api/v1/vehicle/vin/183726339N')
      .set('x-access-token', token)
      .expect(ok)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);
          done(err);
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
          done(err);
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
});
