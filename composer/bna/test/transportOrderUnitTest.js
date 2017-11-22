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
const namespace = 'org.digitalcmr';
const networkName = 'digital-cmr-network';
const connectionProfile = 'defaultProfile';

describe('As admin of the network, ', () => {
  // This is the business network connection the tests will use.
  let businessNetworkConnection;
  // This is the factory for creating instances of types.
  let factory;
  // These are the identities.
  const adminIdentity = {'userID': 'admin', 'userSecret': 'adminpw'};
  // These are a list of received events.
  let events;

  /**
   * Build Address asset
   * @return {Promise} A promise that will be resolved when completed.
   */
  function buildAddress() {
    let address = factory.newConcept(namespace, 'Address');
    address.name = 'name';
    address.street = 'street';
    address.houseNumber = 'housenumber';
    address.city = 'city';
    address.zipCode = 'zipcode';
    address.country = 'country';
    address.longitude = 0;
    address.latitude = 0;

    return address;
  }

  /**
   * Build Vehicle asset
   * @param {String} vin The ID of the Vehicle to build
   * @return {Promise} A promise that will be resolved when completed.
   */
  function buildVehicle(vin) {
    let vehicle = factory.newResource(namespace, 'Vehicle', vin);
    vehicle.vin = '213123123123ASDSAD';
    vehicle.manufacturer = 'bmw';
    vehicle.model = 'xxx';
    vehicle.type = 'model-s';
    vehicle.odoMeterReading = 23;
    vehicle.plateNumber = 'URE-312-A';
    vehicle.ecmrs = [];

    return vehicle;
  }

  /**
   * Build Order asset
   * @param {String} ecmrID The ID of the ECMR to build
   * @return {Promise} A promise that will be resolved when completed.
   */
  function buildECMR(ecmrID) {
    let ecmr = factory.newResource(namespace, 'ECMR', ecmrID);
    ecmr.agreementTerms = 'agreement terms here';
    ecmr.agreementTermsSec = 'sec agreement terms here';
    ecmr.legalOwnerRef = 'leaseplan';
    ecmr.carrierRef = 'koopman';
    ecmr.recipientRef = 'cardealer';
    ecmr.issueDate = 0;
    ecmr.issuedBy = 'issued by';
    ecmr.recipientRef = '';
    ecmr.creation = factory.newConcept(namespace, 'Creation');
    ecmr.creation.address = buildAddress();
    ecmr.creation.date = 0;
    ecmr.loading = factory.newConcept(namespace, 'Loading');
    ecmr.loading.address = buildAddress();
    ecmr.loading.actualDate = 0;
    ecmr.delivery = factory.newConcept(namespace, 'Delivery');
    ecmr.delivery.address = buildAddress();
    ecmr.delivery.actualDate = 0;
    ecmr.owner = factory.newRelationship(namespace, 'LegalOwnerOrg', 'lapo@leaseplan.org');
    ecmr.source = factory.newRelationship(namespace, 'CompoundOrg', 'amsterdamcompound');
    ecmr.transporter = factory.newRelationship(namespace, 'CarrierMember', 'harry');
    ecmr.carrier = factory.newRelationship(namespace, 'CarrierOrg', 'koopman');
    ecmr.recipientOrg = factory.newRelationship(namespace, 'RecipientOrg', 'cardealer');
    ecmr.recipient = factory.newRelationship(namespace, 'RecipientMember', 'rob');
    ecmr.issuedBy = factory.newRelationship(namespace, 'Entity', 'leaseplan');
    ecmr.carrierComments = 'carrier comments here';
    ecmr.goods = [];
    ecmr.goods[0] = factory.newConcept(namespace, 'Good');
    ecmr.goods[0].description = 'Car 1';
    ecmr.goods[0].loadingStartDate = 0;
    ecmr.goods[0].loadingEndDate = 0;
    ecmr.goods[0].deliveryStartDate = 0;
    ecmr.goods[0].deliveryEndDate = 0;
    ecmr.orderID = 'order12345';
    ecmr.legalOwnerInstructions = 'instructions here';
    ecmr.paymentInstructions = 'instructions for payment';
    ecmr.payOnDelivery = 'ok ok';
    ecmr.status = 'CREATED';

    ecmr.goods[0].vehicle = buildVehicle('213123123123ASDSAD');

    return ecmr;
  }

  function buildTransportOrder(transportOrderID) {
    let transportOrder = factory.newResource(namespace, 'TransportOrder', transportOrderID);
    transportOrder.loading = factory.newConcept(namespace, 'Loading');
    transportOrder.loading.address = buildAddress();
    transportOrder.loading.actualDate = 0;
    transportOrder.delivery = factory.newConcept(namespace, 'Delivery');
    transportOrder.delivery.address = buildAddress();
    transportOrder.delivery.actualDate = 0;
    transportOrder.owner = factory.newRelationship(namespace, 'LegalOwnerOrg', 'lapo@leaseplan.org');
    transportOrder.source = factory.newRelationship(namespace, 'CompoundOrg', 'amsterdamcompound');
    transportOrder.carrier = factory.newRelationship(namespace, 'CarrierOrg', 'koopman');
    transportOrder.goods = [];
    transportOrder.goods[0] = factory.newConcept(namespace, 'Good');
    transportOrder.goods[0].description = 'Car 1';
    transportOrder.goods[0].vehicle = buildVehicle('213123123123ASDSAD');
    transportOrder.goods[0].pickupWindow = factory.newConcept(namespace, 'DateWindow');
    transportOrder.goods[0].deliveryWindow = factory.newConcept(namespace, 'DateWindow');
    transportOrder.goods[0].pickupWindow.startDate = 0;
    transportOrder.goods[0].pickupWindow.endDate = 0;
    transportOrder.goods[0].deliveryWindow.startDate = 0;
    transportOrder.goods[0].deliveryWindow.endDate = 0;
    transportOrder.issueDate = 0;
    transportOrder.ecmrs = [];
    transportOrder.status = 'OPEN';
    transportOrder.ecmrs[0] = factory.newRelationship(namespace, 'ECMR', buildECMR('ecmr12345'));
    transportOrder.orderRef = 'order1';

    return transportOrder;
  }

  // This is called before all tests are executed
  beforeEach(() => {
    // Initialize an in-memory file system, so we do not write any files to the actual file system
    BrowserFS.initialize(new BrowserFS.FileSystem.InMemory());

    // Create a new admin connection.
    const adminConnection = new AdminConnection({fs: bfs_fs});

    // Create a new connection profile that uses the embedded (in-memory) runtime
    return adminConnection.createProfile(connectionProfile, {type: 'embedded'})
      .then(() => {
        // Establish an admin connection. The user ID must be admin. The user secret is
        // ignored, but only when the tests are executed using the embedded (in-memory)
        // runtime.
        return adminConnection.connect(connectionProfile, adminIdentity.userID, adminIdentity.userSecret);
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
        return businessNetworkConnection.connect(connectionProfile, networkName, adminIdentity.userID, adminIdentity.userSecret);
      })
      .then(() => {

        // Get the factory for the business network
        factory = businessNetworkConnection.getBusinessNetwork().getFactory();
        let transportOrder = buildTransportOrder('12345567890');

        return businessNetworkConnection.getAssetRegistry('org.digitalcmr.TransportOrder')
          .then((assetRegistry) => {
            return assetRegistry.addAll([transportOrder]);
          }).catch((error) => {
            console.log('Something went wrong while adding the transport order to the asset registry: ' + error);
          });
      })
  });

  it('should be able to create a Transport Order', () => {
    const transaction = factory.newTransaction(namespace, 'CreateTransportOrder');
    transaction.transportOrder = buildTransportOrder('transportOrder1', 'transportOrder2');

    return businessNetworkConnection.submitTransaction(transaction)
      .then(() => {
        return businessNetworkConnection.getAssetRegistry('org.digitalcmr.TransportOrder');
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
    transportOrders.push(buildTransportOrder('transportOrder8'));
    transportOrders.push(buildTransportOrder('transportOrder9'));
    const transaction = factory.newTransaction('org.digitalcmr', 'CreateTransportOrders');
    transaction.transportOrders = transportOrders;

    return businessNetworkConnection.submitTransaction(transaction)
      .then(() => {
        return businessNetworkConnection.getAssetRegistry('org.digitalcmr.TransportOrder');
      })
      .then((assetRegistry) => {
        return assetRegistry.getAll();
      })
      .then((transportOrders) => {
        transportOrders[0].$identifier.should.equal('transportOrder8');
        transportOrders[1].$identifier.should.equal('transportOrder9');
      });
  });

  it('should be able to update a pickupWindow in a transport order', () => {
    const transaction = factory.newTransaction('org.digitalcmr', 'UpdateTransportOrderPickupWindow');
    transaction.transportOrder = factory.newRelationship(namespace, 'TransportOrder', '12345567890');
    transaction.dateWindow = factory.newConcept(namespace, 'DateWindow');
    transaction.vin = '213123123123ASDSAD';
    transaction.dateWindow.startDate = 10101010;
    transaction.dateWindow.endDate = 20202020;

    return businessNetworkConnection.submitTransaction(transaction)
      .then(() => {
        return businessNetworkConnection.getAssetRegistry('org.digitalcmr.TransportOrder');
      })
      .then((assetRegistry) => {
        return assetRegistry.get('12345567890');
      })
      .then((transportOrder) => {
        transportOrder.goods[0].pickupWindow.startDate.should.equal(10101010);
        transportOrder.goods[0].pickupWindow.endDate.should.equal(20202020);
      });
  });

  it('should be able to update a deliveryWindow in a transport order', () => {
    const transaction = factory.newTransaction('org.digitalcmr', 'UpdateTransportOrderDeliveryWindow');
    transaction.transportOrder = factory.newRelationship(namespace, 'TransportOrder', '12345567890');
    transaction.dateWindow = factory.newConcept(namespace, 'DateWindow');
    transaction.vin = '213123123123ASDSAD';
    transaction.dateWindow.startDate = 10101010;
    transaction.dateWindow.endDate = 20202020;

    return businessNetworkConnection.submitTransaction(transaction)
      .then(() => {
        return businessNetworkConnection.getAssetRegistry('org.digitalcmr.TransportOrder');
      })
      .then((assetRegistry) => {
        return assetRegistry.get('12345567890');
      })
      .then((transportOrder) => {
        transportOrder.goods[0].deliveryWindow.startDate.should.equal(10101010);
        transportOrder.goods[0].deliveryWindow.endDate.should.equal(20202020);
      });
  });
});
