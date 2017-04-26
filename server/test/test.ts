import 'mocha';
import 'reflect-metadata';
import * as chai from 'chai';
import {ApiFactory} from '../src/utils';
import {Net_biz_digitalPropertyNetwork_LandTitleApi} from '../src/sdk/api';
chai.should();

describe('The API factory', () => {
   it('creates a land title API', (done) => {
      const factory = new ApiFactory('http://example.com');
      const api = factory.get(Net_biz_digitalPropertyNetwork_LandTitleApi);
      api.netBizDigitalPropertyNetworkLandTitleFind.should.be.an.instanceof(Function);
      api.basePath.should.equal('http://example.com', 'BasePath not propagated to api.');
      done();
    });
});
