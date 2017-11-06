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

const buildECMR = () => {
  return {
    'ecmrID':                 Math.random().toString(36).substring(7),
    'status':                 'CREATED',
    'agreementTerms':         'agreement terms',
    'agreementTermsSec':      'sec agreement terms',
    'legalOwnerRef':          'ASD213123S',
    'carrierRef':             'H2238723VASD',
    'recipientRef':           'SDADHGA21312312',
    'orderID':                'ASDASDA123123',
    'creation':               {
      'address': {
        'name':        'Amsterdam Compound',
        'street':      'compenstraat',
        'houseNumber': '21',
        'city':        'Assen',
        'zipCode':     '9976ZH',
        'country':     'Netherlands',
        'latitude':    43.1927,
        'longitude':   23.3249
      },
      'date':    1502402400000
    },
    'loading':                {
      'address':    {
        'name':        'Amsterdam Compound',
        'street':      'compenstraat',
        'houseNumber': '21',
        'city':        'Amsterdam Zuid',
        'zipCode':     '9976ZH',
        'country':     'Netherlands',
        'latitude':    43.1927,
        'longitude':   23.3249
      },
      'actualDate': 1502402400000
    },
    'delivery':               {
      'address':    {
        'name':        'Rob Carman',
        'street':      'autostraat',
        'houseNumber': '12',
        'city':        'Rotterdam',
        'zipCode':     '9442KO',
        'country':     'Netherlands',
        'latitude':    51.4443,
        'longitude':   60.3323
      },
      'actualDate': 1502488800000
    },
    'owner':                  'leaseplan',
    'source':                 'amsterdamcompound',
    'transporter':            'harry@koopman.org',
    'carrier':                'koopman',
    'recipientOrg':           'cardealer',
    'recipient':              'rob@cardealer.org',
    'issueDate':              0,
    'issuedBy':               'koopman',
    'carrierComments':        'No comments',
    'documents':              [
      'doc1'
    ],
    'goods':                  [
      {
        'vehicle':           {
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
        'vehicle':           {
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
    'legalOwnerInstructions': 'string',
    'paymentInstructions':    'string',
    'payOnDelivery':          'string'
  }
};

const buildTransportOrder = () => {
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
      .send(buildTransportOrder())
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

  it('Can not create a transport order for other legal owner org', (done) => {
    const wrongTransportOrder = buildTransportOrder();
    wrongTransportOrder.owner = 'notLeaseplan';
    server
      .post('/api/v1/transportOrder/')
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

  it('can create an eCMR when he is the owner', (done) => {
    const ecmr = buildECMR();
    server
      .post('/api/v1/ECMR')
      .set('x-access-token', token)
      .send(ecmr)
      .expect('Content-Type', /json/)
      .expect(ok)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack);
          return done(err);
        }
        done(err);
      });
  });

  it('can not create an eCMR when he is not the owner', (done) => {
    const ecmr = buildECMR();
    ecmr.owner = 'notLeaseplan';
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

  it('can read all ECMRs by his organisation', (done) => {
    server
      .get('/api/v1/ECMR')
      .set('x-access-token', token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);
          return done(err);
        }
        res.body.length.should.be.greaterThan(0, 'No eCMRs found');
        done(err);
      })
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

