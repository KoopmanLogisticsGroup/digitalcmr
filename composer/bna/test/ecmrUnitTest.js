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

describe('Admin of the network', () => {
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

        // Create the CarrierMember
        const carrierMember = factory.newResource(Network.namespace, 'CarrierMember', Identity.userIDs.carrierMember);
        carrierMember.userName = 'harry';
        carrierMember.firstName = 'harry';
        carrierMember.lastName = 'harry';
        carrierMember.address = builder.buildAddress();
        carrierMember.org = factory.newRelationship(Network.namespace, 'CarrierOrg', 'koopman');

        // Add participant to the registry
        return businessNetworkConnection.getParticipantRegistry(Network.namespace + '.CarrierMember')
          .then((participantRegistry) => {
            participantRegistry.addAll([carrierMember]);
          })
          .catch((error) => {
            console.log('participant carrier member add error: ' + error);
          });
      })
      // prepare the test environment
      .then(() => {
        let ecmrList = [];

        ecmrList.push(builder.buildECMR('created'));

        let ecmr = builder.buildECMR('loaded');
        ecmr.status = BusinessModel.ecmrStatus.Loaded;
        ecmr.compoundSignature = builder.buildSignature(Identity.userIDs.compoundAdmin);
        ecmrList.push(ecmr);

        ecmr = builder.buildECMR('in_transit');
        ecmr.status = BusinessModel.ecmrStatus.InTransit;
        ecmr.compoundSignature = builder.buildSignature(Identity.userIDs.compoundAdmin);
        ecmr.carrierLoadingSignature = builder.buildSignature(Identity.userIDs.carrierMember);
        ecmrList.push(ecmr);

        ecmr = builder.buildECMR('delivered');
        ecmr.compoundSignature = builder.buildSignature(Identity.userIDs.compoundAdmin);
        ecmr.carrierLoadingSignature = builder.buildSignature(Identity.userIDs.carrierMember);
        ecmr.carrierDeliverySignature = builder.buildSignature(Identity.userIDs.carrierMember);
        ecmr.status = BusinessModel.ecmrStatus.Delivered;
        ecmrList.push(ecmr);

        ecmr = builder.buildECMR('ecmr5');
        ecmr.status = BusinessModel.ecmrStatus.InTransit;
        ecmrList.push(ecmr);

        ecmr = builder.buildECMR('ecmr6');
        ecmr.compoundSignature = builder.buildSignature(Identity.userIDs.compoundAdmin);
        ecmr.status = BusinessModel.ecmrStatus.InTransit;
        ecmrList.push(ecmr);

        ecmr = builder.buildECMR('ecmr7');
        ecmr.compoundSignature = builder.buildSignature(Identity.userIDs.compoundAdmin);
        ecmr.carrierLoadingSignature = builder.buildSignature(Identity.userIDs.carrierMember);
        ecmr.status = BusinessModel.ecmrStatus.Delivered;
        ecmrList.push(ecmr);

        ecmr = builder.buildECMR('ecmr12');
        ecmr.status = BusinessModel.ecmrStatus.Delivered;
        ecmrList.push(ecmr);

        ecmr = builder.buildECMR('ecmr13');
        ecmr.status = BusinessModel.ecmrStatus.Delivered;
        ecmr.compoundSignature = builder.buildSignature(Identity.userIDs.compoundAdmin);
        ecmrList.push(ecmr);

        ecmr = builder.buildECMR('ecmr14');
        ecmr.status = BusinessModel.ecmrStatus.Delivered;
        ecmr.compoundSignature = builder.buildSignature(Identity.userIDs.compoundAdmin);
        ecmr.carrierLoadingSignature = builder.buildSignature(Identity.userIDs.carrierMember);
        ecmrList.push(ecmr);

        return businessNetworkConnection.getAssetRegistry(Network.namespace + '.ECMR')
          .then((assetRegistry) => {
            return assetRegistry.addAll(ecmrList);
          }).catch((error) => {
            throw new Error('An error occurred while adding all the ecmrs to the registry: ' + error);
          });
      })
      .then(() => {
        const transportOrders = [builder.buildTransportOrder('to_create_ecmrs')];

        return businessNetworkConnection.getAssetRegistry('org.digitalcmr.TransportOrder')
          .then((assetRegistry) => {
            return assetRegistry.addAll(transportOrders);
          }).catch((error) => {
            throw new Error('An error occurred while adding all the orders to the registry: ' + error);
          });
      });
  });

  it('should be able to submit transaction CreateECMR which creates a new ECMR and sets the status to CREATED', () => {
    const transaction = factory.newTransaction(Network.namespace, 'CreateECMR');
    transaction.ecmr = builder.buildECMR('new');

    return businessNetworkConnection.submitTransaction(transaction)
      .then(() => {
        return businessNetworkConnection.getAssetRegistry(Network.namespace + '.ECMR');
      })
      .then((assetRegistry) => {
        return assetRegistry.get(transaction.ecmr.ecmrID);
      })
      .then((ecmr) => {
        ecmr.$identifier.should.equal(transaction.ecmr.ecmrID);
      });
  });

  it('should be able to submit CreateECMRs which creates multiple ECMRs starting from a TransportOrder', () => {
    const ecmrs = [builder.buildECMR('1'), builder.buildECMR('2')];
    [ecmrs[0].orderID, ecmrs[1].orderID] = ['to_create_ecmrs', 'to_create_ecmrs'];
    const transaction = factory.newTransaction(Network.namespace, 'CreateECMRs');
    transaction.ecmrs = ecmrs;
    transaction.transportOrder = factory.newRelationship(Network.namespace, 'TransportOrder', 'to_create_ecmrs');

    return businessNetworkConnection.submitTransaction(transaction)
      .then(() => {
        return businessNetworkConnection.getAssetRegistry(Network.namespace + '.ECMR');
      })
      .then((assetRegistry) => {
        return assetRegistry.getAll();
      })
      .then((ecmrs) => {
        ecmrs.find(ecmr => (ecmr.ecmrID === ecmrs[0].ecmrID && ecmr.orderID === ecmrs[0].orderID));
        ecmrs.find(ecmr => (ecmr.ecmrID === ecmrs[1].ecmrID && ecmr.orderID === ecmrs[1].orderID));
      });
  });

  it('should be able to submit UpdateEcmrStatusToLoaded which updates ECMR status from CREATED to LOADED', () => {
    let transaction = factory.newTransaction(Network.namespace, 'UpdateEcmrStatusToLoaded');
    transaction.transportOrder = factory.newRelationship(Network.namespace, 'TransportOrder', 'to_create_ecmrs');
    transaction.ecmr = factory.newRelationship(Network.namespace, 'ECMR', 'created');
    transaction.updatedEcmr = builder.buildECMR('updated');
    transaction.updatedEcmr.compoundSignature = builder.buildSignature(Identity.userIDs.compoundAdmin);

    return businessNetworkConnection.submitTransaction(transaction)
      .then(() => {
        return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR')
          .then((assetRegistry) => {
            return assetRegistry.get('created');
          })
          .then((updatedECMR) => {
            updatedECMR.status.should.equal(BusinessModel.ecmrStatus.Loaded);
          });
      });
  });

  it('should be able to submit UpdateEcmrStatusToInTransit which updates ECMR status from LOADED to IN_TRANSIT', () => {
    const transaction = factory.newTransaction(Network.namespace, 'UpdateEcmrStatusToInTransit');
    transaction.transportOrder = factory.newRelationship(Network.namespace, 'TransportOrder', 'to_create_ecmrs');
    transaction.ecmr = factory.newRelationship(Network.namespace, 'ECMR', 'loaded');
    transaction.updatedEcmr = builder.buildECMR('updated');
    transaction.updatedEcmr.carrierLoadingSignature = builder.buildSignature(Identity.userIDs.carrierMember);

    return businessNetworkConnection.submitTransaction(transaction)
      .then(() => {
        return businessNetworkConnection.getAssetRegistry(Network.namespace + '.ECMR')
          .then((assetRegistry) => {
            return assetRegistry.get('loaded');
          })
          .then((updatedECMR) => {
            updatedECMR.status.should.equal(BusinessModel.ecmrStatus.InTransit);
          });
      });
  });

