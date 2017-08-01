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
const NS = 'org.digitalcmr';

describe('digitalcmr', () => {
    // This is the business network connection the tests will use.
    let businessNetworkConnection;

    // This is the factory for creating instances of types.
    let factory;

    // These are the identities for Alice and Bob.
    let LeasePlanIdentity;

    // These are a list of received events.
    let events;

    // This is called before each test is executed.
    beforeEach(() => {

        // Initialize an in-memory file system, so we do not write any files to the actual file system.
        BrowserFS.initialize(new BrowserFS.FileSystem.InMemory());

        // Create a new admin connection.
        const adminConnection = new AdminConnection({ fs: bfs_fs });

        // Create a new connection profile that uses the embedded (in-memory) runtime.
        return adminConnection.createProfile('defaultProfile', { type : 'embedded' })
            .then(() => {

                // Establish an admin connection. The user ID must be admin. The user secret is
                // ignored, but only when the tests are executed using the embedded (in-memory)
                // runtime.
                return adminConnection.connect('defaultProfile', 'admin', 'adminpw');

            })
            .then(() => {

                // Generate a business network definition from the project directory.
                return BusinessNetworkDefinition.fromDirectory(path.resolve(__dirname, '..'));

            })
            .then((businessNetworkDefinition) => {

                // Deploy and start the business network defined by the business network definition.
                return adminConnection.deploy(businessNetworkDefinition);

            })
            .then(() => {
                // Create and establish a business network connection
                businessNetworkConnection = new BusinessNetworkConnection({ fs: bfs_fs });
                events = [];
                businessNetworkConnection.on('event', (event) => {
                    events.push(event);
                });
                return businessNetworkConnection.connect('defaultProfile', 'digitalcmr-network', 'admin', 'adminpw');

            })
            .then(() => {

                // Get the factory for the business network.
                const factory = businessNetworkConnection.getBusinessNetwork().getFactory();

                // Create the participants.
                const LeasePlan = factory.newResource(NS, 'legalOwnerOrg', 'LeasePlan@email.com');
                LeasePlan.name = 'LeasePlan';
                return businessNetworkConnection.getParticipantRegistry('org.digitalcmr.legalOwnerOrg')
                    .then((participantRegistry) => {
                        participantRegistry.add(LeasePlan);
                    })
                    .catch((error) => {
                        console.log("participant add error")
                    });

            })
            .then(() => {

                // Create the assets.
                const Vehicle1 = factory.newResource(NS, 'Vehicle', '1');
                Vehicle1.owner = factory.newRelationship(NS, 'legalOwner', 'LeasePlan@email.com');
                Vehicle1.frameNumber = '32HSN2321341HS';
                return businessNetworkConnection.getAssetRegistry(NS)
                    .then((assetRegistry) => {
                        assetRegistry.add(Vehicle1);
                    });
            })
            .then(() => {

                // Issue the identities.
                return businessNetworkConnection.issueIdentity('org.digitalcmr.legalOwnerOrg#LeasePlan@email.com', 'LeasePlan')
                    .then((identity) => {
                        LeasePlanIdentity = identity;
                    })
            });

    });

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

    it('LeasePlan can read all of the assets', () => {

        // Use the identity for LeasePlan.
        return useIdentity(LeasePlanIdentity)
            .then(() => {

                // Get the assets.
                return businessNetworkConnection.getAssetRegistry('org.digitalcmr.legalOwnerOrg')
                    .then((assetRegistry) => {
                        return assetRegistry.getAll();

                    });

            })
            .then((assets) => {

                // Validate the assets.
                assets.should.have.lengthOf(2);
                const asset1 = assets[0];
                asset1.owner.getFullyQualifiedIdentifier().should.equal('org.digitalcmr.legalOwnerOrg#LeasePlan@email.com');
                // asset1.value.should.equal('10');
            });

    });

    it('LeasePlan can add an eCMR', () => {

        // Use the identity for Alice.
        return useIdentity(LeasePlanIdentity)
            .then(() => {

                // Create the asset.
                const eCMR = factory.newResource(NS, 'ECMR', '3');
                eCMR.owner = factory.newRelationship(NS, 'legalOwnerOrg', 'LeasePlan@email.com');
                // eCMR.value = '30';

                // Add the asset, then get the asset.
                return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR')
                    .then((assetRegistry) => {
                        return assetRegistry.add(eCMR)
                            .then(() => {
                                return assetRegistry.get('3');
                            });
                    });

            })
            .then((eCMR) => {

                // Validate the asset.
                eCMR.owner.getFullyQualifiedIdentifier().should.equal('org.digitalcmr.legalOwnerOrg#LeasePlan@email.com');
                // eCMR.value.should.equal('30');

            });

    });

    it('LeasePlan can update her assets', () => {

        // Use the identity for Alice.
        return useIdentity(leaseplan1Identity)
            .then(() => {

                // Create the asset.
                const Vehicle1 = factory.newResource(NS, 'Vehicle', '1');
                Vehicle1.owner = factory.newRelationship(NS, 'legalOwnerOrg', 'LeasePlan@email.com');

                // Update the asset, then get the asset.
                return businessNetworkConnection.getAssetRegistry('org.digitalcmr.Vehicle')
                    .then((assetRegistry) => {
                        return assetRegistry.update(Vehicle1)
                            .then(() => {
                                return assetRegistry.get('1');
                            });
                    });

            })
            .then((Vehicle1) => {

                // Validate the asset.
                Vehicle1.owner.getFullyQualifiedIdentifier().should.equal('org.digitalcmr.legalOwnerOrg#LeasePlan@email.com');
                // Vehicle1.value.should.equal('50');

            });

    });

    it('LeasePlan can remove its assets', () => {

        // Use the identity for Alice.
        return useIdentity(LeasePlanIdentity)
            .then(() => {

                // Remove the asset, then test the asset exists.
                return businessNetworkConnection.getAssetRegistry('org.digitalcmr.Vehicle')
                    .then((assetRegistry) => {
                        return assetRegistry.remove('1')
                            .then(() => {
                                return assetRegistry.exists('1');
                            });
                    });

            })
            .should.eventually.be.false;

    });

    // it('LeasePlan can submit a transaction for its assets', () => {
    //
    //     // Use the identity for Alice.
    //     return useIdentity(LeasePlanIdentity)
    //         .then(() => {
    //
    //             // Submit the transaction.
    //             const transaction = factory.newTransaction('org.digitalcmr', 'signEcmr');
    //             transaction.asset = factory.newRelationship('org.digitalcmr', 'Vehicle', '1');
    //             // transaction.newValue = '50';
    //             return businessNetworkConnection.submitTransaction(transaction);
    //
    //         })
    //         .then(() => {
    //
    //             // Get the asset.
    //             return businessNetworkConnection.getAssetRegistry('org.digitalcmr.Vehicle')
    //                 .then((assetRegistry) => {
    //                     return assetRegistry.get('1');
    //                 });
    //
    //         })
    //         .then((Vehicle1) => {
    //
    //             // Validate the asset.
    //             Vehicle1.owner.getFullyQualifiedIdentifier().should.equal('org.digitalcmr.legalOwner#LeasePlan@email.com');
    //             // Vehicle1.value.should.equal('50');
    //
    //             // Validate the events.
    //             events.should.have.lengthOf(1);
    //             const event = events[0];
    //             event.eventId.should.be.a('string');
    //             event.timestamp.should.be.an.instanceOf(Date);
    //             event.asset.getFullyQualifiedIdentifier().should.equal('org.digitalcmr.Vehicle#1');
    //             event.oldValue.should.equal('10');
    //             event.newValue.should.equal('50');
    //
    //         });
    //
    // });

});
