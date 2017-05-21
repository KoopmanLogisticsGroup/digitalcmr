import * as supertest from 'supertest';
import 'mocha';
import * as chai from 'chai';
import * as http from 'http';
import {SampleAsset} from '../../src/sdk/api';

const server = supertest.agent('http://localhost:8080');
chai.should();

const ok = (res) => {
    if (res.status !== 200) {
        const status = http.STATUS_CODES[res.status];
        return new Error(`Expected 200, got ${res.status} ${status} with message: ${res.body.message}`);
    }
};

describe('the running server', () => {
    describe('creating a sampleasset', () => {
        before((done) => {
            let sampleAsset: any = {}; // Any so we don't have to set $class
            sampleAsset.assetId = new Date().getTime().toString();
            sampleAsset.owner = 'myOwner';
            sampleAsset.value = '1000';

            server
                .post('/api/v1/sampleassets')
                .send(sampleAsset)
                .expect(ok)
                .expect('Content-Type', /json/)
                .end((err: Error, res) => {
                    if (err) {
                        console.log(err.stack);
                        return done(err);
                    }
                    res.body.$class.should.equal('org.acme.sample.SampleAsset', 'No sampleAsset returned');
                    res.body.assetId.should.equal(sampleAsset.assetId);
                    done(err);
                });
        });

        it('gets all sampleassets', (done) => {
            server
                .get('/api/v1/sampleassets')
                .expect(ok)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    res.body.length.should.be.greaterThan(0, 'No sampleassets found');
                    done(err);
                });
        });
    });
});