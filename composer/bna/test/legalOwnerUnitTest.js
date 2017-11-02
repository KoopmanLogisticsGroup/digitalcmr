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

describe('As a Legal Owner, Lapo, ', () => {
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
     transportOrder.goods[0].description = 'Car 1';
     transportOrder.goods[0].loadingStartDate = 0;
     transportOrder.goods[0].loadingEndDate = 0;
     transportOrder.goods[0].deliveryStartDate = 0;
     transportOrder.goods[0].deliveryEndDate = 0;
     transportOrder.issueDate = 0;
     transportOrder.ecmrs = [];
     transportOrder.status = 'OPEN';
     transportOrder.ecmrs[0] = factory.newRelationship(namespace, 'ECMR', buildECMR('ecmr12345'));
     transportOrder.orderRef = 'order1';

     return transportOrder;
    }

    /**
     * Build Signature concept
     * @param {String} certificate The certificate of the user
     * @return {Promise} A promise that will be resolved when completed.
     */
    function buildSignature(certificate) {
      let signature = factory.newConcept(namespace, 'Signature');
      signature.certificate = factory.newRelationship(namespace, 'User', certificate);
      signature.timestamp = new Date().getTime();

      return signature;
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
              participantRegistry.addAll([legalOwnerAdmin]);
            })
            .catch((error) => {
              console.log('participant add error: ' + error);
            });
        })

        // adding initial ecmrs for tests
        .then(() => {
          return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR')
            .then(assetRegistry => {
              const ecmr1 = buildECMR('ecmr1');
              let ecmr2 = buildECMR('ecmr2');
              ecmr2.owner = factory.newRelationship(namespace, 'LegalOwnerOrg', 'noleaseplan');

              return assetRegistry.addAll([ecmr1, ecmr2]);
            });
        })

        .then(() => {
          // Issue the identity of Legal Owner
          return businessNetworkConnection.issueIdentity('org.digitalcmr.LegalOwnerAdmin#lapo@leaseplan.org', 'lapo@leaseplan.org')
            .then((identity) => {
              LegalOwnerAdminIdentity = identity;
            })
        });
    });

    /**
     * Connect as defined and issued participant.
     * @param {Object} identity The identity to use.
     * @return {Promise} A promise that will be resolved when completed.
     */
    function useIdentity(identity) {
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

    it('should be able to create an ECMR', () => {
      const transaction = factory.newTransaction('org.digitalcmr', 'CreateECMR');
      transaction.ecmr = buildECMR('ecmr5');

      return businessNetworkConnection.submitTransaction(transaction)
        .then(() => {
          return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR');
        })
        .then((assetRegistry) => {
          return assetRegistry.get('ecmr5');
        })
        .then((ecmr) => {
          ecmr.$identifier.should.equal('ecmr5');
        });
    });

    it('should be able to read all ecmrs', () => {
      return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR')
        .then((assetRegistry) => {
          return assetRegistry.getAll();
        })
        .then((ecmrs) => {
          // Validate the assets.
          ecmrs.should.have.length(2);
        });

    });

    it('should be able to create ECMR when I am the owner', () => {
      return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR')
        .then((assetRegistry) => {
          let ecmr = buildECMR('ecmr4');
          const transaction = factory.newTransaction(namespace, 'CreateECMR');
          transaction.ecmr = buildECMR('ecmr4');
          return assetRegistry.add(ecmr)
            .then(() => {
              return assetRegistry.get('ecmr4');
            });
          return businessNetworkConnection.submitTransaction(transaction);
        })
        .then(() => {
          // Get the assets
          return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR')
            .then((assetRegistry) => {
              return assetRegistry.get('ecmr4');
            });
        })
        .then((asset) => {
          // Validate the result
          asset.owner.getFullyQualifiedIdentifier().should.equal('org.digitalcmr.LegalOwnerOrg#lapo@leaseplan.org');
        })
    });

    it('should not be able to create ECMR when I am not the owner', () => {
      return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR')
        .then((assetRegistry) => {
          let ecmr = buildECMR('ecmr4');
          ecmr.owner = factory.newRelationship(namespace, 'LegalOwnerOrg', 'notlapo@leaseplan.org');
          const transaction = factory.newTransaction(namespace, 'CreateECMR');
          transaction.ecmr = buildECMR('ecmr4');

          return assetRegistry.add(ecmr)
            .then(() => {
              return assetRegistry.get('ecmr4');
            });
          return businessNetworkConnection.submitTransaction(transaction);
        })
        .then(() => {
          // Get the assets
          return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR')
            .then((assetRegistry) => {
              return assetRegistry.get('ecmr4');
            });
        })
        .then((asset) => {
          // Validate the result
          asset.owner.getFullyQualifiedIdentifier().should.not.equal('org.digitalcmr.LegalOwnerOrg#lapo@leaseplan.org');
        })
    });

    it('should be able to update an ECMR when I am the owner', () => {
      return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR')
        .then((assetRegistry) => {
          let ecmr = buildECMR('ecmr4');
          const transaction = factory.newTransaction(namespace, 'UpdateECMR');
          transaction.ecmr = buildECMR('ecmr4');
          transaction.ecmr.status = 'CREATED';

          return assetRegistry.add(ecmr)
            .then(() => {
              return assetRegistry.get('ecmr4');
            });
          return businessNetworkConnection.submitTransaction(transaction);
        })
        .then(() => {
          // Get the assets
          return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR')
            .then((assetRegistry) => {
              return assetRegistry.get('ecmr4');
            });
        })
        .then((asset) => {
          // Validate the result
          asset.owner.getFullyQualifiedIdentifier().should.equal('org.digitalcmr.LegalOwnerOrg#lapo@leaseplan.org');
        })
    });

    it('LegalOwnerAdmin can READ pre-eCMR if from same organization', () => {
      return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR')
        .then((assetRegistry) => {
          return assetRegistry.get('ecmr1');
        })
        .then((asset) => {
          // Validate the result
          asset.owner.getFullyQualifiedIdentifier().should.equal('org.digitalcmr.LegalOwnerOrg#lapo@leaseplan.org');
        });
    });

    it('should be able to read all of his ecmrs', () => {
      // Get the assets.
      return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR')
        .then((assetRegistry) => {
          return assetRegistry.getAll();
        })
        .then((assets) => {
          // Validate the assets.
          assets.should.have.length(2);
          assets.find(asset => asset.owner.getFullyQualifiedIdentifier().should.equal('org.digitalcmr.LegalOwnerOrg#lapo@leaseplan.org'));
        });
    });

    it('should be able to query all the ecmrs', () => {
      return businessNetworkConnection.query('getAllEcmrs')
        .then((ecmr) => {
          ecmr.length.should.equal(2);
        });
    });

    it('should be able to create an Transport order', () => {
      let transaction = factory.newTransaction(namespace, 'CreateTransportOrder');
      transaction.transportOrder = buildTransportOrder('transportOrder1');

      return businessNetworkConnection.submitTransaction(transaction)
        .then(() => {
          return businessNetworkConnection.getAssetRegistry('org.digitalcmr.TransportOrder')
        })
        .then((assetRegistry) => {
          return assetRegistry.get('transportOrder1');
        })
        .then((asset) => {
          asset.owner.getFullyQualifiedIdentifier().should.equal('org.digitalcmr.LegalOwnerOrg#lapo@leaseplan.org');
        })
    })

    // add later
    // it('should be able to query all the ecmrs by ID', () => {
    //   return businessNetworkConnection.query('getEcmrById')
    //     .then((ecmr) => {
    //       ecmr.length.should.equal(2);
    //     });
    // });
    //
    // it('should be able to query all the ecmrs by status', () => {
    //   return businessNetworkConnection.query('getEcmrById')
    //     .then((ecmr) => {
    //       ecmr.length.should.equal(2);
    //     });
    // });
  }
);