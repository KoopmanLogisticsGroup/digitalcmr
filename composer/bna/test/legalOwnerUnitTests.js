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

describe('Admin of the network', () => {
    // This is the business network connection the tests will use.
    let businessNetworkConnection;
    // This is the factory for creating instances of types.
    let factory;
    // These are the identities.
    const adminIdentity = {'userID': 'admin', 'userSecret': 'adminpw'};
    let LegalOwnerAdminIdentity;
    // These are a list of received events.
    let events;

    /**
     * Connect as defined and issued participant.
     * @param {Object} identity The identity to use.
     * @return {Promise} A promise that will be resolved when completed.
     */
    function connectAs(identity) {
      return businessNetworkConnection.disconnect()
        .then(() => {
          // Create and establish a business network connection
          businessNetworkConnection = new BusinessNetworkConnection({fs: bfs_fs});
          events = [];
          businessNetworkConnection.on('event', (event) => {
            events.push(event);
          });
          return businessNetworkConnection.connect(connectionProfile, networkName, identity.userID, identity.userSecret);
        });
    }

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
      ecmr.creation = factory.newConcept(namespace, 'Creation');
      ecmr.creation.address = buildAddress();
      ecmr.creation.date = 0;
      ecmr.loading = factory.newConcept(namespace, 'Loading');
      ecmr.loading.address = buildAddress();
      ecmr.loading.date = 0;
      ecmr.delivery = factory.newConcept(namespace, 'Delivery');
      ecmr.delivery.address = buildAddress();
      ecmr.delivery.date = 0;
      ecmr.owner = factory.newRelationship(namespace, 'LegalOwnerOrg', 'leaseplan');
      ecmr.source = factory.newRelationship(namespace, 'CompoundOrg', 'amsterdamcompound');
      ecmr.transporter = factory.newRelationship(namespace, 'CarrierMember', 'harry');
      ecmr.carrier = factory.newRelationship(namespace, 'CarrierOrg', 'koopman');
      ecmr.recipientOrg = factory.newRelationship(namespace, 'RecipientOrg', 'cardealer');
      ecmr.recipient = factory.newRelationship(namespace, 'RecipientMember', 'rob');
      ecmr.issuedBy = factory.newRelationship(namespace, 'Entity', 'leaseplan');
      ecmr.carrierComments = 'carrier comments here';
      ecmr.issueDate = 0;
      ecmr.goods = [];
      ecmr.goods[0] = factory.newConcept(namespace, 'Good');
      ecmr.goods[0].description = 'Car 1';
      ecmr.legalOwnerInstructions = 'instructions here';
      ecmr.paymentInstructions = 'instructions for payment';
      ecmr.payOnDelivery = 'ok ok';
      ecmr.status = 'CREATED';
      ecmr.goods[0].vehicle = buildVehicle('213123123123ASDSAD');

      return ecmr;
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
          // Create the LegalOwner
          const legalOwnerAdmin = factory.newResource(namespace, 'LegalOwnerAdmin', 'lapo@leaseplan.org');
          legalOwnerAdmin.firstName = 'lapo';
          legalOwnerAdmin.lastName = 'kelkann';
          legalOwnerAdmin.userName = 'lapo';
          legalOwnerAdmin.address = buildAddress();
          legalOwnerAdmin.org = factory.newRelationship(namespace, 'LegalOwnerOrg', 'leaseplan');

          // Add participant to the registry
          return businessNetworkConnection.getParticipantRegistry('org.digitalcmr.LegalOwnerAdmin')
            .then((participantRegistry) => {
              participantRegistry.add(legalOwnerAdmin);
            })
            .catch((error) => {
              console.log('participant add error: ' + error);
            });
        })
        .then(() => {
          // Issue the identity of the participant
          return businessNetworkConnection.issueIdentity('org.digitalcmr.LegalOwnerAdmin#lapo@leaseplan.org', 'lapo@leaseplan.org')
            .then((identity) => {
              LegalOwnerAdminIdentity = identity;
              return businessNetworkConnection.issueIdentity('org.digitalcmr.LegalOwnerAdmin#lapo@leaseplan.org', 'lapo@leaseplan.org');
            });
        });
    });


    // it('can submit transaction InitTestData', () => {
    //   let transaction = factory.newTransaction(namespace, 'InitTestData');
    //   transaction.ecmr = [buildOrder('ecmr1'), buildOrder('ecmr2')];
    //   return businessNetworkConnection.submitTransaction(transaction)
    //     .then(() => {
    //       return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR')
    //     })
    //     .then((assetRegistry) => {
    //       return assetRegistry.getAll();
    //     })
    //     .then((assets) => {
    //       assets.should.have.length(2);
    //     });
    // });

    it('can submit transaction CreateECMR', () => {
      let transaction = factory.newTransaction(namespace, 'CreateECMR');

      transaction.ecmr = buildECMR('ecmr1');
      return businessNetworkConnection.submitTransaction(transaction)
        .then(() => {
          return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR')
        })
        .then((assetRegistry) => {
          return assetRegistry.get('ecmr1');
        })
        .then((asset) => {
          asset.owner.getFullyQualifiedIdentifier().should.equal('org.digitalcmr.LegalOwnerOrg#leaseplan');
        });
    });

    it('LegalOwnerAdmin cannot CREATE/READ pre-eCMR if his organization is NOT the owner', () => {
      // Use the identity for LegalOwnerAdmin
      return connectAs(LegalOwnerAdminIdentity)
        .then(() => {
          // Get the assets
          return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR')
            .then((assetRegistry) => {
              let ecmr = buildECMR('notlegalowner');
              ecmr.owner = factory.newRelationship(namespace, 'LegalOwnerOrg', 'not_leaseplan');
              return assetRegistry.add(ecmr)
                .then(() => {
                  return assetRegistry.get('notlegalowner');
                });
            });
        })
        .should.be.rejectedWith(/does not have .* access to resource/);
    });
  }
);