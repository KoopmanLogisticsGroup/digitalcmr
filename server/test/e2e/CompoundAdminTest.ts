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

const buildECMR = (ecmrID: string) => {
  return {
    'ecmrID':                 ecmrID,
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
    'payOnDelivery':          'string',
    'compoundSignature':      {
      'certificate': 'willem@amsterdamcompound.org',
      'timestamp':   0
    }
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


describe('An Compound Admin can', () => {

  it('can login a legal owner', (done) => {
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

  it('can not create an transport order', (done) => {
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

  it('can read ECMRs where his org is the source', (done) => {
    server
      .get('/api/v1/ECMR')
      .set('x-access-token', token)
      .expect(ok)
      .end((err: Error, res) => {
        if (err) {
          console.log(err.stack);
        }
        res.body.length.should.be.greaterThan(0, 'no eCMRs were found.');
        done(err);
      });
  });

  it('can not create an ECMR', (done) => {
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

  it('Can not update an ECMR when his org and status is IN_TRANSIT', (done) => {
    const updateEcmr  = buildECMR('ecmr1');
    updateEcmr.status = 'IN_TRANSIT';
    server
      .put('/api/v1/ECMR')
      .set('x-access-token', token)
      .send(updateEcmr)
      .expect(500)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack)
        }
        done(err);
      })
  });

  it('Can not update an ECMR when his org is not the source', (done) => {
    const updateEcmr  = buildECMR('ecmr1');
    updateEcmr.source = 'notAmsterdamCompound';
    server
      .put('/api/v1/ECMR')
      .set('x-access-token', token)
      .send(updateEcmr)
      .expect(500)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack)
        }
        done(err);
      })
  });

  it('Can update an ECMR when his org and status is LOADED ', (done) => {
    const updateEcmr  = buildECMR('ecmr1');
    updateEcmr.status = 'LOADED';

    server
      .put('/api/v1/ECMR')
      .set('x-access-token', token)
      .send(updateEcmr)
      .expect(ok)
      .end((err: Error) => {
        if (err) {
          console.log(err.stack)
        }
        done(err);
      })
  });
});
