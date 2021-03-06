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
const BusinessModel = require('./businessModel');
var Network = require('./network');
Network = new Network();

var Builder = function (factory) {
  this.factory = factory;
};

Builder.prototype.buildAddress = function buildAddress() {
  let address = this.factory.newConcept(Network.namespace, 'Address');
  address.name = 'name';
  address.street = 'street';
  address.houseNumber = 'housenumber';
  address.city = 'city';
  address.zipCode = 'zipcode';
  address.country = 'country';
  address.latitude = this.calcLatitude();
  address.longitude = this.calcLongitude();

  return address;
};

/**
 * Build ECMR asset
 * @param {String} ecmrID The ID of the ECMR to build
 * @return {Promise} A promise that will be resolved when completed.
 */
Builder.prototype.buildECMR = function buildECMR(ecmrID) {
  let ecmr = this.factory.newResource(Network.namespace, 'ECMR', ecmrID);
  ecmr.creation = this.factory.newConcept(Network.namespace, 'Creation');
  ecmr.creation.address = this.buildAddress();
  ecmr.creation.date = 0;
  ecmr.loading = this.factory.newConcept(Network.namespace, 'Loading');
  ecmr.loading.address = this.buildAddress();
  ecmr.loading.actualDate = 0;
  ecmr.delivery = this.factory.newConcept(Network.namespace, 'Delivery');
  ecmr.delivery.address = this.buildAddress();
  ecmr.delivery.actualDate = 0;
  ecmr.owner = this.factory.newRelationship(Network.namespace, 'LegalOwnerOrg', 'leaseplan');
  ecmr.source = this.factory.newRelationship(Network.namespace, 'CompoundOrg', 'amsterdamcompound');
  ecmr.transporter = this.factory.newRelationship(Network.namespace, 'CarrierMember', 'harry');
  ecmr.carrier = this.factory.newRelationship(Network.namespace, 'CarrierOrg', 'koopman');
  ecmr.recipientOrg = this.factory.newRelationship(Network.namespace, 'RecipientOrg', 'cardealer');
  ecmr.recipient = this.factory.newRelationship(Network.namespace, 'RecipientMember', 'rob');
  ecmr.issuedBy = this.factory.newRelationship(Network.namespace, 'Entity', 'leaseplan');
  ecmr.issueDate = 0;
  ecmr.carrierComments = 'comments';
  ecmr.goods = [];
  ecmr.legalOwnerInstructions = 'instructions';
  ecmr.paymentInstructions = 'instructions';
  ecmr.payOnDelivery = 'payondelivery';
  ecmr.status = BusinessModel.ecmrStatus.Created;
  ecmr.agreementTerms = 'string';
  ecmr.agreementTermsSec = 'string';
  ecmr.legalOwnerRef = 'aqe2321312';
  ecmr.carrierRef = 'asdisajdaiodasj';
  ecmr.recipientRef = '2323423dsdf';
  ecmr.orderID = 'ORDER1';

  return ecmr;
};

/**
 * Build Good concept
 * @param {String} vin The VIN of the vehicle to connect
 * @return {Promise} A promise that will be resolved when completed.
 */
Builder.prototype.buildGood = function buildGood(vin) {
  let good = this.factory.newConcept(Network.namespace, 'Good');
  good.vehicle = this.buildVehicle(vin);
  good.pickupWindow = this.factory.newConcept(Network.namespace, 'DateWindow');
  good.deliveryWindow = this.factory.newConcept(Network.namespace, 'DateWindow');
  good.deliveryWindow.startDate = 0;
  good.deliveryWindow.endDate = 0;
  good.pickupWindow.startDate = 0;
  good.pickupWindow.endDate = 0;
  good.loadingAddress = this.factory.newConcept(Network.namespace, 'Address');
  good.deliveryAddress = this.factory.newConcept(Network.namespace, 'Address');
  good.loadingAddress = this.buildAddress();
  good.deliveryAddress = this.buildAddress();
  good.source = this.factory.newRelationship(Network.namespace, 'CompoundOrg', 'amsterdamcompound');
  good.recipientOrg = this.factory.newRelationship(Network.namespace, 'RecipientOrg', 'cardealer');

  return good;
};

/**
 * Build Vehicle asset
 * @param {String} vin The vin of the vehicle
 * @return {Promise} A promise that will be resolved when completed.
 */
Builder.prototype.buildVehicle = function buildVehicle(vin) {
  let vehicle = this.factory.newResource(Network.namespace, 'Vehicle', vin);
  vehicle.manufacturer = 'manufacturer';
  vehicle.model = 'model';
  vehicle.type = 'type';
  vehicle.ecmrs = [];
  vehicle.odoMeterReading = 0;
  vehicle.plateNumber = 'platenumber';

  return vehicle;
};

/**
 * Build TransportOrder asset
 * @param {String} orderID The ID of the trasportOrder
 * @return {Promise} A promise that will be resolved when completed.
 */
Builder.prototype.buildTransportOrder = function buildTransportOrder(orderID) {
  let transportOrder = this.factory.newResource(Network.namespace, 'TransportOrder', orderID);
  transportOrder.owner = this.factory.newRelationship(Network.namespace, 'LegalOwnerOrg', 'leaseplan');
  transportOrder.carrier = this.factory.newRelationship(Network.namespace, 'CarrierOrg', 'koopman');
  transportOrder.goods = [];
  transportOrder.issueDate = 0;
  transportOrder.status = BusinessModel.orderStatus.Open;
  transportOrder.ecmrs = [];
  transportOrder.orderRef = 'orderRef';

  return transportOrder;
};

/**
 * Build Signature concept
 * @param {String} certificate The certificate of the user
 * @return {Promise} A promise that will be resolved when completed.
 */
Builder.prototype.buildSignature = function buildSignature(certificate) {
  let signature = this.factory.newConcept(Network.namespace, 'Signature');
  signature.certificate = this.factory.newRelationship(Network.namespace, 'User', certificate);
  signature.timestamp = new Date().getTime();

  return signature;
};

Builder.prototype.calcLatitude = function calcLatitude() {
  return Math.random() < 0.5 ? ((1 - Math.random()) * (90 - (-90)) + -90) : (Math.random() * (90 - (-90)) + (-90));
};

Builder.prototype.calcLongitude = function calcLongitude() {
  return Math.random() < 0.5 ? ((1 - Math.random()) * (180 - (-180)) + -180) : (Math.random() * (180 - (-180)) + (-180));
};

Builder.prototype.constructor = Builder;
module.exports = Builder;