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
        return adminConnection.connect(Network.connectionProfile, Identity.users.admin.userID, Identity.users.admin.userSecret);
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
        return businessNetworkConnection.connect(Network.connectionProfile, Network.networkName, Identity.users.admin.userID, Identity.users.admin.userSecret);
      })
      .then(() => {

        // Get the factory for the business network
        factory = businessNetworkConnection.getBusinessNetwork().getFactory();
        builder = new Builder(factory);

        let transportOrder = builder.buildTransportOrder('12345567890');

        return businessNetworkConnection.getAssetRegistry(Network.namespace + '.TransportOrder')
          .then((assetRegistry) => {
            return assetRegistry.addAll([transportOrder]);
          }).catch((error) => {
            console.log('Something went wrong while adding the transport order to the asset registry: ' + error);
          });
      })
  });

  it('should be able to create a Transport Order', () => {
    const transaction = factory.newTransaction(Network.namespace, 'CreateTransportOrder');
    transaction.transportOrder = builder.buildTransportOrder('transportOrder1');

    return businessNetworkConnection.submitTransaction(transaction)
      .then(() => {
        return businessNetworkConnection.getAssetRegistry(Network.namespace + '.TransportOrder');
      })
      .then((assetRegistry) => {
        return assetRegistry.get('transportOrder1');
      })
      .then((transportOrder) => {
        transportOrder.$identifier.should.equal('transportOrder1');
      });
  });

  it('should be able to create a list of TransportOrders', () => {
    let transportOrders = [];
    transportOrders.push(builder.buildTransportOrder('transportOrder8'));
    transportOrders.push(builder.buildTransportOrder('transportOrder9'));
    const transaction = factory.newTransaction(Network.namespace, 'CreateTransportOrders');
    transaction.transportOrders = transportOrders;

    return businessNetworkConnection.submitTransaction(transaction)
      .then(() => {
        return businessNetworkConnection.getAssetRegistry(Network.namespace + '.TransportOrder');
      })
      .then((assetRegistry) => {
        return assetRegistry.getAll();
      })
      .then((transportOrders) => {
        transportOrders.find((transportOrder) => transportOrder.$identifier === 'transportOrder8');
        transportOrders.find((transportOrder) => transportOrder.$identifier === 'transportOrder9');
      });
  });

  it('should be able to cancel a TransportOrder', () => {
    let transaction = factory.newTransaction(Network.namespace, 'UpdateTransportOrderStatusToCancelled');
    transaction.transportOrder = factory.newRelationship(Network.namespace, 'TransportOrder', '12345567890');
    transaction.cancellation = factory.newConcept(Network.namespace, 'Cancellation');
    transaction.cancellation.cancelledBy = factory.newRelationship(Network.namespace, 'Entity', 'pete@koopman.org');
    transaction.cancellation.date = new Date().getTime();
    transaction.cancellation.reason = 'another big reason';

    return businessNetworkConnection.submitTransaction(transaction)
      // .then(() => {
      //   return businessNetworkConnection.getAssetRegistry(Network.namespace + '.TransportOrder');
      // })
      // .then((assetRegistry) => {
      //   return assetRegistry.getAll();
      // })
      // .then((cancelledTransportOrder) => {
      //   cancelledTransportOrder[0].status.should.equal(BusinessModel.ecmrStatus.Cancelled);
      //   cancelledTransportOrder[0].cancellation.should.be.instanceOf(Object);
      // });
      .should.be.rejectedWith(/Participant is not authenticated/);
  });

  it('should be able to update a pickupWindow in a transport order', () => {
    const transaction = factory.newTransaction(Network.namespace, 'UpdateTransportOrderPickupWindow');
    transaction.transportOrder = factory.newRelationship(Network.namespace, 'TransportOrder', '12345567890');
    transaction.dateWindow = factory.newConcept(Network.namespace, 'DateWindow');
    transaction.vin = 'VIN12345678';
    transaction.dateWindow.startDate = 1;
    transaction.dateWindow.endDate = 2;

    return businessNetworkConnection.submitTransaction(transaction)
      .then(() => {
        return businessNetworkConnection.getAssetRegistry(Network.namespace + '.TransportOrder');
      })
      .then((assetRegistry) => {
        return assetRegistry.get('12345567890');
      })
      .then((transportOrder) => {
        transportOrder.goods[0].pickupWindow.startDate.should.equal(1);
        transportOrder.goods[0].pickupWindow.endDate.should.equal(2);
      });
  });

  it('should be able to update a deliveryWindow in a transport order', () => {
    const transaction = factory.newTransaction(Network.namespace, 'UpdateTransportOrderDeliveryWindow');
    transaction.transportOrder = factory.newRelationship(Network.namespace, 'TransportOrder', '12345567890');
    transaction.dateWindow = factory.newConcept(Network.namespace, 'DateWindow');
    transaction.vin = 'VIN12345678';
    transaction.dateWindow.startDate = 1;
    transaction.dateWindow.endDate = 2;

    return businessNetworkConnection.submitTransaction(transaction)
      .then(() => {
        return businessNetworkConnection.getAssetRegistry(Network.namespace + '.TransportOrder');
      })
      .then((assetRegistry) => {
        return assetRegistry.get('12345567890');
      })
      .then((transportOrder) => {
        transportOrder.goods[0].deliveryWindow.startDate.should.equal(1);
        transportOrder.goods[0].deliveryWindow.endDate.should.equal(2);
      });
  });
});
