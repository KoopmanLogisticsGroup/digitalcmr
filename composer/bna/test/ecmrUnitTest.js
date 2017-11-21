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
  // These are a list of received events.
  let events;

  const ecmrStatus = {
    Created: 'CREATED',
    Loaded: 'LOADED',
    InTransit: 'IN_TRANSIT',
    Delivered: 'DELIVERED',
    ConfirmedDelivered: 'CONFIRMED_DELIVERED'
  };

  const userIDs = {
    Willem: 'willem@amsterdamcompound.org',
    Harry: 'harry@koopman.org',
    Rob: 'rob@cardealer.org'
  };

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
    address.latitude = Math.random() < 0.5 ? ((1 - Math.random()) * (90 - (-90)) + -90) : (Math.random() * (90 - (-90)) + (-90));
    address.longitude = Math.random() < 0.5 ? ((1 - Math.random()) * (180 - (-180)) + -180) : (Math.random() * (180 - (-180)) + (-180));

    return address;
  }

  /**
   * Build ECMR asset
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
    ecmr.loading.actualDate = 0;
    ecmr.delivery = factory.newConcept(namespace, 'Delivery');
    ecmr.delivery.address = buildAddress();
    ecmr.delivery.actualDate = 0;
    ecmr.owner = factory.newRelationship(namespace, 'LegalOwnerOrg', 'leaseplan');
    ecmr.source = factory.newRelationship(namespace, 'CompoundOrg', 'amsterdamcompound');
    ecmr.transporter = factory.newRelationship(namespace, 'CarrierMember', 'harry');
    ecmr.carrier = factory.newRelationship(namespace, 'CarrierOrg', 'koopman');
    ecmr.recipientOrg = factory.newRelationship(namespace, 'RecipientOrg', 'cardealer');
    ecmr.recipient = factory.newRelationship(namespace, 'RecipientMember', 'rob');
    ecmr.issuedBy = factory.newRelationship(namespace, 'Entity', 'leaseplan');
    ecmr.issueDate = 0;
    ecmr.carrierComments = 'comments';
    ecmr.goods = [];
    ecmr.goods[0] = factory.newConcept(namespace, 'Good');
    ecmr.goods[0].vehicle = buildVehicle();
    ecmr.goods[0].loadingStartDate = 0;
    ecmr.goods[0].loadingEndDate = 0;
    ecmr.goods[0].deliveryStartDate = 0;
    ecmr.goods[0].deliveryEndDate = 0;
    ecmr.legalOwnerInstructions = 'instructions';
    ecmr.paymentInstructions = 'instructions';
    ecmr.payOnDelivery = 'payondelivery';
    ecmr.status = ecmrStatus.Created;
    ecmr.agreementTerms = 'string';
    ecmr.agreementTermsSec = 'string';
    ecmr.legalOwnerRef = 'aqe2321312';
    ecmr.carrierRef = 'asdisajdaiodasj';
    ecmr.recipientRef = '2323423dsdf';
    ecmr.orderID = 'ORDER1';

    return ecmr;
  }

  /**
   * Build Vehicle asset
   * @return {Promise} A promise that will be resolved when completed.
   */
  function buildVehicle() {
    let vehicle = factory.newResource(namespace, 'Vehicle', '883726339N');
    vehicle.manufacturer = 'manufacturer';
    vehicle.model = 'model';
    vehicle.type = 'type';
    vehicle.ecmrs = [];
    vehicle.odoMeterReading = 0;
    vehicle.plateNumber = 'platenumber';

    return vehicle;
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

        // Create the CarrierMember
        const carrierMember = factory.newResource(namespace, 'CarrierMember', userIDs.Harry);
        carrierMember.userName = 'harry';
        carrierMember.firstName = 'harry';
        carrierMember.lastName = 'Koppy';
        carrierMember.address = buildAddress();
        carrierMember.org = factory.newRelationship(namespace, 'CarrierOrg', 'koopman');

        // Add participant to the registry
        return businessNetworkConnection.getParticipantRegistry('org.digitalcmr.CarrierMember')
          .then((participantRegistry) => {
            participantRegistry.addAll([carrierMember]);
          })
          .catch((error) => {
            console.log('participant carrier member add error: ' + error);
          });
      })
      .then(() => {
        // creates two transactions for two different carrier transports

        let ecmrList = [];
        ecmrList.push(buildECMR('ecmr1'));

        let ecmr = buildECMR('ecmr2');
        ecmr.status = ecmrStatus.Loaded;
        ecmr.compoundSignature = buildSignature(userIDs.Willem);
        ecmrList.push(ecmr);

        ecmr = buildECMR('ecmr3');
        ecmr.status = ecmrStatus.InTransit;
        ecmr.compoundSignature = buildSignature(userIDs.Willem);
        ecmr.carrierLoadingSignature = buildSignature(userIDs.Harry);
        ecmrList.push(ecmr);

        ecmr = buildECMR('ecmr4');
        ecmr.compoundSignature = buildSignature(userIDs.Willem);
        ecmr.carrierLoadingSignature = buildSignature(userIDs.Harry);
        ecmr.carrierDeliverySignature = buildSignature(userIDs.Harry);
        ecmr.status = ecmrStatus.Delivered;
        ecmrList.push(ecmr);

        ecmr = buildECMR('ecmr5');
        ecmr.status = ecmrStatus.InTransit;
        ecmrList.push(ecmr);

        ecmr = buildECMR('ecmr6');
        ecmr.compoundSignature = buildSignature(userIDs.Willem);
        ecmr.status = ecmrStatus.InTransit;
        ecmrList.push(ecmr);

        ecmr = buildECMR('ecmr7');
        ecmr.compoundSignature = buildSignature(userIDs.Willem);
        ecmr.carrierLoadingSignature = buildSignature(userIDs.Harry);
        ecmr.status = ecmrStatus.Delivered;
        ecmrList.push(ecmr);

        return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR')
          .then((assetRegistry) => {
            return assetRegistry.addAll(ecmrList);
          }).catch((error) => {
            console.log('An error occured while adding all the ecmrs to the registry: ' + error);
          });
      })
  });

  it('A new ECMR can be created', () => {
    const transaction = factory.newTransaction('org.digitalcmr', 'CreateECMR');
    transaction.ecmr = buildECMR('ecmr8');

    return businessNetworkConnection.submitTransaction(transaction)
      .then(() => {
        return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR');
      })
      .then((assetRegistry) => {
        return assetRegistry.get(transaction.ecmr.ecmrID);
      })
      .then((ecmr) => {
        ecmr.$identifier.should.equal(transaction.ecmr.ecmrID);
      });
  });

  it('New entries of multiple ECMRs can be created', () => {
    let ecmrs = [];
    ecmrs.push(buildECMR('ecmr8'));
    ecmrs.push(buildECMR('ecmr9'));
    const transaction = factory.newTransaction(namespace, 'CreateTransportOrder');
    transaction.transportOrder = buildTransportOrder('ORDER1');
    return businessNetworkConnection.submitTransaction(transaction)
      .then(() => {
        const transaction = factory.newTransaction('org.digitalcmr', 'CreateECMRs');
        transaction.ecmrs = ecmrs;
        transaction.transportOrder = factory.newRelationship('org.digitalcmr', 'TransportOrder', ecmrs[0].orderID);

        return businessNetworkConnection.submitTransaction(transaction)
      })
      .then(() => {
        return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR');
      })
      .then((assetRegistry) => {
        return assetRegistry.getAll();
      })
      .then((ecmrs) => {
        ecmrs.find(ecmr => ecmr.ecmrID === ecmrs[0].ecmrID);
        ecmrs.find(ecmr => ecmr.ecmrID === ecmrs[1].ecmrID);
      });
  });

  it('should be able to update ECMR status to LOADED when status is CREATED', () => {
    let updateTransaction = factory.newTransaction(namespace, 'UpdateECMR');
    updateTransaction.ecmr = buildECMR('ecmr2');
    updateTransaction.ecmr.status = ecmrStatus.Loaded;
    updateTransaction.ecmr.compoundSignature = buildSignature(userIDs.Willem);

    return businessNetworkConnection.submitTransaction(updateTransaction)
      .then(() => {
        return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR')
          .then((assetRegistry) => {
            return assetRegistry.get('ecmr2');
          })
          .then((updatedECMR) => {
            updatedECMR.status.should.equal(ecmrStatus.Loaded);
          });
      });
  });

  it('should be able to update ECMR status to IN_TRANSIT when status is LOADED', () => {
    let updateTransaction = factory.newTransaction(namespace, 'UpdateECMR');
    updateTransaction.ecmr = buildECMR('ecmr2');
    updateTransaction.ecmr.status = ecmrStatus.InTransit;
    updateTransaction.ecmr.compoundSignature = buildSignature(userIDs.Willem);
    updateTransaction.ecmr.carrierLoadingSignature = buildSignature(userIDs.Harry);

    return businessNetworkConnection.submitTransaction(updateTransaction)
      .then(() => {
        return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR')
          .then((assetRegistry) => {
            return assetRegistry.get('ecmr2');
          })
          .then((updatedECMR) => {
            updatedECMR.status.should.equal(ecmrStatus.InTransit);
          });
      });
  });

  it('should not be able to update ECMR status to IN_TRANSIT when status is LOADED without signature', () => {
    let updateTransaction = factory.newTransaction(namespace, 'UpdateECMR');
    updateTransaction.ecmr = buildECMR('ecmr1');
    updateTransaction.ecmr.status = ecmrStatus.InTransit;
    updateTransaction.ecmr.carrierLoadingSignature = undefined;

    return businessNetworkConnection.submitTransaction(updateTransaction)
      .should.be.rejectedWith(/Attempt to set the status on IN_TRANSIT before the compound admin signature/);
  });

  it('should be able to update ECMR status to DELIVERED when status is IN_TRANSIT', () => {
    let updateTransaction = factory.newTransaction(namespace, 'UpdateECMR');
    updateTransaction.ecmr = buildECMR('ecmr3');
    updateTransaction.ecmr.status = ecmrStatus.Delivered;
    updateTransaction.ecmr.carrierDeliverySignature = buildSignature(userIDs.Harry);

    return businessNetworkConnection.submitTransaction(updateTransaction)
      .then(() => {
        return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR')
          .then((assetRegistry) => {
            return assetRegistry.get('ecmr3');
          })
          .then((updatedECMR) => {
            updatedECMR.status.should.equal(ecmrStatus.Delivered);
          });
      });
  });

  it('should be able to update ECMR status to CONFIRMED_DELIVERED when status is DELIVERED', () => {
    let updateTransaction = factory.newTransaction(namespace, 'UpdateECMR');
    updateTransaction.ecmr = buildECMR('ecmr4');
    updateTransaction.ecmr.status = ecmrStatus.ConfirmedDelivered;
    updateTransaction.ecmr.recipientSignature = buildSignature(userIDs.Rob);

    return businessNetworkConnection.submitTransaction(updateTransaction)
      .then(() => {
        return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR')
          .then((assetRegistry) => {
            return assetRegistry.get('ecmr4');
          })
          .then((updatedECMR) => {
            updatedECMR.status.should.equal(ecmrStatus.ConfirmedDelivered);
          });
      });
  });

  it('should not be able to update ECMR status to DELIVERED when status is IN_TRANSIT without compound signature', () => {
    let updateTransaction = factory.newTransaction(namespace, 'UpdateECMR');
    updateTransaction.ecmr = buildECMR('ecmr5');
    updateTransaction.ecmr.status = ecmrStatus.Delivered;

    return businessNetworkConnection.submitTransaction(updateTransaction)
      .should.be.rejectedWith(/Attempt to set the status on DELIVERED before the compound admin signed/);
  });

  it('should not be able to update ECMR status to DELIVERED when status is IN_TRANSIT before transporter signed for loading', () => {
    let updateTransaction = factory.newTransaction(namespace, 'UpdateECMR');
    updateTransaction.ecmr = buildECMR('ecmr6');
    updateTransaction.ecmr.status = ecmrStatus.Delivered;

    return businessNetworkConnection.submitTransaction(updateTransaction)
      .should.be.rejectedWith(/Attempt to set the status on DELIVERED before the transporter signed for the loading!/);
  });

  it('should not be able to update ECMR status to CONFIRMED_DELIVERED when without signature before compound admin signed', () => {
    let updateTransaction = factory.newTransaction(namespace, 'UpdateECMR');
    updateTransaction.ecmr = buildECMR('ecmr5');
    updateTransaction.ecmr.status = ecmrStatus.ConfirmedDelivered;

    return businessNetworkConnection.submitTransaction(updateTransaction)
      .should.be.rejectedWith(/Attempt to set the status on CONFIRMED_DELIVERED before the compound admin signed/);
  });

  it('should not be able to update ECMR status to CONFIRMED_DELIVERED when without signature before the transporter signed for loading', () => {
    let updateTransaction = factory.newTransaction(namespace, 'UpdateECMR');
    updateTransaction.ecmr = buildECMR('ecmr6');
    updateTransaction.ecmr.status = ecmrStatus.ConfirmedDelivered;

    return businessNetworkConnection.submitTransaction(updateTransaction)
      .should.be.rejectedWith(/Attempt to set the status on CONFIRMED_DELIVERED before the transporter signed for the loading!/);
  });

  it('should not be able to update ECMR status to CONFIRMED_DELIVERED when without signature before the transport signed for delivery', () => {
    let updateTransaction = factory.newTransaction(namespace, 'UpdateECMR');
    updateTransaction.ecmr = buildECMR('ecmr7');
    updateTransaction.ecmr.status = ecmrStatus.ConfirmedDelivered;

    return businessNetworkConnection.submitTransaction(updateTransaction)
      .should.be.rejectedWith(/Attempt to set the status on CONFIRMED_DELIVERED before the transporter signed for the delivery!/);
  });

  it('should not be able to update ECMR status to an invalid status', () => {
    let updateTransaction = factory.newTransaction(namespace, 'UpdateECMR');
    updateTransaction.ecmr = buildECMR('ecmr7');
    updateTransaction.ecmr.status = 'NOT_CONFIRMED_DELIVERED';

    return businessNetworkConnection.submitTransaction(updateTransaction)
      .should.be.rejectedWith(/invalid enum value NOT_CONFIRMED_DELIVERED for field ECMR_STATUS/);
  });
});