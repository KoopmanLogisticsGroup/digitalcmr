import 'mocha';
import 'reflect-metadata';
import * as chai from 'chai';
import {ApiFactory} from '../src/utils';
import {SampleAssetApi} from '../src/sdk/api';
import {LoggerFactory} from '../src/utils/logger/LoggerFactory';

chai.should();

describe('The API factory', () => {
  it('creates an API', (done) => {
    const factory = new ApiFactory('http://example.com');
    const api     = factory.get(SampleAssetApi);
    api.sampleAssetFind.should.be.an.instanceof(Function);
    api.basePath.should.equal('http://example.com', 'BasePath not propagated to api.');
    done();
  });
});

describe('The Logger factory', () => {
  before((done) => {
    const factory = new LoggerFactory();
    const logger  = factory.get('test');
    logger.info.should.be.a('function');
    logger.toString = () => 'hi from test';
    done();
  });

  it('reuses an existing logger', (done) => {
    const factory = new LoggerFactory();
    const logger  = factory.get('test');
    logger.info.should.be.a('function');
    logger.toString().should.equal('hi from test');
    done();
  });
});
