/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
const AdminConnection = require('composer-admin').AdminConnection;
const BrowserFS = require('browserfs/dist/node/index');
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const BusinessNetworkDefinition = require('composer-common').BusinessNetworkDefinition;
const path = require('path');
const chai = require('chai');
chai.should();
chai.use(require('chai-as-promised'));
const bfs_fs = BrowserFS.BFSRequire('fs');
const BusinessModel = require('./common/businessModel');
let Builder = require('./common/builder');
let Network = require('./common/network');
let Identity = require('./common/identityManager');

describe('As admin of the network, ', () => {
  // This is the business network connection the tests will use.
  let businessNetworkConnection;
  // This is the factory for creating instances of types.
  let factory;
  // These are a list of received events.
  let events;

  let builder;
  Network = new Network();
  Identity = new Identity();

  // This is called before all tests are executed
  beforeEach(() => {
    // Initialize an in-memory file system, so we do not write any files to the actual file system
    BrowserFS.initialize(new BrowserFS.FileSystem.InMemory());
    // Create a new admin connection.
    const adminConnection = new AdminConnection({fs: bfs_fs});

    // Create a new connection profile that uses the embedded (in-memory) runtime
    return adminConnection.createProfile(Network.connectionProfile, {type: 'embedded'})
      .then(() => {
        // Establish an admin connection. The user ID must be admin. The user secret is
        // ignored, but only when the tests are executed using the embedded (in-memory)
        // runtime.
        return adminConnection.connect(Network.connectionProfile, Identity.userIDs.admin, 'randomString');
      })
      .then(() => {
        // Generate a business network definition from the project directory.
        return BusinessNetworkDefinition.fromDirectory(path.resolve(__dirname, '..'));
      })
      .then((businessNetworkDefinition) => {
        // Deploy and start the business network defined by the business network definition
        return adminConnection.deploy(businessNetworkDefinition);
      })
      .then(() => {
        // Create and establish a business network connection
        businessNetworkConnection = new BusinessNetworkConnection({fs: bfs_fs});
        events = [];
        businessNetworkConnection.on('event', (event) => {
          events.push(event);
        });
        return businessNetworkConnection.connect(Network.connectionProfile, Network.networkName, Identity.userIDs.admin, 'randomString');
      })
      .then(() => {

        // Get the factory for the business network
        factory = businessNetworkConnection.getBusinessNetwork().getFactory();
        builder = new Builder(factory);
      })
      // adding initial ecmrs for tests
      .then(() => {
        return businessNetworkConnection.getAssetRegistry('org.digitalcmr.Vehicle')
          .then(assetRegistry => {
            const vehicle100 = builder.buildVehicle('vehicle100');
            return assetRegistry.addAll([vehicle100]);
          });
      })
  });

  it('should be able to create a Vehicle', () => {
    let vehicles = [builder.buildVehicle('vehicle3')];
    const transaction = factory.newTransaction('org.digitalcmr', 'CreateVehicles');
    transaction.vehicles = vehicles;

    return businessNetworkConnection.submitTransaction(transaction)
      .then(() => {
        return businessNetworkConnection.getAssetRegistry('org.digitalcmr.Vehicle');
      })
      .then((assetRegistry) => {
        return assetRegistry.get('vehicle3');
      })
      .then((vehicle) => {
        console.log(vehicle);
        vehicle.$identifier.should.equal('vehicle3');
      });
  });

  it('should be able to create a list of vehicles', () => {
    let vehicles = [builder.buildVehicle('vehicle5'), builder.buildVehicle('vehicle6')];
    const transaction = factory.newTransaction('org.digitalcmr', 'CreateVehicles');
    transaction.vehicles = vehicles;
    return businessNetworkConnection.submitTransaction(transaction)
      .then(() => {
        return businessNetworkConnection.getAssetRegistry('org.digitalcmr.Vehicle');
      })
      .then((assetRegistry) => {
        return assetRegistry.getAll();
      })
      .then((vehicles) => {
        vehicles[1].$identifier.should.equal('vehicle5');
        vehicles[2].$identifier.should.equal('vehicle6');
      });
  });
});
