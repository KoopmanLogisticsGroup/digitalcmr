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

// 'use strict';
// const AdminConnection = require('composer-admin').AdminConnection;
// const BrowserFS = require('browserfs/dist/node/index');
// const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
// const BusinessNetworkDefinition = require('composer-common').BusinessNetworkDefinition;
// const path = require('path');
// const chai = require('chai');
// const should = require('chai').should();
// chai.use(require('chai-as-promised'));
// const bfs_fs = BrowserFS.BFSRequire('fs');
// const BusinessModel = require('./common/businessModel');
// let Builder = require('./common/builder');
// let Network = require('./common/network');
// let Identity = require('./common/identityManager');
//
// describe('Admin of the network', () => {
//   // This is the business network connection the tests will use.
//   let businessNetworkConnection;
//   // This is the factory for creating instances of types.
//   let factory;
//   // These are a list of received events.
//   let events;
//
//   let builder;
//   Network = new Network();
//   Identity = new Identity();
//
//   let ecmrList = [];
//
//   // This is called before all tests are executed
//   beforeEach(() => {
//     // Initialize an in-memory file system, so we do not write any files to the actual file system
//     BrowserFS.initialize(new BrowserFS.FileSystem.InMemory());
//     // Create a new admin connection.
//     const adminConnection = new AdminConnection({fs: bfs_fs});
//
//     // Create a new connection profile that uses the embedded (in-memory) runtime
//     return adminConnection.createProfile(Network.connectionProfile, {type: 'embedded'})
//       .then(() => {
//         // Establish an admin connection. The user ID must be admin. The user secret is
//         // ignored, but only when the tests are executed using the embedded (in-memory)
//         // runtime.
//         return adminConnection.connect(Network.connectionProfile, Identity.users.admin.userID, Identity.users.admin.userSecret);
//       })
//       .then(() => {
//         // Generate a business network definition from the project directory.
//         return BusinessNetworkDefinition.fromDirectory(path.resolve(__dirname, '..'));
//       })
//       .then((businessNetworkDefinition) => {
//         // Deploy and start the business network defined by the business network definition
//         return adminConnection.deploy(businessNetworkDefinition);
//       })
//       .then(() => {
//         // Create and establish a business network connection
//         businessNetworkConnection = new BusinessNetworkConnection({fs: bfs_fs});
//         events = [];
//         businessNetworkConnection.on('event', (event) => {
//           events.push(event);
//         });
//         return businessNetworkConnection.connect(Network.connectionProfile, Network.networkName, Identity.users.admin.userID, Identity.users.admin.userSecret);
//       })
//       .then(() => {
//         // Get the factory for the business network
//         factory = businessNetworkConnection.getBusinessNetwork().getFactory();
//         builder = new Builder(factory);
//
//         // Create the CarrierMember
//         const carrierMember = factory.newResource(Network.namespace, 'CarrierMember', Identity.users.carrierMember.userID);
//         carrierMember.userName = 'harry';
//         carrierMember.firstName = 'Harry';
//         carrierMember.lastName = 'Smith';
//         carrierMember.address = builder.buildAddress();
//         carrierMember.org = factory.newRelationship(Network.namespace, 'CarrierOrg', 'koopman');
//
//         // Add participant to the registry
//         return businessNetworkConnection.getParticipantRegistry(Network.namespace + '.CarrierMember')
//           .then((participantRegistry) => {
//             participantRegistry.addAll([carrierMember]);
//           })
//           .catch((error) => {
//             console.log('participant carrier member add error: ' + error);
//           });
//       })
//       .then(() => {
//         // Issue the identity of the carrier member
//         return businessNetworkConnection.issueIdentity(Network.namespace + '.CarrierMember#' + Identity.users.carrierMember.userID, Identity.users.carrierMember.userID)
//           .then((identity) => {
//             Identity.users.carrierMember = identity;
//           })
//           .catch((error) => {
//             console.log('issue identity error: ' + error);
//           });
//       })
//       // prepare the test environment
//       .then(() => {
//         let ecmr = builder.buildECMR('created');
//         ecmr.orderID = 'to_create_ecmrs';
//         ecmr.goods = [builder.buildGood('vin1')];
//         ecmrList.push(ecmr);
//
//         ecmr = builder.buildECMR('loaded');
//         ecmr.status = BusinessModel.ecmrStatus.Loaded;
//         ecmr.compoundSignature = builder.buildSignature(Identity.users.compoundAdmin.userID);
//         ecmrList.push(ecmr);
//
//         ecmr = builder.buildECMR('in_transit');
//         ecmr.status = BusinessModel.ecmrStatus.InTransit;
//         ecmr.compoundSignature = builder.buildSignature(Identity.users.compoundAdmin.userID);
//         ecmr.carrierLoadingSignature = builder.buildSignature(Identity.users.carrierMember.userID);
//         ecmrList.push(ecmr);
//
//         ecmr = builder.buildECMR('loaded_without_compound_signature');
//         ecmr.status = BusinessModel.ecmrStatus.Loaded;
//         ecmrList.push(ecmr);
//
//         ecmr = builder.buildECMR('in_transit_without_compound_signature');
//         ecmr.status = BusinessModel.ecmrStatus.InTransit;
//         ecmr.carrierLoadingSignature = builder.buildSignature(Identity.users.carrierMember.userID);
//         ecmrList.push(ecmr);
//
//         ecmr = builder.buildECMR('in_transit_without_transporter_signature');
//         ecmr.status = BusinessModel.ecmrStatus.InTransit;
//         ecmr.compoundSignature = builder.buildSignature(Identity.users.compoundAdmin.userID);
//         ecmrList.push(ecmr);
//
//         ecmr = builder.buildECMR('delivered_without_compound_signature');
//         ecmr.status = BusinessModel.ecmrStatus.Delivered;
//         ecmr.carrierLoadingSignature = builder.buildSignature(Identity.users.carrierMember.userID);
//         ecmr.carrierDeliverySignature = builder.buildSignature(Identity.users.carrierMember.userID);
//         ecmrList.push(ecmr);
//
//         ecmr = builder.buildECMR('delivered_without_carrier_loading_signature');
//         ecmr.status = BusinessModel.ecmrStatus.Delivered;
//         ecmr.compoundSignature = builder.buildSignature(Identity.users.compoundAdmin.userID);
//         ecmr.carrierDeliverySignature = builder.buildSignature(Identity.users.carrierMember.userID);
//         ecmrList.push(ecmr);
//
//         ecmr = builder.buildECMR('delivered_without_carrier_delivery_signature');
//         ecmr.status = BusinessModel.ecmrStatus.Delivered;
//         ecmr.compoundSignature = builder.buildSignature(Identity.users.compoundAdmin.userID);
//         ecmr.carrierLoadingSignature = builder.buildSignature(Identity.users.carrierMember.userID);
//         ecmrList.push(ecmr);
//
//         ecmr = builder.buildECMR('delivered_good');
//         ecmr.compoundSignature = builder.buildSignature(Identity.users.compoundAdmin.userID);
//         ecmr.carrierLoadingSignature = builder.buildSignature(Identity.users.carrierMember.userID);
//         ecmr.carrierDeliverySignature = builder.buildSignature(Identity.users.carrierMember.userID);
//         ecmr.status = BusinessModel.ecmrStatus.Delivered;
//         ecmr.goods = [builder.buildGood('vin1')];
//         ecmrList.push(ecmr);
//
//         ecmr = builder.buildECMR('delivered_bad');
//         ecmr.compoundSignature = builder.buildSignature(Identity.users.compoundAdmin.userID);
//         ecmr.carrierLoadingSignature = builder.buildSignature(Identity.users.carrierMember.userID);
//         ecmr.carrierDeliverySignature = builder.buildSignature(Identity.users.carrierMember.userID);
//         ecmr.status = BusinessModel.ecmrStatus.Delivered;
//         ecmr.goods = [builder.buildGood('vin2')];
//         ecmrList.push(ecmr);
//
//         return businessNetworkConnection.getAssetRegistry(Network.namespace + '.ECMR')
//           .then((assetRegistry) => {
//             return assetRegistry.addAll(ecmrList);
//           }).catch((error) => {
//             throw new Error('An error occurred while adding all the ecmrs to the registry: ' + error);
//           });
//       })
//       .then(() => {
//         const transportOrders = [builder.buildTransportOrder('to_create_ecmrs'), builder.buildTransportOrder('to_set_completed'), builder.buildTransportOrder('not_to_set_completed')];
//         transportOrders[0].ecmrs = [factory.newRelationship(Network.namespace, 'ECMR', 'created')];
//         transportOrders[0].goods = [builder.buildGood('vin2'), builder.buildGood('vin1')];
//         // testing with 2 ecmrs with same vehicles IDs but inverted order
//         transportOrders[1].ecmrs = [factory.newRelationship(Network.namespace, 'ECMR', 'delivered_good')];
//         transportOrders[1].goods = [builder.buildGood('vin1')];
//         // testing with 2 ecmrs with same number of vehicles and different vehicle IDs
//         transportOrders[2].ecmrs = [factory.newRelationship(Network.namespace, 'ECMR', 'delivered_bad')];
//         transportOrders[2].ecmrs.push(factory.newRelationship(Network.namespace, 'ECMR', 'delivered_good'));
//         transportOrders[2].goods = [builder.buildGood('vin1'), builder.buildGood('vin3')];
//
//         return businessNetworkConnection.getAssetRegistry(Network.namespace + '.TransportOrder')
//           .then((assetRegistry) => {
//             return assetRegistry.addAll(transportOrders);
//           }).catch((error) => {
//             throw new Error('An error occurred while adding all the orders to the registry: ' + error);
//           });
//       })
//       .then(() => {
//         const vehicles = [builder.buildVehicle('vin1'), builder.buildVehicle('vin2'), builder.buildVehicle('vin3')];
//
//         return businessNetworkConnection.getAssetRegistry(Network.namespace + '.Vehicle')
//           .then((assetRegistry) => {
//             return assetRegistry.addAll(vehicles);
//           }).catch((error) => {
//             throw new Error('An error occurred while adding all the vehicles to the registry: ' + error);
//           });
//       });
//   });
//
//   it('should be able to submit CreateECMRs transaction which creates an ECMR starting from a TransportOrder and sets status to CREATED', () => {
//     const transaction = factory.newTransaction(Network.namespace, 'CreateECMRs');
//     let currentEcmr = builder.buildECMR('newEcmr');
//     currentEcmr.goods = [builder.buildGood('vin1'), builder.buildGood('vin2')];
//     transaction.ecmrs = [currentEcmr];
//     transaction.transportOrder = factory.newRelationship(Network.namespace, 'TransportOrder', 'to_create_ecmrs');
//
//     return businessNetworkConnection.submitTransaction(transaction)
//       .then(() => {
//         return businessNetworkConnection.getAssetRegistry(Network.namespace + '.ECMR');
//       })
//       .then((assetRegistry) => {
//         return assetRegistry.get(transaction.ecmrs[0].getIdentifier());
//       })
//       // ecmr should exist
//       .then((ecmr) => {
//         currentEcmr = ecmr;
//         ecmr.orderID.should.equal('to_create_ecmrs');
//       })
//       // transportOrder should be updated
//       .then(() => {
//         return businessNetworkConnection.getAssetRegistry(Network.namespace + '.TransportOrder');
//       })
//       .then((assetRegistry) => {
//         return assetRegistry.get(currentEcmr.orderID);
//       })
//       .then((transportOrder) => {
//         transportOrder.status.should.equal(BusinessModel.orderStatus.InProgress);
//       })
//       // all the vin into the ecmr should have a reference to the ecmr
//       .then(() => {
//         return businessNetworkConnection.getAssetRegistry(Network.namespace + '.Vehicle');
//       })
//       .then((assetRegistry) => {
//         return assetRegistry.get(currentEcmr.goods[0].vehicle.getIdentifier());
//       })
//       .then((vehicle) => {
//         should.exist(vehicle.ecmrs.find(ecmr => ecmr.getIdentifier() === currentEcmr.ecmrID));
//       })
//       .then(() => {
//         return businessNetworkConnection.getAssetRegistry(Network.namespace + '.Vehicle');
//       })
//       .then((assetRegistry) => {
//         return assetRegistry.get(currentEcmr.goods[1].vehicle.getIdentifier());
//       })
//       .then((vehicle) => {
//         should.exist(vehicle.ecmrs.find(ecmr => ecmr.getIdentifier() === currentEcmr.ecmrID));
//       })
//   });
//
//   it('should be able to submit CreateECMRs which creates multiple ECMRs starting from a TransportOrder', () => {
//     var currentEcmrs = [builder.buildECMR('1'), builder.buildECMR('2')];
//     currentEcmrs[0].goods = [builder.buildGood('vin1')];
//     currentEcmrs[1].goods = [builder.buildGood('vin2')];
//     const transaction = factory.newTransaction(Network.namespace, 'CreateECMRs');
//     transaction.ecmrs = currentEcmrs;
//     transaction.transportOrder = factory.newRelationship(Network.namespace, 'TransportOrder', 'to_create_ecmrs');
//
//     return businessNetworkConnection.submitTransaction(transaction)
//       .then(() => {
//         return businessNetworkConnection.getAssetRegistry(Network.namespace + '.ECMR');
//       })
//       .then((assetRegistry) => {
//         return assetRegistry.getAll();
//       })
//       .then((ecmrs) => {
//         currentEcmrs = ecmrs;
//         should.exist(currentEcmrs.find(ecmr => (ecmr.ecmrID === currentEcmrs[0].ecmrID && ecmr.orderID === currentEcmrs[0].orderID)));
//         should.exist(currentEcmrs.find(ecmr => (ecmr.ecmrID === currentEcmrs[1].ecmrID && ecmr.orderID === currentEcmrs[1].orderID)));
//       })
//       // transportOrder should be updated
//       .then(() => {
//         return businessNetworkConnection.getAssetRegistry(Network.namespace + '.TransportOrder');
//       })
//       .then((assetRegistry) => {
//         return assetRegistry.get(currentEcmrs[0].orderID);
//       })
//       .then((transportOrder) => {
//         transportOrder.status.should.equal(BusinessModel.orderStatus.InProgress);
//       })
//       // all the vin into the ecmr should have a reference to the ecmr
//       .then(() => {
//         return businessNetworkConnection.getAssetRegistry(Network.namespace + '.Vehicle');
//       })
//       .then((assetRegistry) => {
//         return assetRegistry.get(currentEcmrs[0].goods[0].vehicle.getIdentifier());
//       })
//       .then((vehicle) => {
//         should.exist(vehicle.ecmrs.find(ecmr => ecmr.getIdentifier() === currentEcmrs[0].ecmrID));
//       })
//       // all the vin into the ecmr should have a reference to the ecmr
//       .then(() => {
//         return businessNetworkConnection.getAssetRegistry(Network.namespace + '.Vehicle');
//       })
//       .then((assetRegistry) => {
//         return assetRegistry.get(currentEcmrs[1].goods[0].vehicle.getIdentifier());
//       })
//       .then((vehicle) => {
//         should.exist(vehicle.ecmrs.find(ecmr => ecmr.getIdentifier() === currentEcmrs[1].ecmrID));
//       });
//   });
//
//   it('should be able to submit UpdateEcmrStatusToLoaded which updates ECMR status from CREATED to LOADED', () => {
//     const transaction = factory.newTransaction(Network.namespace, 'UpdateEcmrStatusToLoaded');
//     transaction.ecmr = factory.newRelationship(Network.namespace, 'ECMR', 'created');
//     transaction.goods = [builder.buildGood('vin1')];
//     transaction.signature = builder.buildSignature(Identity.users.compoundAdmin);
//
//     return businessNetworkConnection.submitTransaction(transaction)
//       // .then(() => {
//       //   return businessNetworkConnection.getAssetRegistry('org.digitalcmr.ECMR')
//       //     .then((assetRegistry) => {
//       //       return assetRegistry.get('created');
//       //     })
//       //     .then((updatedECMR) => {
//       //       updatedECMR.status.should.equal(BusinessModel.ecmrStatus.Loaded);
//       //     });
//       // });
//       .should.be.rejectedWith(/Participant is not authenticated/);
//   });
//
//   it('should be able to submit UpdateEcmrStatusToInTransit which updates ECMR status from LOADED to IN_TRANSIT', () => {
//     const transaction = factory.newTransaction(Network.namespace, 'UpdateEcmrStatusToInTransit');
//     transaction.ecmr = factory.newRelationship(Network.namespace, 'ECMR', 'loaded');
//     transaction.goods = [builder.buildGood('vin1')];
//     transaction.signature = builder.buildSignature(Identity.users.carrierMember);
//
//     return businessNetworkConnection.submitTransaction(transaction)
//       // .then(() => {
//       //   return businessNetworkConnection.getAssetRegistry(Network.namespace + '.ECMR')
//       //     .then((assetRegistry) => {
//       //       return assetRegistry.get('loaded');
//       //     })
//       //     .then((updatedECMR) => {
//       //       updatedECMR.status.should.equal(BusinessModel.ecmrStatus.InTransit);
//       //     });
//       // });
//       .should.be.rejectedWith(/Participant is not authenticated/);
//   });
//
//   it('should be able to submit UpdateEcmrStatusToDelivered which updates ECMR status from IN_TRANSIT to DELIVERED', () => {
//     const transaction = factory.newTransaction(Network.namespace, 'UpdateEcmrStatusToDelivered');
//     transaction.ecmr = factory.newRelationship(Network.namespace, 'ECMR', 'in_transit');
//     transaction.goods = [builder.buildGood('vin1')];
//     transaction.signature = builder.buildSignature(Identity.users.carrierMember);
//     transaction.transportOrder = factory.newRelationship(Network.namespace, 'TransportOrder', 'to_create_ecmrs');
//
//     return businessNetworkConnection.submitTransaction(transaction)
//       // .then(() => {
//       //   return businessNetworkConnection.getAssetRegistry(Network.namespace + '.ECMR')
//       //     .then((assetRegistry) => {
//       //       return assetRegistry.get('in_transit');
//       //     })
//       //     .then((updatedECMR) => {
//       //       updatedECMR.status.should.equal(BusinessModel.ecmrStatus.Delivered);
//       //     });
//       // });
//       .should.be.rejectedWith(/Participant is not authenticated/);
//   });
//
//   it('should be able to submit UpdateEcmrStatusToConfirmedDelivered which updates ECMR status from DELIVERED to CONFIRMED_DELIVERED ' +
//     'and to UPDATE the TransportOrder status to COMPLETED', () => {
//     const transaction = factory.newTransaction(Network.namespace, 'UpdateEcmrStatusToConfirmedDelivered');
//     transaction.ecmr = factory.newRelationship(Network.namespace, 'ECMR', 'delivered_good');
//     transaction.goods = [builder.buildGood('vin1')];
//     transaction.signature = builder.buildSignature(Identity.users.recipientAdmin);
//     transaction.transportOrder = factory.newRelationship(Network.namespace, 'TransportOrder', 'to_set_completed');
//
//     return businessNetworkConnection.submitTransaction(transaction)
//       // .then(() => {
//       //   return businessNetworkConnection.getAssetRegistry(Network.namespace + '.ECMR');
//       // })
//       // .then((assetRegistry) => {
//       //   return assetRegistry.get('delivered_good');
//       // })
//       // .then((updatedECMR) => {
//       //   updatedECMR.status.should.equal(BusinessModel.ecmrStatus.ConfirmedDelivered);
//       // })
//       // .then(() => {
//       //   return businessNetworkConnection.getAssetRegistry(Network.namespace + '.TransportOrder');
//       // })
//       // .then((assetRegistry) => {
//       //   return assetRegistry.get('to_set_completed');
//       // })
//       // .then((transportOrder) => {
//       //   transportOrder.status.should.equal(BusinessModel.orderStatus.Completed);
//       // });
//       .should.be.rejectedWith(/No permissions/);
//   });
//
//   it('should be able to submit UpdateEcmrStatusToConfirmedDelivered which updates ECMR status from DELIVERED to CONFIRMED_DELIVERED ' +
//     'but NOT to UPDATE the TransportOrder status to COMPLETED', () => {
//     const transaction = factory.newTransaction(Network.namespace, 'UpdateEcmrStatusToConfirmedDelivered');
//     transaction.ecmr = factory.newRelationship(Network.namespace, 'ECMR', 'delivered_bad');
//     transaction.goods = [builder.buildGood('vin1')];
//     transaction.signature = builder.buildSignature(Identity.users.recipientAdmin);
//     transaction.transportOrder = factory.newRelationship(Network.namespace, 'TransportOrder', 'not_to_set_completed');
//
//     return businessNetworkConnection.submitTransaction(transaction)
//       // .then(() => {
//       //   return businessNetworkConnection.getAssetRegistry(Network.namespace + '.ECMR');
//       // })
//       // .then((assetRegistry) => {
//       //   return assetRegistry.get('delivered_bad');
//       // })
//       // .then((updatedECMR) => {
//       //   updatedECMR.status.should.equal(BusinessModel.ecmrStatus.ConfirmedDelivered);
//       // })
//       // .then(() => {
//       //   return businessNetworkConnection.getAssetRegistry(Network.namespace + '.TransportOrder');
//       // })
//       // .then((assetRegistry) => {
//       //   return assetRegistry.get('not_to_set_completed');
//       // })
//       // .then((transportOrder) => {
//       //   transportOrder.status.should.equal(BusinessModel.orderStatus.Open);
//       // });
//       .should.be.rejectedWith(/No permissions/);
//   });
//
//   it('should not be able to update ECMR status to IN_TRANSIT when status is not LOADED', () => {
//     const transaction = factory.newTransaction(Network.namespace, 'UpdateEcmrStatusToInTransit');
//     transaction.ecmr = factory.newRelationship(Network.namespace, 'ECMR', 'created');
//     transaction.goods = [builder.buildGood('vin1')];
//     transaction.signature = builder.buildSignature(Identity.users.carrierMember);
//
//     return businessNetworkConnection.submitTransaction(transaction)
//       .should.be.rejectedWith(/Trying to set status IN_TRANSIT to an ECMR with status: CREATED/);
//   });
//
//   it('should not be able to update ECMR status to DELIVERED when status is not IN_TRANSIT', () => {
//     const transaction = factory.newTransaction(Network.namespace, 'UpdateEcmrStatusToDelivered');
//     transaction.ecmr = factory.newRelationship(Network.namespace, 'ECMR', 'loaded');
//     transaction.goods = [builder.buildGood('vin1')];
//     transaction.signature = builder.buildSignature(Identity.users.carrierMember);
//     transaction.transportOrder = factory.newRelationship(Network.namespace, 'TransportOrder', 'to_create_ecmrs');
//
//     return businessNetworkConnection.submitTransaction(transaction)
//       .should.be.rejectedWith(/Trying to set status DELIVERED to an ECMR with status: LOADED/);
//   });
//
//   it('should not be able to update ECMR status to CONFIRMED_DELIVERED when status is not DELIVERED', () => {
//     const transaction = factory.newTransaction(Network.namespace, 'UpdateEcmrStatusToConfirmedDelivered');
//     transaction.ecmr = factory.newRelationship(Network.namespace, 'ECMR', 'in_transit');
//     transaction.goods = [builder.buildGood('vin1')];
//     transaction.signature = builder.buildSignature(Identity.users.carrierMember);
//     transaction.transportOrder = factory.newRelationship(Network.namespace, 'TransportOrder', 'to_create_ecmrs');
//
//     return businessNetworkConnection.submitTransaction(transaction)
//       .should.be.rejectedWith(/No permissions/);
//   });
//
//   it('should not be able to update ECMR status to IN_TRANSIT when status is LOADED without compound signature', () => {
//     const transaction = factory.newTransaction(Network.namespace, 'UpdateEcmrStatusToInTransit');
//     transaction.ecmr = factory.newRelationship(Network.namespace, 'ECMR', 'loaded_without_compound_signature');
//     transaction.goods = [builder.buildGood('vin1')];
//     transaction.signature = builder.buildSignature(Identity.users.carrierMember);
//
//     return businessNetworkConnection.submitTransaction(transaction)
//       .should.be.rejectedWith(/Attempt to set the status on IN_TRANSIT before the compound admin signed/);
//   });
//
//   it('should not be able to update ECMR status to DELIVERED when status is IN_TRANSIT without compound signature', () => {
//     const transaction = factory.newTransaction(Network.namespace, 'UpdateEcmrStatusToDelivered');
//     transaction.ecmr = factory.newRelationship(Network.namespace, 'ECMR', 'in_transit_without_compound_signature');
//     transaction.goods = [builder.buildGood('vin1')];
//     transaction.signature = builder.buildSignature(Identity.users.carrierMember);
//     transaction.transportOrder = factory.newRelationship(Network.namespace, 'TransportOrder', 'to_create_ecmrs');
//
//     return businessNetworkConnection.submitTransaction(transaction)
//       .should.be.rejectedWith(/Attempt to set the status on DELIVERED before the compound admin signed!/);
//   });
//
//   it('should not be able to update ECMR status to DELIVERED when status is IN_TRANSIT without transporter signature', () => {
//     const transaction = factory.newTransaction(Network.namespace, 'UpdateEcmrStatusToDelivered');
//     transaction.ecmr = factory.newRelationship(Network.namespace, 'ECMR', 'in_transit_without_transporter_signature');
//     transaction.goods = [builder.buildGood('vin1')];
//     transaction.signature = builder.buildSignature(Identity.users.carrierMember);
//     transaction.transportOrder = factory.newRelationship(Network.namespace, 'TransportOrder', 'to_create_ecmrs');
//
//     return businessNetworkConnection.submitTransaction(transaction)
//       .should.be.rejectedWith(/Attempt to set the status on DELIVERED before the transporter signed for loading!/);
//   });
//
//   it('should not be able to update ECMR status to CONFIRMED_DELIVERED before compound admin signed', () => {
//     const transaction = factory.newTransaction(Network.namespace, 'UpdateEcmrStatusToConfirmedDelivered');
//     transaction.ecmr = factory.newRelationship(Network.namespace, 'ECMR', 'delivered_without_compound_signature');
//     transaction.goods = [builder.buildGood('vin1')];
//     transaction.signature = builder.buildSignature(Identity.users.carrierMember);
//     transaction.transportOrder = factory.newRelationship(Network.namespace, 'TransportOrder', 'to_create_ecmrs');
//
//     return businessNetworkConnection.submitTransaction(transaction)
//       .should.be.rejectedWith(/No permissions/);
//   });
//
//   it('should not be able to update ECMR status to CONFIRMED_DELIVERED before transporter signed for loading', () => {
//     const transaction = factory.newTransaction(Network.namespace, 'UpdateEcmrStatusToConfirmedDelivered');
//     transaction.ecmr = factory.newRelationship(Network.namespace, 'ECMR', 'delivered_without_carrier_loading_signature');
//     transaction.goods = [builder.buildGood('vin1')];
//     transaction.signature = builder.buildSignature(Identity.users.carrierMember);
//     transaction.transportOrder = factory.newRelationship(Network.namespace, 'TransportOrder', 'to_create_ecmrs');
//
//     return businessNetworkConnection.submitTransaction(transaction)
//       .should.be.rejectedWith(/No permissions/);
//   });
//
//   it('should not be able to update ECMR status to CONFIRMED_DELIVERED before transporter signed for delivery', () => {
//     const transaction = factory.newTransaction(Network.namespace, 'UpdateEcmrStatusToConfirmedDelivered');
//     transaction.ecmr = factory.newRelationship(Network.namespace, 'ECMR', 'delivered_without_carrier_delivery_signature');
//     transaction.goods = [builder.buildGood('vin1')];
//     transaction.signature = builder.buildSignature(Identity.users.carrierMember);
//     transaction.transportOrder = factory.newRelationship(Network.namespace, 'TransportOrder', 'to_create_ecmrs');
//
//     return businessNetworkConnection.submitTransaction(transaction)
//       .should.be.rejectedWith(/No permissions/);
//   });
//
//   it('should be able to submit UpdateECMRStatusToCancelled and cancel an ECMR', () => {
//     let transaction = factory.newTransaction(Network.namespace, 'UpdateECMRStatusToCancelled');
//     transaction.ecmr = factory.newRelationship(Network.namespace, 'ECMR', 'created');
//     transaction.cancellation = factory.newConcept(Network.namespace, 'Cancellation');
//     transaction.cancellation.cancelledBy = factory.newRelationship(Network.namespace, 'Entity', 'pete@koopman.org');
//     transaction.cancellation.date = new Date().getTime();
//     transaction.cancellation.reason = 'one big reason';
//
//     return businessNetworkConnection.submitTransaction(transaction)
//       // .then(() => {
//       //   return businessNetworkConnection.getAssetRegistry(Network.namespace + '.ECMR')
//       //     .then((assetRegistry) => {
//       //       return assetRegistry.get('created');
//       //     })
//       //     .then((updatedECMR) => {
//       //       updatedECMR.status.should.equal(BusinessModel.ecmrStatus.Cancelled);
//       //       updatedECMR.cancellation.should.be.instanceOf(Object);
//       //     });
//       // });
//       .should.be.rejectedWith(/Participant is not authenticated/);
//   });
//
//   it('should be able to update the expectedPickupWindow of an ECMR which status is CREATED', () => {
//     let updateExpectedPickupWindowTransaction = factory.newTransaction(Network.namespace, 'UpdateExpectedPickupWindow');
//     updateExpectedPickupWindowTransaction.ecmr = factory.newRelationship(Network.namespace, 'ECMR', 'created');
//     updateExpectedPickupWindowTransaction.expectedWindow = factory.newConcept(Network.namespace, 'DateWindow');
//     updateExpectedPickupWindowTransaction.expectedWindow.startDate = 1;
//     updateExpectedPickupWindowTransaction.expectedWindow.endDate = 2;
//
//     return businessNetworkConnection.submitTransaction(updateExpectedPickupWindowTransaction)
//       .then(() => {
//         return businessNetworkConnection.getAssetRegistry(Network.namespace + '.ECMR')
//           .then((assetRegistry) => {
//             return assetRegistry.get('created')
//               .then((ecmr) => {
//                 ecmr.loading.expectedWindow.startDate.should.equal(1);
//                 ecmr.loading.expectedWindow.endDate.should.equal(2);
//               }).catch((error) => {
//                 throw error;
//               })
//           }).catch((error) => {
//             throw error;
//           })
//       }).catch((error) => {
//         throw error;
//       });
//   });
//
//   it('should not be able to update the expectedPickupWindow of an ECMR which status is not CREATED', () => {
//     let updateExpectedPickupWindowTransaction = factory.newTransaction(Network.namespace, 'UpdateExpectedPickupWindow');
//     updateExpectedPickupWindowTransaction.ecmr = factory.newRelationship(Network.namespace, 'ECMR', 'loaded');
//     updateExpectedPickupWindowTransaction.expectedWindow = factory.newConcept(Network.namespace, 'DateWindow');
//     updateExpectedPickupWindowTransaction.expectedWindow.startDate = 1;
//     updateExpectedPickupWindowTransaction.expectedWindow.endDate = 2;
//
//     return businessNetworkConnection.submitTransaction(updateExpectedPickupWindowTransaction)
//       .should.be.rejectedWith(/Transaction is not valid/);
//   });
//
//   it('should be able to update the expectedDeliveryWindow of an ECMR which status is IN_TRANSIT', () => {
//     let updateExpectedDeliveryWindowTransaction = factory.newTransaction(Network.namespace, 'UpdateExpectedDeliveryWindow');
//     updateExpectedDeliveryWindowTransaction.ecmr = factory.newRelationship(Network.namespace, 'ECMR', 'in_transit');
//     updateExpectedDeliveryWindowTransaction.expectedWindow = factory.newConcept(Network.namespace, 'DateWindow');
//     updateExpectedDeliveryWindowTransaction.expectedWindow.startDate = 1;
//     updateExpectedDeliveryWindowTransaction.expectedWindow.endDate = 2;
//
//     return businessNetworkConnection.submitTransaction(updateExpectedDeliveryWindowTransaction)
//       .then(() => {
//         return businessNetworkConnection.getAssetRegistry(Network.namespace + '.ECMR')
//           .then((assetRegistry) => {
//             return assetRegistry.get('in_transit')
//               .then((ecmr) => {
//                 ecmr.delivery.expectedWindow.startDate.should.equal(1);
//                 ecmr.delivery.expectedWindow.endDate.should.equal(2);
//               }).catch((error) => {
//                 throw error;
//               })
//           }).catch((error) => {
//             throw error;
//           })
//       }).catch((error) => {
//         throw error;
//       });
//   });
//
//   it('should not be able to update the expectedDeliveryWindow of an ECMR which status is not IN_TRANSIT', () => {
//     let updateExpectedDeliveryWindowTransaction = factory.newTransaction(Network.namespace, 'UpdateExpectedDeliveryWindow');
//     updateExpectedDeliveryWindowTransaction.ecmr = factory.newRelationship(Network.namespace, 'ECMR', 'created');
//     updateExpectedDeliveryWindowTransaction.expectedWindow = factory.newConcept(Network.namespace, 'DateWindow');
//     updateExpectedDeliveryWindowTransaction.expectedWindow.startDate = 1;
//     updateExpectedDeliveryWindowTransaction.expectedWindow.endDate = 2;
//
//     return businessNetworkConnection.submitTransaction(updateExpectedDeliveryWindowTransaction)
//       .should.be.rejectedWith(/Transaction is not valid. Attempting to set an ExpectedDeliveryWindow when status is not IN_TRANSIT. Actual status:/);
//   });
//
// });