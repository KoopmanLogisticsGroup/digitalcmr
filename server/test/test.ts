import 'mocha';
import * as chai from 'chai';
import {ApiFactory} from '../src/utils/ApiFactory';
import {Net_biz_digitalPropertyNetwork_LandTitleApi} from '../src/sdk/api';

const should = chai.should();

describe('The API factory', function() {
   it('should have a salt', () => {
      const factory = new ApiFactory('');
      const api = factory.get(Net_biz_digitalPropertyNetwork_LandTitleApi);
    });
});
