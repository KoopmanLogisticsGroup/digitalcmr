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

/**
 * Create transport order transaction processor function.
 * @param {org.digitalcmr.CreateTransportOrder} tx - The create transport order transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function CreateTransportOrder(tx) {
  console.log('Invoking function: CreateTransportOrder');

  // Get the asset registry for the asset.
  return getAssetRegistry('org.digitalcmr.TransportOrder')
    .then(function (assetRegistry) {
      return assetRegistry.add(tx.transportOrder)
        .then(function () {
          console.log('Asset added with success');
        })
        .catch(function (error) {
          console.log('An error occurred while add transport order assets', error);
          throw error;
        })
    }).catch(function (error) {
      console.log('An error occurred while retrieving the asset registry', error);
      throw error;
    })
}

/**
 * Create transport orders transaction processor function.
 * @param {org.digitalcmr.CreateTransportOrders} tx - The create transport orders transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function CreateTransportOrders(tx) {
  console.log('Invoking function: CreateTransportOrders');

  // Get the asset registry for the asset.
  return getAssetRegistry('org.digitalcmr.TransportOrder')
    .then(function (assetRegistry) {
      return assetRegistry.addAll(tx.transportOrders)
        .then(function () {
          console.log('Assets added with success');
        })
        .catch(function (error) {
          console.log('An error occurred while addAll transport orders assets', error);
          throw error;
        })
    }).catch(function (error) {
      console.log('An error occurred while retrieving the asset registry', error);
      throw error;
    })
}

/**
 * UpdateTransportOrder transaction processor function.
 * @param {org.digitalcmr.UpdateTransportOrder} tx  - UpdateTransportOrder status to IN_PROGRESS transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function UpdateTransportOrderStatusToInProgress(tx) {
  console.log('Invoking function processor to set update TransportOrder');
  console.log('orderID: ' + tx.transportOrder.orderID);

  // Get the asset registry for the asset.
  // Updates the status of a TransportOrder when an ECMR is created
  tx.transportOrder.status = transportOrderStatus.InProgress;

  // Adds the created ECMR resource to the array of ECMRs by checking if orderIDs are corresponding
  tx.transportOrder.ecmrs = tx.ecmrs;

  return getAssetRegistry('org.digitalcmr.TransportOrder')
    .then(function (assetRegistry) {
      return assetRegistry.update(tx.transportOrder)
        .catch(function (error) {
          console.log('[Update TransportOrder] An error occurred while updating the registry asset: ' + error);
          throw error;
        });
    }).catch(function (error) {
      console.log('[Update TransportOrder] An error occurred while updating the TransportOrder asset: ' + error);
      throw error;
    });
}

/**
 * UpdateTransportOrder transaction processor function.
 * @param {org.digitalcmr.UpdateTransportOrder} tx  - UpdateTransportOrder status to COMPLETED transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function UpdateTransportOrderStatusToCompleted(tx) {
  console.log('Invoking function processor to set update TransportOrder');
  console.log('orderID: ' + tx.transportOrder.orderID);

  // Get the asset registry for the asset.
  // Updates the status of a TransportOrder when an ECMR is created
  tx.transportOrder.status = transportOrderStatus.Completed;

  return getAssetRegistry('org.digitalcmr.TransportOrder')
    .then(function (assetRegistry) {
      return assetRegistry.update(tx.transportOrder)
        .catch(function (error) {
          console.log('[Update TransportOrder] An error occurred while updating the registry asset: ' + error);
          throw error;
        });
    }).catch(function (error) {
      console.log('[Update TransportOrder] An error occurred while updating the TransportOrder asset: ' + error);
      throw error;
    });
}
