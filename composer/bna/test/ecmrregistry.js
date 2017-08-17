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

describe('digitalcmr', () => {
    // This is the business network connection the tests will use.
    let businessNetworkConnection;
    // This is the factory for creating instances of types.
    let factory;
    // These are the identities.
    const adminIdentity = {'userId': 'admin', 'userSecret': 'adminpw'};
    let legalOwnerIdentity;
    let compoundIdentity;
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
        address.longitude = 50.5;
        address.latitude = 50.5;

        return address;
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
        ecmr.loading.date = 0;
        ecmr.delivery = factory.newConcept(namespace, 'Delivery');
        ecmr.delivery.address = buildAddress();
        ecmr.delivery.date = 0;
        ecmr.owner = factory.newRelationship(namespace, 'LegalOwnerOrg', 'leaseplan');
        ecmr.source = factory.newRelationship(namespace, 'CompoundOrg', 'amsterdamcompound');
        ecmr.transporter = factory.newRelationship(namespace, 'CarrierMember', 'trasporter');
        ecmr.carrier = factory.newRelationship(namespace, 'CarrierOrg', 'carrier');
        ecmr.recipientOrg = factory.newRelationship(namespace, 'RecipientOrg', 'recipientOrg');
        ecmr.recipient = factory.newRelationship(namespace, 'RecipientMember', 'recipient');
        ecmr.issuedBy = factory.newRelationship(namespace, 'Entity', 'issuedBy');
        ecmr.issueDate = 0;
        ecmr.carrierComments = 'comments';
        ecmr.goods = [];
        ecmr.goods[0] = factory.newConcept(namespace, 'Good');
        ecmr.goods[0].vehicle = buildVehicle();
        ecmr.legalOwnerInstructions = 'instructions';
        ecmr.paymentInstructions = 'instructions';
        ecmr.payOnDelivery = 'payondelivery';
        ecmr.status = 'CREATED';

        return ecmr;
    }

    // This is called before all tests are executed
    before(() => {
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
                return adminConnection.connect(connectionProfile, adminIdentity.userId, adminIdentity.userSecret);
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
                return businessNetworkConnection.connect(connectionProfile, networkName, adminIdentity.userId, adminIdentity.userSecret);
            })
            .then(() => {
                // Get the factory for the business network
                factory = businessNetworkConnection.getBusinessNetwork().getFactory();
                // Add some data
                return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR')
                    .then((assetRegistry) => {
                        let ecmr = buildECMR('A1234567890');
                        let ecmrExceptionCompound = buildECMR('B1234567890');
                        ecmrExceptionCompound.source = factory.newRelationship(namespace, 'CompoundOrg', 'assencompound');
                        return assetRegistry.addAll([ecmr, ecmrExceptionCompound]);
                    });
            })
            .then(() => {
                // Get the factory for the business network
                factory = businessNetworkConnection.getBusinessNetwork().getFactory();
                // Create the LegalOwnerAdmin
                const legalOwnerAdmin = factory.newResource(namespace, 'LegalOwnerAdmin', 'lapo@leaseplan.org');
                legalOwnerAdmin.userName = 'lapo';
                legalOwnerAdmin.firstName = 'lapo';
                legalOwnerAdmin.lastName = 'kelkann';
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
                return businessNetworkConnection.issueIdentity('org.digitalcmr.LegalOwnerAdmin#lapo@leaseplan.org', 'lapo')
                    .then((identity) => {
                        legalOwnerIdentity = identity;
                    });
            })
            .then(() => {
                // Create the CompoundAdmin
                const compoundAdmin = factory.newResource(namespace, 'CompoundAdmin', 'willem@compoundcompany.org');
                compoundAdmin.userName = 'willem';
                compoundAdmin.firstName = 'willem';
                compoundAdmin.lastName = 'compy';
                compoundAdmin.address = buildAddress();
                compoundAdmin.org = factory.newRelationship(namespace, 'CompoundOrg', 'amsterdamcompound');

                // Add participant to the registry
                return businessNetworkConnection.getParticipantRegistry('org.digitalcmr.CompoundAdmin')
                    .then((participantRegistry) => {
                        participantRegistry.add(compoundAdmin);
                    })
                    .catch((error) => {
                        console.log('participant add error: ' + error);
                    });
            })
            .then(() => {
                // Issue the identity of the participant
                return businessNetworkConnection.issueIdentity('org.digitalcmr.CompoundAdmin#willem@compoundcompany.org', 'willem')
                    .then((identity) => {
                        compoundIdentity = identity;
                    });
            });
    });


    it('LegalOwner can CREATE and READ pre-eCMR only if his organization is the owner', () => {
        // Use the identity for LegalOwner
        return connectAs(legalOwnerIdentity)
            .then(() => {
                // Get the assets
                return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR')
                    .then((assetRegistry) => {
                        let ecmr = buildECMR('C1234567890');
                        let ecmrExceptionCompound = buildECMR('C1234567890');
                        ecmrExceptionCompound.source = factory.newRelationship(namespace, 'CompoundOrg', 'assencompound');
                        return assetRegistry.add(ecmr)
                            .then(() => {
                                return assetRegistry.get('C1234567890');
                            });
                    });
            })
            .then((asset) => {
                // Validate the result
                asset.owner.getFullyQualifiedIdentifier().should.equal('org.digitalcmr.LegalOwnerOrg#leaseplan');
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
            });
    });

    it('LegalOwner cannot CREATE/READ pre-eCMR if his organization is NOT the owner', () => {
        // Use the identity for LegalOwner
        return connectAs(legalOwnerIdentity)
            .then(() => {
                // Get the assets
                return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR')
                    .then((assetRegistry) => {
                        let ecmr = buildECMR('A1234567890');
                        ecmr.owner = factory.newRelationship(namespace, 'LegalOwnerOrg', 'not_leaseplan');
                        return assetRegistry.add(ecmr)
                            .then(() => {
                                return assetRegistry.get('A1234567890');
                            });
                    });
            })
            .should.be.rejectedWith(/does not have .* access to resource/);
    });

    it('CompoundAdmin can READ eCMR only if his organization is the source', () => {
        // Use the identity for CompoundAdmin
        return connectAs(compoundIdentity)
            .then(() => {
                // Get the assets
                return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR')
                    .then((assetRegistry) => {
                        return assetRegistry.get('A1234567890');
                    });
            })
            .then((asset) => {
                // Validate the result
                asset.source.getFullyQualifiedIdentifier().should.equal('org.digitalcmr.CompoundOrg#amsterdamcompound');
            });
    });

    it('CompoundAdmin cannot READ eCMR if his organization is NOT the source', () => {
        // Use the identity for CompoundAdmin
        return connectAs(compoundIdentity)
            .then(() => {
                // Get the assets
                return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR')
                    .then((assetRegistry) => {
                        return assetRegistry.get('C1234567890');
                    });
            })
            .should.be.rejectedWith(/does not have .* access to resource/);
    });

    it('CompoundAdmin can CREATE UpdateECMR method and UPDATE and ECMR only if the status is LOADED', () => {
        // Use the identity for CompoundAdmin
        return connectAs(compoundIdentity)
            .then(() => {
                const transaction = factory.newTransaction(namespace, 'UpdateECMR');
                transaction.ecmr = buildECMR('A1234567890');
                transaction.ecmr.status = 'LOADED';
                return businessNetworkConnection.submitTransaction(transaction);
            })
            .then(() => {
                // Get the assets
                return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR')
                    .then((assetRegistry) => {
                        return assetRegistry.get('A1234567890');
                    });
            })
            .then((asset) => {
                // Validate the result
                asset.source.getFullyQualifiedIdentifier().should.equal('org.digitalcmr.CompoundOrg#amsterdamcompound');
                asset.status.should.equal('LOADED');
            });
    });

    // it('LeasePlan can READ her assets', () => {
    //     // Use the identity for Alice.
    //     return useIdentity('alice')
    //         .then(() => {
    //             // Create the asset.
    //             const Vehicle1 = factory.newResource(namespace, 'Vehicle', '1');
    //             Vehicle1.manufacturer = factory.newRelationship(namespace, 'legalOwnerOrg', 'LeasePlan@email.com');
    //
    //             // Update the asset, then get the asset.
    //             return businessNetworkConnection.getAssetRegistry('org.digitalcmr.Vehicle')
    //                 .then((assetRegistry) => {
    //                     return assetRegistry.update(Vehicle1)
    //                         .then(() => {
    //                             return assetRegistry.get('1');
    //                         });
    //                 });
    //         })
    //         .then((Vehicle1) => {
    //             // Validate the asset.
    //             Vehicle1.owner.getFullyQualifiedIdentifier().should.equal('org.digitalcmr.legalOwnerOrg#LeasePlan@email.com');
    //             // Vehicle1.value.should.equal('50');
    //         });
    // });

    // it('LeasePlan can remove its assets', () => {
    //     // Use the identity for Alice.
    //     return useIdentity(LeasePlanIdentity)
    //         .then(() => {
    //             // Remove the asset, then test the asset exists.
    //             return businessNetworkConnection.getAssetRegistry('org.digitalcmr.Vehicle')
    //                 .then((assetRegistry) => {
    //                     return assetRegistry.remove('1')
    //                         .then(() => {
    //                             return assetRegistry.exists('1');
    //                         });
    //                 });
    //         })
    //         .should.eventually.be.false;
    // });

});
