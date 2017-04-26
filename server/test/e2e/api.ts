import * as supertest from 'supertest';
import 'mocha';
import * as chai from 'chai';
import * as http from 'http';

const server = supertest.agent('http://localhost:8080');
chai.should();

const ok = (res) => {
    if (res.status !== 200) {
        const status = http.STATUS_CODES[res.status];
        return new Error(`Expected 200, got ${res.status} ${status} with message: ${res.body.message}`);
    }
};

describe('the running server', () => {
    describe('creating a landtitle', () => {
        before((done) => {
            let title: any = {};
            title.forSale = true;
            title.information = 'info';
            title.owner = 'me';
            title.titleId = new Date().getTime().toString();

            server
                .post('/api/v1/landtitles')
                .send(title)
                .expect(ok)
                .expect('Content-Type', /json/)
                .end((err: Error, res) => {
                    if (err) {
                        console.log(err.stack);
                        return done(err);
                    }
                    res.body.$class.should.equal('net.biz.digitalPropertyNetwork.LandTitle', 'No landTitle returned');
                    res.body.titleId.should.equal(title.titleId);
                    done(err);
                });
        });

        it('gets all landtitles', (done) => {
            server
                .get('/api/v1/landtitles')
                .expect(ok)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    res.body.length.should.be.greaterThan(0, 'No landtitles found');
                    done(err);
                });
        });
    });
});