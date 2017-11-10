import * as supertest from 'supertest';
import 'mocha';
import * as chai from 'chai';
import * as http from 'http';

const server = supertest.agent('http://localhost:8080');
const should = chai.should();

const path = '/api/v1/login';

const ok = (res) => {
  if (res.status !== 200) {
    const status = http.STATUS_CODES[res.status];

    return new Error(`Expected 200, got ${res.status} ${status} with message: ${res.body.message}`);
  }
};

describe('An AuthController', () => {
  it('can login a compound admin', (done) => {
    const loginParams = {
      'username': 'willem@amsterdamcompound.org',
      'password': 'passw0rd'
    };

    server
      .post(path)
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
        done(err);
      });
  });
});
