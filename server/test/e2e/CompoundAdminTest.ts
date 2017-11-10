import * as supertest from 'supertest';
import '../../node_modules/mocha';
import * as chai from 'chai';
import * as http from 'http';
import {TransportOrder} from '../../resources/interfaces/transportOrder.interface';
import {Ecmr} from '../../resources/interfaces/ecmr.interface';

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
  };
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
  };
};

describe('A Compound Admin can', () => {
  it('login as a compound admin', (done) => {
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
        res.body[0].ecmrID.should.be.equal('A1234567890');
        res.body[1].ecmrID.should.be.equal('B1234567890');
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
      .expect('Content-Type', /json/)
      .expect(500)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);
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
          res.body[0].status.should.equal('CREATED');
        } else if (res.body instanceof Object) {
          res.body.status.should.equal('LOADED');
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
            res.body[0].status.should.equal('LOADED');
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
            res.body[0].status.should.equal('IN_TRANSIT');
          } else if (res.body instanceof Object) {
            res.body.status.should.equal('LOADED');
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
          res.body[0].status.should.equal('DELIVERED');
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
          res.body[0].should.equal('CONFIRMED_DELIVERED');
        } else if (res.body instanceof Object) {
          res.body.status.should.equal('CONFIRMED_DELIVERED');
        } else {
          res.body.should.equal(200);
        }
        done(err);
      });
  });

  it('submit an update status from CREATED to LOADED', (done) => {
    updateEcmr.status            = 'LOADED';
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
        }
        done(err);
      });
  });

  it('not update an ECMR for his org and status is IN_TRANSIT', (done) => {
    updateEcmr.status = 'IN_TRANSIT';
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
          //res.body.length.should.be.greaterThan(0, 'No CONFIRMED_DELIVERED ECMRs were found.');
          should.exist(res.body[0].plateNumber);
        } else if (res.body instanceof Object) {
          should.exist(res.body.plateNumber);
        } else {
          res.body.should.equal(200);
        }
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
        }
        done(err);
      });
  });
});
