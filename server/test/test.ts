import 'mocha';
import 'reflect-metadata';
import * as chai from 'chai';
import {ApiFactory} from '../src/utils';
import {SampleAssetApi} from '../src/sdk/api';
chai.should();

describe('The API factory', () => {
   it('creates an API', (done) => {
      const factory = new ApiFactory('http://example.com');
      const api = factory.get(SampleAssetApi);
      api.sampleAssetFind.should.be.an.instanceof(Function);
      api.basePath.should.equal('http://example.com', 'BasePath not propagated to api.');
      done();
    });
});
