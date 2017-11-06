import * as supertest from 'supertest';
import '../../node_modules/mocha';
import * as chai from 'chai';
import * as http from 'http';

const server = supertest.agent('http://localhost:8080');
const should = chai.should();
let token: string;

const ok = (res) => {
  if (res.status !== 200) {
    const status = http.STATUS_CODES[res.status];
    return new Error(`Expected 200, got ${res.status} ${status} with message: ${res.body.message}`);
  }
};

const transportOrder = () => {
  return {
    'orderID':   Math.random().toString(36).substring(7),
    'loading':   {
      'actualDate': 1502834400000,
      'address':    {
        'name':        'loading address',
        'street':      'een straat',
        'houseNumber': '41',
        'city':        'Groningen',
        'zipCode':     '7811 HC',
        'country':     'netherlands',
        'longitude':   124,
        'latitude':    123
      }
    },
    'delivery':  {
      'actualDate': 1502834400000,
      'address':    {
        'name':        'delivery adress',
        'street':      'een straat',
        'houseNumber': '41',
        'city':        'Groningen',
        'zipCode':     '7811 HC',
        'country':     'netherlands',
        'longitude':   124,
        'latitude':    123
      }
    },
    'carrier':   'koopman',
    'source':    'amsterdamcompound',
    'goods':     [
      {
        '$class':            'org.digitalcmr.Good',
        'vehicle':           {
          '$class':          'org.digitalcmr.Vehicle',
          'vin':             '183726339N',
          'manufacturer':    'Audi',
          'model':           'A1',
          'type':            'sportback',
          'ecmrs':           [],
          'odoMeterReading': 0,
          'plateNumber':     'AV198RX'
        },
        'description':       'vehicle',
        'weight':            1500,
        'loadingStartDate':  1502834400000,
        'loadingEndDate':    1502834400000,
        'deliveryStartDate': 1502834400000,
        'deliveryEndDate':   1502834400000
      },
      {
        '$class':            'org.digitalcmr.Good',
        'vehicle':           {
          '$class':          'org.digitalcmr.Vehicle',
          'vin':             '736182CHD28172',
          'manufacturer':    'Mercedes',
          'model':           'SLK',
          'type':            'Station',
          'ecmrs':           [],
          'odoMeterReading': 0,
          'plateNumber':     'I827YE'
        },
        'description':       'vehicle',
        'weight':            1800,
        'loadingStartDate':  1502834400000,
        'loadingEndDate':    1502834400000,
        'deliveryStartDate': 1502834400000,
        'deliveryEndDate':   1502834400000
      }
    ],
    'status':    'OPEN',
    'issueDate': 1502834400000,
    'ecmrs':     [],
    'orderRef':  'ref',
    'owner':     'leaseplan'
  }
};

describe('An admin can', () => {

  it('can login a legal owner', (done) => {
    const loginParams = {
      'username': 'lapo@leaseplan.org',
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

  it('create a transport order', (done) => {
    server
      .post('/api/v1/transportOrder/')
      .set('x-access-token', token)
      .send(transportOrder())
      .expect(ok)
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

  it('Cant create a transport order for other legal owner org', (done) => {
    const to = transportOrder();
    to.owner = 'notLeaseplan';
    server
      .post('/api/v1/transportOrder/')
      .set('x-access-token', token)
      .send(to)
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
//
// it('get a legal owner by id', (done) => {
//   server
//     .get('/api/v1/legalowners/' + legalOwner.userID)
//     .set('legalOwnerID', legalOwner.userID)
//     .expect(ok)
//     .expect('Content-Type', /json/)
//     .end((err, res) => {
//       res.body.userID.should.be.equal(legalOwner.userID);
//       done(err);
//     });
// });
//
// it('update a legal owner by id', (done) => {
//   legalOwner.firstName = 'george';
//   server
//     .put('/api/v1/legalowners')
//     .send(legalOwner)
//     .expect(ok)
//     .expect('Content-Type', /json/)
//     .end((err: Error, res) => {
//       if (err) {
//         console.log(err.stack);
//         return done(err);
//       }
//       res.body.$Class.should.equal('org.digitalcmr.LegalOwner', 'No legalOwner returned');
//       res.body.userID.should.equal(legalOwner.userID);
//       res.body.firstName.should.equal('george');
//       done(err);
//     });
// });
//
// it('delete a legal owner by id', (done) => {
//   server
//     .delete('/api/v1/legalowners/' + legalOwner.userID)
//     .set('legalOwnerID', legalOwner.userID)
//     .expect(ok)
//     .expect('Content-Type', /json/)
//     .end((err: Error, res) => {
//       if (err) {
//         console.log(err.stack);
//         return done(err);
//       }
//       done(err);
//     });
// });

})
;