// it('should not be able to update ECMR status to IN_TRANSIT when status is LOADED without signature', () => {
//   let updateTransaction = factory.newTransaction(Network.namespace, 'UpdateECMR');
//   updateTransaction.transportOrder = factory.newRelationship(Network.namespace, 'TransportOrder', 'ORDER1');
//   updateTransaction.ecmr = builder.buildECMR('created');
//   updateTransaction.ecmr.status = BusinessModel.ecmrStatus.InTransit;
//
//   return businessNetworkConnection.submitTransaction(updateTransaction)
//     .should.be.rejectedWith(/Attempt to set the status on IN_TRANSIT before the compound admin signature/);
// });

  it('should be able to submit UpdateEcmrStatusToDelivered which updates ECMR status from IN_TRANSIT to DELIVERED', () => {
    const transaction = factory.newTransaction(Network.namespace, 'UpdateEcmrStatusToDelivered');
    transaction.transportOrder = factory.newRelationship(Network.namespace, 'TransportOrder', 'to_create_ecmrs');
    transaction.ecmr = factory.newRelationship(Network.namespace, 'ECMR', 'in_transit');
    transaction.updatedEcmr = builder.buildECMR('updated');
    transaction.updatedEcmr.carrierDeliverySignature = builder.buildSignature(Identity.userIDs.carrierMember);

    return businessNetworkConnection.submitTransaction(transaction)
      .then(() => {
        return businessNetworkConnection.getAssetRegistry(Network.namespace + '.ECMR')
          .then((assetRegistry) => {
            return assetRegistry.get('in_transit');
          })
          .then((updatedECMR) => {
            updatedECMR.status.should.equal(BusinessModel.ecmrStatus.Delivered);
          });
      });
  });

  it('should be able to submit UpdateEcmrStatusToConfirmedDelivered which updates ECMR status from DELIVERED to CONFIRMED_DELIVERED', () => {
    const transaction = factory.newTransaction(Network.namespace, 'UpdateEcmrStatusToConfirmedDelivered');
    transaction.transportOrder = factory.newRelationship(Network.namespace, 'TransportOrder', 'to_create_ecmrs');
    transaction.ecmr = factory.newRelationship(Network.namespace, 'ECMR', 'delivered');
    transaction.updatedEcmr = builder.buildECMR('updated');
    transaction.updatedEcmr.recipientSignature = builder.buildSignature(Identity.userIDs.recipientAdmin);

    return businessNetworkConnection.submitTransaction(transaction)
      .then(() => {
        return businessNetworkConnection.getAssetRegistry(Network.namespace + '.ECMR')
          .then((assetRegistry) => {
            return assetRegistry.get('delivered');
          })
          .then((updatedECMR) => {
            updatedECMR.status.should.equal(BusinessModel.ecmrStatus.ConfirmedDelivered);
          });
      });
  });

  it('should not be able to update ECMR status to DELIVERED when status is IN_TRANSIT without compound signature', () => {
    let updateTransaction = factory.newTransaction(Network.namespace, 'UpdateECMR');
    updateTransaction.transportOrder = factory.newRelationship(Network.namespace, 'TransportOrder', 'ORDER1');
    updateTransaction.ecmr = builder.buildECMR('ecmr5');
    updateTransaction.ecmr.status = BusinessModel.ecmrStatus.Delivered;

    return businessNetworkConnection.submitTransaction(updateTransaction)
      .should.be.rejectedWith(/Attempt to set the status on DELIVERED before the compound admin signed/);
  });

  it('should not be able to update ECMR status to DELIVERED when status is IN_TRANSIT before transporter signed for loading', () => {
    let updateTransaction = factory.newTransaction(Network.namespace, 'UpdateECMR');
    updateTransaction.transportOrder = factory.newRelationship(Network.namespace, 'TransportOrder', 'ORDER1');
    updateTransaction.ecmr = builder.buildECMR('ecmr6');
    updateTransaction.ecmr.status = BusinessModel.ecmrStatus.Delivered;

    return businessNetworkConnection.submitTransaction(updateTransaction)
      .should.be.rejectedWith(/Attempt to set the status on DELIVERED before the transporter signed for the loading!/);
  });

  it('should not be able to update ECMR status to CONFIRMED_DELIVERED when without signature before compound admin signed', () => {
    let updateTransaction = factory.newTransaction(Network.namespace, 'UpdateECMR');
    updateTransaction.transportOrder = factory.newRelationship(Network.namespace, 'TransportOrder', 'ORDER1');
    updateTransaction.ecmr = builder.buildECMR('ecmr12');
    updateTransaction.ecmr.status = BusinessModel.ecmrStatus.ConfirmedDelivered;

    return businessNetworkConnection.submitTransaction(updateTransaction)
      .should.be.rejectedWith(/Attempt to set the status on CONFIRMED_DELIVERED before the compound admin signed/);
  });

  it('should not be able to update ECMR status to CONFIRMED_DELIVERED when without signature before the transporter signed for loading', () => {
    let updateTransaction = factory.newTransaction(Network.namespace, 'UpdateECMR');
    updateTransaction.transportOrder = factory.newRelationship(Network.namespace, 'TransportOrder', 'ORDER1');
    updateTransaction.ecmr = builder.buildECMR('ecmr13');
    updateTransaction.ecmr.status = BusinessModel.ecmrStatus.ConfirmedDelivered;

    return businessNetworkConnection.submitTransaction(updateTransaction)
      .should.be.rejectedWith(/Attempt to set the status on CONFIRMED_DELIVERED before the transporter signed for the loading!/);
  });

  it('should not be able to update ECMR status to CONFIRMED_DELIVERED when without signature before the transport signed for delivery', () => {
    let updateTransaction = factory.newTransaction(Network.namespace, 'UpdateECMR');
    updateTransaction.transportOrder = factory.newRelationship(Network.namespace, 'TransportOrder', 'ORDER1');
    updateTransaction.ecmr = builder.buildECMR('ecmr14');
    updateTransaction.ecmr.status = BusinessModel.ecmrStatus.ConfirmedDelivered;

    return businessNetworkConnection.submitTransaction(updateTransaction)
      .should.be.rejectedWith(/Attempt to set the status on CONFIRMED_DELIVERED before the transporter signed for the delivery!/);
  });

  it('should be able to submit UpdateECMRStatusToCancelled and cancel an ECMR', () => {
    let transaction = factory.newTransaction(Network.namespace, 'UpdateECMRStatusToCancelled');
    transaction.ecmr = builder.buildECMR('created');
    transaction.ecmr = factory.newRelationship(Network.namespace, 'ECMR', 'created');
    transaction.cancellation = factory.newConcept(Network.namespace, 'Cancellation');
    transaction.cancellation.cancelledBy = factory.newRelationship(Network.namespace, 'Entity', 'pete@koopman.org');
    transaction.cancellation.date = new Date().getTime();
    transaction.cancellation.reason = 'one big reason';

    return businessNetworkConnection.submitTransaction(transaction)
      .then(() => {
        return businessNetworkConnection.getAssetRegistry(Network.namespace, 'ECMR')
          .then((assetRegistry) => {
            return assetRegistry.get('created');
          })
          .then((updatedECMR) => {
            updatedECMR.status.should.equal(BusinessModel.ecmrStatus.Cancelled);
            updatedECMR.cancellation.should.be.instanceOf(Object);
          });
      });
  });

  it('should be able to update the expectedPickupWindow of an ECMR which status is CREATED', () => {
    let updateExpectedPickupWindowTransaction = factory.newTransaction(Network.namespace, 'UpdateExpectedPickupWindow');
    updateExpectedPickupWindowTransaction.ecmr = factory.newRelationship(Network.namespace, 'ECMR', 'created');
    updateExpectedPickupWindowTransaction.expectedWindow = factory.newConcept(Network.namespace, 'DateWindow');
    updateExpectedPickupWindowTransaction.expectedWindow.startDate = 1;
    updateExpectedPickupWindowTransaction.expectedWindow.endDate = 2;

    return businessNetworkConnection.submitTransaction(updateExpectedPickupWindowTransaction)
      .then(() => {
        return businessNetworkConnection.getAssetRegistry(Network.namespace + '.ECMR')
          .then((assetRegistry) => {
            return assetRegistry.get('created')
              .then((ecmr) => {
                ecmr.loading.expectedWindow.startDate.should.equal(1);
                ecmr.loading.expectedWindow.endDate.should.equal(2);
              }).catch((error) => {
                throw error;
              })
          }).catch((error) => {
            throw error;
          })
      }).catch((error) => {
        throw error;
      });
  });

  it('should not be able to update the expectedPickupWindow of an ECMR which status is not CREATED', () => {
    let updateExpectedPickupWindowTransaction = factory.newTransaction(Network.namespace, 'UpdateExpectedPickupWindow');
    updateExpectedPickupWindowTransaction.ecmr = factory.newRelationship(Network.namespace, 'ECMR', 'loaded');
    updateExpectedPickupWindowTransaction.expectedWindow = factory.newConcept(Network.namespace, 'DateWindow');
    updateExpectedPickupWindowTransaction.expectedWindow.startDate = 1;
    updateExpectedPickupWindowTransaction.expectedWindow.endDate = 2;

    return businessNetworkConnection.submitTransaction(updateExpectedPickupWindowTransaction)
      .should.be.rejectedWith(/Transaction is not valid/);
  });

  it('should be able to update the expectedDeliveryWindow of an ECMR which status is IN_TRANSIT', () => {
    let updateExpectedDeliveryWindowTransaction = factory.newTransaction(Network.namespace, 'UpdateExpectedDeliveryWindow');
    updateExpectedDeliveryWindowTransaction.ecmr = factory.newRelationship(Network.namespace, 'ECMR', 'ecmr3');
    updateExpectedDeliveryWindowTransaction.expectedWindow = factory.newConcept(Network.namespace, 'DateWindow');
    updateExpectedDeliveryWindowTransaction.expectedWindow.startDate = 1;
    updateExpectedDeliveryWindowTransaction.expectedWindow.endDate = 2;

    return businessNetworkConnection.submitTransaction(updateExpectedDeliveryWindowTransaction)
      .then(() => {
        return businessNetworkConnection.getAssetRegistry(Network.namespace + '.ECMR')
          .then((assetRegistry) => {
            return assetRegistry.get('ecmr3')
              .then((ecmr) => {
                ecmr.delivery.expectedWindow.startDate.should.equal(1);
                ecmr.delivery.expectedWindow.endDate.should.equal(2);
              }).catch((error) => {
                throw error;
              })
          }).catch((error) => {
            throw error;
          })
      }).catch((error) => {
        throw error;
      });
  });

  it('should not be able to update the expectedDeliveryWindow of an ECMR which status is not IN_TRANSIT', () => {
    let updateExpectedDeliveryWindowTransaction = factory.newTransaction(Network.namespace, 'UpdateExpectedDeliveryWindow');
    updateExpectedDeliveryWindowTransaction.ecmr = factory.newRelationship(Network.namespace, 'ECMR', 'created');
    updateExpectedDeliveryWindowTransaction.expectedWindow = factory.newConcept(Network.namespace, 'DateWindow');
    updateExpectedDeliveryWindowTransaction.expectedWindow.startDate = 1;
    updateExpectedDeliveryWindowTransaction.expectedWindow.endDate = 2;

    return businessNetworkConnection.submitTransaction(updateExpectedDeliveryWindowTransaction)
      .should.be.rejectedWith(/Transaction is not valid. Attempting to set an ExpectedDeliveryWindow when status is not IN_TRANSIT. Actual status:/);
  });
});