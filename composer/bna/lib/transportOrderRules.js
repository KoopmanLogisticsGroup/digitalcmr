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
 * @param {org.digitalcmr.CreateTransportOrder} tx - CreateTransportOrder transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function createTransportOrder(tx) {
  console.log('Invoking function: CreateTransportOrder');

  // Get the asset registry for the asset.
  return getAssetRegistry('org.digitalcmr.TransportOrder')
    .then(function (assetRegistry) {
      return assetRegistry.add(tx.transportOrder)
        .then(function () {
          console.log('Asset added with success');
        })
        .catch(function (error) {
          console.log('[CreateTransportOrder] An error occurred while adding a transport order asset', error);
          throw error;
        })
    }).catch(function (error) {
      console.log('[CreateTransportOrder] An error occurred while retrieving the asset registry', error);
      throw error;
    })
}

/**
 * Create transport orders transaction processor function.
 * @param {org.digitalcmr.CreateTransportOrders} tx - CreateTransportOrders transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function createTransportOrders(tx) {
  console.log('Invoking function: CreateTransportOrders');

  // Get the asset registry for the asset.
  return getAssetRegistry('org.digitalcmr.TransportOrder')
    .then(function (assetRegistry) {
      return assetRegistry.addAll(tx.transportOrders)
        .then(function () {
          console.log('Assets added with success');
        })
        .catch(function (error) {
          console.log('[CreateTransportOrders] An error occurred while adding transport orders assets', error);
          throw error;
        })
    }).catch(function (error) {
      console.log('[CreateTransportOrders] An error occurred while retrieving the asset registry', error);
      throw error;
    })
}

function updateTransportOrderToInProgress(tx) {
  console.log('Invoking function processor to set update TransportOrder');
  console.log('orderID: ' + tx.transportOrder.orderID);

  // Get the asset registry for the asset.
  // Updates the status of a TransportOrder when an ECMR is created
  tx.transportOrder.status = TransportOrderStatus.InProgress;

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

function updateTransportOrderStatusToCompleted(tx) {
  console.log('Invoking function processor to set update TransportOrder');
  console.log('orderID: ' + tx.transportOrder.orderID);

  // Get the asset registry for the asset.
  // Updates the status of a TransportOrder when an ECMR is created
  tx.transportOrder.status = TransportOrderStatus.Completed;

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
 *  Update Pickup transport order transaction processor function
 *  @param {org.digitalcmr.UpdateTransportOrderPickupWindow} tx - The update transport order pickup window transaction
 *  @return {Promise} Asset registry Promise
 *  @transaction
 */
function updateTransportOrderPickupWindow(tx) {
  console.log('Invoking function processor updateTransportOrderPickupWindow');

  return getAssetRegistry('org.digitalcmr.TransportOrder')
    .then(function (assetRegistry) {
      for (var goodIndex = 0; goodIndex < tx.transportOrder.goods.length; goodIndex++) {
        if (tx.transportOrder.goods[goodIndex].vehicle.vin === tx.vin) {
          tx.transportOrder.goods[goodIndex].pickupWindow = tx.dateWindow;
        }
      }

      return assetRegistry.update(tx.transportOrder).catch(function (error) {
        console.log('[updateTransportOrderPickupWindow] An error occurred while updating the asset registry : ' + error);
        throw error;
      });
    }).catch(function (error) {
      console.log('[updateTransportOrderPickupWindow] An error occurred while retrieving the asset registry: ' + error);
      throw error;
    });
}

/**
 *  Update DeliveryWindow transport order transaction processor function
 *  @param {org.digitalcmr.UpdateTransportOrderDeliveryWindow} tx - The update transport order delivery window transaction
 *  @return {Promise} Asset registry Promise
 *  @transaction
 */
function updateTransportOrderDeliveryWindow(tx) {
  console.log('Invoking function processor updateTransportOrderDeliveryWindow');

  return getAssetRegistry('org.digitalcmr.TransportOrder')
    .then(function (assetRegistry) {
      for (var goodIndex = 0; goodIndex < tx.transportOrder.goods.length; goodIndex++) {
        if (tx.transportOrder.goods[goodIndex].vehicle.vin === tx.vin) {
          tx.transportOrder.goods[goodIndex].deliveryWindow = tx.dateWindow;
        }
      }

      return assetRegistry.update(tx.transportOrder).catch(function (error) {
        console.log('[updateTransportOrderDeliveryWindow] An error occurred while updating the asset registry: ' + error);
        throw error;
      });
    }).catch(function (error) {
      console.log('[updateTransportOrderDeliveryWindow] An error occurred while retrieving the asset registry: ' + error);
      throw error;
    });
}

/**
 * UpdateTransportOrderStatusToCanceled transaction processor function.
 * @param {org.digitalcmr.UpdateTransportOrderStatusToCanceled} tx  - UpdateTransportOrderStatusToCanceled transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function updateTransportOrderStatusToCanceled(tx) {
  console.log('Invoking function: updateTransportOrderStatusToCanceled');

  // Get the asset registry for the asset.
  // Updates the status of a TransportOrder when an ECMR is created
  tx.transportOrder.status = TransportOrderStatus.Canceled;

  return getAssetRegistry('org.digitalcmr.TransportOrder')
    .then(function (assetRegistry) {
      return assetRegistry.update(tx.transportOrder)
        .catch(function (error) {
          console.log('[updateTransportOrderStatusToCanceled] An error occurred while updating the registry asset: ' + error);
          throw error;
        });
    }).catch(function (error) {
      console.log('[updateTransportOrderStatusToCanceled] An error occurred while retrieving the asset registry: ' + error);
      throw error;
    });
}
