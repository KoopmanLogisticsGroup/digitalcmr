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
const NS = 'org.digitalcmr'

describe('digitalcmr', () => {
    // This is the business network connection the tests will use.
    let businessNetworkConnection;

    // This is the factory for creating instances of types.
    let factory;

    // These are the identities for Alice and Bob.
    let leaseplan1Identity;
    let leaseplan2Identity;

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
                const Leaseplan1 = factory.newResource(NS, 'LeasePlan', 'leaseplan1@email.com');
                Leaseplan1.name = 'leaseplan1';
                const Leaseplan2 = factory.newResource(NS, 'LeasePlan', 'leaseplan2@email.com');
                Leaseplan2.name = 'leaseplan2';
                return businessNetworkConnection.getParticipantRegistry('org.digitalcmr.LeasePlan')
                    .then((participantRegistry) => {
                        participantRegistry.add(Leaseplan1, Leaseplan2);
                    })
                    .catch((error) => {
                        console.log("participant add error")
                    });

            })
            .then(() => {

                // Create the assets.
                const Vehicle = factory.newResource('org.digitalcmr', 'Vehicle', '1');
                Vehicle.owner = factory.newRelationship('org.digitalcmr', 'LeasePlan', 'leaseplan1@email.com');
                Vehicle.vinNumber = '32HSN2321341HS';
                return businessNetworkConnection.getAssetRegistry('org.digitalcmr')
                    .then((assetRegistry) => {
                        assetRegistry.add(Vehicle);
                    });
            })
            .then(() => {

                // Issue the identities.
                return businessNetworkConnection.issueIdentity('org.digitalcmr.LeasePlan#leaseplan1@email.com', 'leaseplan1')
                    .then((identity) => {
                        leaseplan1Identity = identity;
                        return businessNetworkConnection.issueIdentity('org.digitalcmr.LeasePlan#leaseplan2@email.com', 'leaseplan2');
                    })
                    .then((identity) => {
                        leaseplan2Identity = identity;
                    });

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

    it('Leaseplan1 can read all of the assets', () => {

        // Use the identity for Leaseplan1.
        return useIdentity(leaseplan1Identity)
            .then(() => {

                // Get the assets.
                return businessNetworkConnection.getAssetRegistry('org.digitalcmr.LeasePlan')
                    .then((assetRegistry) => {
                        return assetRegistry.getAll();

                    });

            })
            .then((assets) => {

                // Validate the assets.
                assets.should.have.lengthOf(2);
                const asset1 = assets[0];
                asset1.owner.getFullyQualifiedIdentifier().should.equal('org.digitalcmr.LeasePlan#leaseplan1@email.com');
                asset1.value.should.equal('10');
                const asset2 = assets[1];
                asset2.owner.getFullyQualifiedIdentifier().should.equal('org.digitalcmr.LeasePlan#leaseplan2@email.com');
                asset2.value.should.equal('20');

            });

    });

    it('Leaseplan2 can read all of the assets', () => {

        // Use the identity for Bob.
        return useIdentity(leaseplan2Identity)
            .then(() => {

                // Get the assets.
                return businessNetworkConnection.getAssetRegistry('org.digitalcmr.LeasePlan')
                    .then((assetRegistry) => {
                        return assetRegistry.getAll();

                    });

            })
            .then((assets) => {

                // Validate the assets.
                assets.should.have.lengthOf(2);
                const asset1 = assets[0];
                asset1.owner.getFullyQualifiedIdentifier().should.equal('org.digitalcmr.LeasePlan#leaseplan1@email.com');
                asset1.value.should.equal('10');
                const asset2 = assets[1];
                asset2.owner.getFullyQualifiedIdentifier().should.equal('org.digitalcmr.LeasePlan#leaseplan2@email.com');
                asset2.value.should.equal('20');

            });

    });

    it('Leaseplan1 can add an eCMR', () => {

        // Use the identity for Alice.
        return useIdentity(leaseplan1Identity)
            .then(() => {

                // Create the asset.
                const eCMR = factory.newResource('org.digitalcmr', 'Ecmr', '3');
                eCMR.owner = factory.newRelationship('org.digitalcmr', 'LeasePlan', 'leaseplan1@email.com');
                // eCMR.value = '30';

                // Add the asset, then get the asset.
                return businessNetworkConnection.getAssetRegistry('org.digitalcmr.Ecmr')
                    .then((assetRegistry) => {
                        return assetRegistry.add(eCMR)
                            .then(() => {
                                return assetRegistry.get('3');
                            });
                    });

            })
            .then((eCMR) => {

                // Validate the asset.
                eCMR.owner.getFullyQualifiedIdentifier().should.equal('org.digitalcmr.LeasePlan#leaseplan1@email.com');
                // eCMR.value.should.equal('30');

            });

    });

    it('Leaseplan1 can update her assets', () => {

        // Use the identity for Alice.
        return useIdentity(leaseplan1Identity)
            .then(() => {

                // Create the asset.
                const asset1 = factory.newResource('org.acme.sample', 'SampleAsset', '1');
                asset1.owner = factory.newRelationship('org.acme.sample', 'SampleParticipant', 'alice@email.com');
                asset1.value = '50';

                // Update the asset, then get the asset.
                return businessNetworkConnection.getAssetRegistry('org.acme.sample.SampleAsset')
                    .then((assetRegistry) => {
                        return assetRegistry.update(asset1)
                            .then(() => {
                                return assetRegistry.get('1');
                            });
                    });

            })
            .then((asset1) => {

                // Validate the asset.
                asset1.owner.getFullyQualifiedIdentifier().should.equal('org.acme.sample.SampleParticipant#alice@email.com');
                asset1.value.should.equal('50');

            });

    });

    it('Alice cannot update Bob\'s assets', () => {

        // Use the identity for Alice.
        return useIdentity(aliceIdentity)
            .then(() => {

                // Create the asset.
                const asset2 = factory.newResource('org.acme.sample', 'SampleAsset', '2');
                asset2.owner = factory.newRelationship('org.acme.sample', 'SampleParticipant', 'bob@email.com');
                asset2.value = '50';

                // Update the asset, then get the asset.
                return businessNetworkConnection.getAssetRegistry('org.acme.sample.SampleAsset')
                    .then((assetRegistry) => {
                        return assetRegistry.update(asset2);
                    });

            })
            .should.be.rejectedWith(/does not have .* access to resource/);

    });

    it('Bob can update his assets', () => {

        // Use the identity for Bob.
        return useIdentity(bobIdentity)
            .then(() => {

                // Create the asset.
                const asset2 = factory.newResource('org.acme.sample', 'SampleAsset', '2');
                asset2.owner = factory.newRelationship('org.acme.sample', 'SampleParticipant', 'bob@email.com');
                asset2.value = '60';

                // Update the asset, then get the asset.
                return businessNetworkConnection.getAssetRegistry('org.acme.sample.SampleAsset')
                    .then((assetRegistry) => {
                        return assetRegistry.update(asset2)
                            .then(() => {
                                return assetRegistry.get('2');
                            });
                    });

            })
            .then((asset2) => {

                // Validate the asset.
                asset2.owner.getFullyQualifiedIdentifier().should.equal('org.acme.sample.SampleParticipant#bob@email.com');
                asset2.value.should.equal('60');

            });

    });

    it('Bob cannot update Alice\'s assets', () => {

        // Use the identity for Bob.
        return useIdentity(bobIdentity)
            .then(() => {

                // Create the asset.
                const asset1 = factory.newResource('org.acme.sample', 'SampleAsset', '1');
                asset1.owner = factory.newRelationship('org.acme.sample', 'SampleParticipant', 'alice@email.com');
                asset1.value = '60';

                // Update the asset, then get the asset.
                return businessNetworkConnection.getAssetRegistry('org.acme.sample.SampleAsset')
                    .then((assetRegistry) => {
                        return assetRegistry.update(asset1);
                    });

            })
            .should.be.rejectedWith(/does not have .* access to resource/);

    });

    it('Alice can remove her assets', () => {

        // Use the identity for Alice.
        return useIdentity(aliceIdentity)
            .then(() => {

                // Remove the asset, then test the asset exists.
                return businessNetworkConnection.getAssetRegistry('org.acme.sample.SampleAsset')
                    .then((assetRegistry) => {
                        return assetRegistry.remove('1')
                            .then(() => {
                                return assetRegistry.exists('1');
                            });
                    });

            })
            .should.eventually.be.false;

    });

    it('Alice cannot remove Bob\'s assets', () => {

        // Use the identity for Alice.
        return useIdentity(aliceIdentity)
            .then(() => {

                // Remove the asset, then test the asset exists.
                return businessNetworkConnection.getAssetRegistry('org.acme.sample.SampleAsset')
                    .then((assetRegistry) => {
                        return assetRegistry.remove('2');
                    });

            })
            .should.be.rejectedWith(/does not have .* access to resource/);

    });

    it('Bob can remove his assets', () => {

        // Use the identity for Bob.
        return useIdentity(bobIdentity)
            .then(() => {

                // Remove the asset, then test the asset exists.
                return businessNetworkConnection.getAssetRegistry('org.acme.sample.SampleAsset')
                    .then((assetRegistry) => {
                        return assetRegistry.remove('2')
                            .then(() => {
                                return assetRegistry.exists('2');
                            });
                    });

            })
            .should.eventually.be.false;

    });

    it('Bob cannot remove Alice\'s assets', () => {

        // Use the identity for Bob.
        return useIdentity(bobIdentity)
            .then(() => {

                // Remove the asset, then test the asset exists.
                return businessNetworkConnection.getAssetRegistry('org.acme.sample.SampleAsset')
                    .then((assetRegistry) => {
                        return assetRegistry.remove('1');
                    });

            })
            .should.be.rejectedWith(/does not have .* access to resource/);

    });

    it('Alice can submit a transaction for her assets', () => {

        // Use the identity for Alice.
        return useIdentity(aliceIdentity)
            .then(() => {

                // Submit the transaction.
                const transaction = factory.newTransaction('org.acme.sample', 'SampleTransaction');
                transaction.asset = factory.newRelationship('org.acme.sample', 'SampleAsset', '1');
                transaction.newValue = '50';
                return businessNetworkConnection.submitTransaction(transaction);

            })
            .then(() => {

                // Get the asset.
                return businessNetworkConnection.getAssetRegistry('org.acme.sample.SampleAsset')
                    .then((assetRegistry) => {
                        return assetRegistry.get('1');
                    });

            })
            .then((asset1) => {

                // Validate the asset.
                asset1.owner.getFullyQualifiedIdentifier().should.equal('org.acme.sample.SampleParticipant#alice@email.com');
                asset1.value.should.equal('50');

                // Validate the events.
                events.should.have.lengthOf(1);
                const event = events[0];
                event.eventId.should.be.a('string');
                event.timestamp.should.be.an.instanceOf(Date);
                event.asset.getFullyQualifiedIdentifier().should.equal('org.acme.sample.SampleAsset#1');
                event.oldValue.should.equal('10');
                event.newValue.should.equal('50');

            });

    });

    it('Alice cannot submit a transaction for Bob\'s assets', () => {

        // Use the identity for Alice.
        return useIdentity(aliceIdentity)
            .then(() => {

                // Submit the transaction.
                const transaction = factory.newTransaction('org.acme.sample', 'SampleTransaction');
                transaction.asset = factory.newRelationship('org.acme.sample', 'SampleAsset', '2');
                transaction.newValue = '50';
                return businessNetworkConnection.submitTransaction(transaction);

            })
            .should.be.rejectedWith(/does not have .* access to resource/);

    });

    it('Bob can submit a transaction for his assets', () => {

        // Use the identity for Bob.
        return useIdentity(bobIdentity)
            .then(() => {

                // Submit the transaction.
                const transaction = factory.newTransaction('org.acme.sample', 'SampleTransaction');
                transaction.asset = factory.newRelationship('org.acme.sample', 'SampleAsset', '2');
                transaction.newValue = '60';
                return businessNetworkConnection.submitTransaction(transaction);

            })
            .then(() => {

                // Get the asset.
                return businessNetworkConnection.getAssetRegistry('org.acme.sample.SampleAsset')
                    .then((assetRegistry) => {
                        return assetRegistry.get('2');
                    });

            })
            .then((asset2) => {

                // Validate the asset.
                asset2.owner.getFullyQualifiedIdentifier().should.equal('org.acme.sample.SampleParticipant#bob@email.com');
                asset2.value.should.equal('60');

                // Validate the events.
                events.should.have.lengthOf(1);
                const event = events[0];
                event.eventId.should.be.a('string');
                event.timestamp.should.be.an.instanceOf(Date);
                event.asset.getFullyQualifiedIdentifier().should.equal('org.acme.sample.SampleAsset#2');
                event.oldValue.should.equal('20');
                event.newValue.should.equal('60');

            });

    });

    it('Bob cannot submit a transaction for Alice\'s assets', () => {

        // Use the identity for Bob.
        return useIdentity(bobIdentity)
            .then(() => {

                // Submit the transaction.
                const transaction = factory.newTransaction('org.acme.sample', 'SampleTransaction');
                transaction.asset = factory.newRelationship('org.acme.sample', 'SampleAsset', '1');
                transaction.newValue = '60';
                return businessNetworkConnection.submitTransaction(transaction);

            })
            .should.be.rejectedWith(/does not have .* access to resource/);

    });

});
