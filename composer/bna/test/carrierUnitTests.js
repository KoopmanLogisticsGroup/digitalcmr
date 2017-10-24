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
  //
  let carrierMemberIdentity;

  /**
   * Reconnect using a different identity.
   * @param {Object} identity The identity to use.
   * @return {Promise} A promise that will be resolved when complete.
   */
  function useIdentity(identity) {
    return businessNetworkConnection.disconnect()
      .then(() => {
        businessNetworkConnection = new BusinessNetworkConnection({ fs: bfs_fs });
        events = [];
        businessNetworkConnection.on('event', (event) => {
          events.push(event);
        });
        return businessNetworkConnection.connect('defaultProfile', 'basic-sample-network', identity.userID, identity.userSecret);
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
    address.latitude = Math.random() < 0.5 ? ((1-Math.random()) * (90-(-90)) + -90) : (Math.random() * (90-(-90)) + (-90));
    address.longitude = Math.random() < 0.5 ? ((1-Math.random()) * (180-(-180)) + -180) : (Math.random() * (180-(-180)) + (-180));
    return address;
  }

  /**
   * Build Order asset
   * @param {String} orderID The ID of the Order to build
   * @return {Promise} A promise that will be resolved when completed.
   */
  function buildOrder(orderID) {
    let order = factory.newResource(namespace, 'Order', orderID);
    order.creation = factory.newConcept(namespace, 'Creation');
    order.creation.address = buildAddress();
    order.creation.date = 0;
    order.loading = factory.newConcept(namespace, 'Loading');
    order.loading.address = buildAddress();
    order.loading.date = 0;
    order.delivery = factory.newConcept(namespace, 'Delivery');
    order.delivery.address = buildAddress();
    order.delivery.date = 0;
    order.legalOwner = factory.newRelationship(namespace, 'LegalOwner', 'lapo');
    order.issueDate = 0;
    order.goods = [];
    order.goods[0] = factory.newConcept(namespace, 'Good');
    order.goods[0].description = 'MacBook Pro 13';
    order.status = 'CREATED';

    return order;
  }

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
        const carrierMember = factory.newResource(namespace, 'CarrierMember', 'harry@koopman.org');
        carrierMember.userName = 'harry';
        carrierMember.firstName = 'harry';
        carrierMember.lastName = 'Koppy';
        carrierMember.address = buildAddress();
        carrierMember.org = factory.newRelationship(namespace, 'CarrierOrg', 'koopman');

        // Add participant to the registry
        return businessNetworkConnection.getParticipantRegistry('org.digitalcmr.CarrierMember')
          .then((participantRegistry) => {
            participantRegistry.addAll([carrierMember]);
            console.log("participant registry ",participantRegistry.getAllParticipantRegistries);
          })
          .catch((error) => {
            console.log('participant carrier member add error: ' + error);
          });
      })
      .then(() => {
        // Issue the identity of the carrier member
        return businessNetworkConnection.issueIdentity('org.digitalcmr.CarrierMember#harry@koopman.org', 'harry1')
          .then((identity) => {
            carrierMemberIdentity = identity;
          })
          .catch((error) => {
            console.log('issue identity error: ' + error);
          });
      });
  });

  // write below here your unit tests
  it('LegalOwner can CREATE and READ pre-eCMR only if his organization is the owner', () => {
    // Use the identity for LegalOwner
    console.log("test start");
    return connectAs(carrierMemberIdentity)
      .then(() => {
        // Get the assets
        return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR')
          .then((assetRegistry) => {
            let ecmr = buildECMR('carrier');
            let ecmrExceptionCompound = buildECMR('carrier');
            ecmrExceptionCompound.source = factory.newRelationship(namespace, 'CarrierOrg', 'koopman');
            return assetRegistry.add(ecmr)
              .then(() => {
                return assetRegistry.get('carrier');
              });
          });
      })
      .then((asset) => {
        // Validate the result
        //asset.owner.getFullyQualifiedIdentifier().should.equal('org.digitalcmr.CarrierOrg#leaseplan');
        console.log(asset.owner.getFullyQualifiedIdentifier());
        // console.log(asset);
        // asset.value.should.equal('50');

        // Validate the events.
        // events.should.have.lengthOf(1);
        // const event = events[0];
        // event.eventId.should.be.a('string');
        // event.timestamp.should.be.an.instanceOf(Date);
        // event.asset.getFullyQualifiedIdentifier().should.equal('org.digitalcmr.ECMR#A1234567890');
        // event.oldValue.should.equal('20');
        // event.newValue.should.equal('60');
      })
  });
});