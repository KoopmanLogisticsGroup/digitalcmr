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
  return getAssetRegistry('org.digitalcmr.TransportOrder')
    .then(function (assetRegistry) {
      return assetRegistry.add(tx.transportOrder)
        .catch(function (error) {
          throw new Error('[CreateTransportOrder] An error occurred while adding a transport order asset' + error);
        })
    }).catch(function (error) {
      throw new Error('[CreateTransportOrder] An error occurred while retrieving the asset registry' + error);
    })
}

/**
 * Create transport orders transaction processor function.
 * @param {org.digitalcmr.CreateTransportOrders} tx - CreateTransportOrders transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function createTransportOrders(tx) {
  return getAssetRegistry('org.digitalcmr.TransportOrder')
    .then(function (assetRegistry) {
      return assetRegistry.addAll(tx.transportOrders)
        .catch(function (error) {
          throw new Error('[CreateTransportOrders] An error occurred while adding transport orders assets' + error);
        })
    }).catch(function (error) {
      throw new Error('[CreateTransportOrders] An error occurred while retrieving the asset registry' + error);
    })
}

function updateTransportOrderToInProgress(tx) {
  tx.transportOrder.status = TransportOrderStatus.InProgress;

  // Adds the created ECMR resource to the array of ECMRs by checking if orderIDs are corresponding
  tx.transportOrder.ecmrs = tx.ecmrs;

  return getAssetRegistry('org.digitalcmr.TransportOrder')
    .then(function (assetRegistry) {
      return assetRegistry.update(tx.transportOrder)
        .catch(function (error) {
          throw new Error('[UpdateTransportOrderStatusToInProgress] An error occurred while updating the registry asset: ' + error);
        });
    }).catch(function (error) {
      throw new Error('[UpdateTransportOrderStatusToInProgress] An error occurred while updating the TransportOrder asset: ' + error);
    });
}

function updateTransportOrderStatusToCompleted(transportOrder) {
  transportOrder.status = TransportOrderStatus.Completed;

  return getAssetRegistry('org.digitalcmr.TransportOrder')
    .then(function (assetRegistry) {
      return assetRegistry.update(transportOrder)
        .catch(function (error) {
          throw new Error('[UpdateTransportOrderStatusToCompleted] An error occurred while updating the registry asset: ' + error);
        });
    }).catch(function (error) {
      throw new Error('[UpdateTransportOrderStatusToCompleted] An error occurred while updating the TransportOrder asset: ' + error);
    });
}

/**
 *  Update Pickup transport order transaction processor function
 *  @param {org.digitalcmr.UpdateTransportOrderPickupWindow} tx - The update transport order pickup window transaction
 *  @return {Promise} Asset registry Promise
 *  @transaction
 */
function updateTransportOrderPickupWindow(tx) {
  return getAssetRegistry('org.digitalcmr.TransportOrder')
    .then(function (assetRegistry) {
      for (var goodIndex = 0; goodIndex < tx.transportOrder.goods.length; goodIndex++) {
        if (tx.transportOrder.goods[goodIndex].vehicle.vin === tx.vin) {
          tx.transportOrder.goods[goodIndex].pickupWindow = tx.dateWindow;
        }
      }

      return assetRegistry.update(tx.transportOrder).catch(function (error) {
        throw new Error('[UdateTransportOrderPickupWindow] An error occurred while updating the asset registry : ' + error);
      });
    }).catch(function (error) {
      throw new Error('[UpdateTransportOrderPickupWindow] An error occurred while retrieving the asset registry: ' + error);
    });
}

/**
 *  Update DeliveryWindow transport order transaction processor function
 *  @param {org.digitalcmr.UpdateTransportOrderDeliveryWindow} tx - The update transport order delivery window transaction
 *  @return {Promise} Asset registry Promise
 *  @transaction
 */
function updateTransportOrderDeliveryWindow(tx) {
  return getAssetRegistry('org.digitalcmr.TransportOrder')
    .then(function (assetRegistry) {
      for (var goodIndex = 0; goodIndex < tx.transportOrder.goods.length; goodIndex++) {
        if (tx.transportOrder.goods[goodIndex].vehicle.vin === tx.vin) {
          tx.transportOrder.goods[goodIndex].deliveryWindow = tx.dateWindow;
        }
      }

      return assetRegistry.update(tx.transportOrder).catch(function (error) {
        throw new Error('[UpdateTransportOrderDeliveryWindow] An error occurred while updating the asset registry: ' + error);
      });
    }).catch(function (error) {
      throw new Error('[UpdateTransportOrderDeliveryWindow] An error occurred while retrieving the asset registry: ' + error);
    });
}

/**
 * UpdateTransportOrderStatusToCancelled transaction processor function.
 * @param {org.digitalcmr.UpdateTransportOrderStatusToCancelled} tx  - UpdateTransportOrderStatusToCancelled transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function updateTransportOrderStatusToCancelled(tx) {
  var factory = getFactory();
  var currentParticipant = getCurrentParticipant() && getCurrentParticipant().getIdentifier();

  if (currentParticipant == undefined || null) {
    currentParticipant = 'network_admin';
  }

  // Get the asset registry for the asset.
  // Updates the status of a TransportOrder when it is cancelled
  tx.transportOrder.status = TransportOrderStatus.Cancelled;

  // Updates the transportOrder with an object that displays cancellation information
  tx.transportOrder.cancellation = factory.newConcept('org.digitalcmr', 'Cancellation');
  tx.transportOrder.cancellation.cancelledBy = factory.newRelationship('org.digitalcmr', 'Entity', currentParticipant);
  tx.transportOrder.cancellation.date = tx.cancellation.date;
  tx.transportOrder.cancellation.reason = tx.cancellation.reason;

  return getAssetRegistry('org.digitalcmr.TransportOrder')
    .then(function (assetRegistry) {
      return assetRegistry.update(tx.transportOrder)
        .catch(function (error) {
          throw new Error('[UpdateTransportOrderStatusToCancelled] An error occurred while updating the registry asset: ' + error);
        });
    }).catch(function (error) {
      throw new Error('[UpdateTransportOrderStatusToCancelled] An error occurred while retrieving the asset registry: ' + error);
    });
}
