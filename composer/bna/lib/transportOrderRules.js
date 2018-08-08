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
  // TODO check whether the VINs exist or not and throw an error in that case
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

  var factory = getFactory();
  var ecmrIDs = tx.ecmrs.map(function (ecmr) {
    return factory.newRelationship('org.digitalcmr', 'ECMR', ecmr.getIdentifier())
  });
  tx.transportOrder.ecmrs = ecmrIDs;

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

function updateTransportOrderStatusFromDeliveredToCompleted(transportOrder) {
  var deliveredEcmrs = transportOrder.ecmrs
    .filter(function (ecmr) {
      return (ecmr.status === EcmrStatus.Delivered)
    });

  if (deliveredEcmrs.length !== transportOrder.ecmrs.length) {
    console.log('[updateTransportOrderStatusToCompleted] The number of ECMRs in DELIVERED are not equal to the total in TransportOrder. ' + deliveredEcmrs.length + ' !== ' + transportOrder.ecmrs.length);
    return '[updateTransportOrderStatusToCompleted] The number of ECMRs in CONFIRMED_DELIVERED are not equal to the total in TransportOrder. ' + deliveredEcmrs.length + ' !== ' + transportOrder.ecmrs.length;
  }

  // compare transportOrder.goods against ecmrs[i].goods
  // return in case the number of goods do not match
  var totalEcmrsGoods = transportOrder.ecmrs
    .map(function (ecmr) {
      if (ecmr.status === EcmrStatus.Cancelled) {
        return 0;
      }

      return ecmr.goods.length;
    }).reduce(function (prev, curr) {
      return prev + curr;
    });

  if (transportOrder.goods.length !== +totalEcmrsGoods) {
    throw new Error('[updateTransportOrderStatusToCompleted] The number of goods mismatch between TransportOrder and ECMRs');
    // return '[updateTransportOrderStatusToCompleted] The number of goods mismatch between TransportOrder and ECMRs';
  }

  if (!validateVinIds(transportOrder, transportOrder.ecmrs)) {
    console.log('[updateTransportOrderStatusToCompleted] Goods mismatch or goods delivering is not completed');
    return '[updateTransportOrderStatusToCompleted] Goods mismatch or goods delivering is not completed';
  }

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

function updateTransportOrderStatusToCompleted(transportOrder) {
  var confirmedEcmrs = transportOrder.ecmrs
    .filter(function (ecmr) {
      return (ecmr.status === EcmrStatus.ConfirmedDelivered)
    });

  if (confirmedEcmrs.length !== transportOrder.ecmrs.length) {
    console.log('[updateTransportOrderStatusToCompleted] The number of ECMRs in CONFIRMED_DELIVERED are not equal to the total in TransportOrder. ' + confirmedEcmrs.length + ' !== ' + transportOrder.ecmrs.length);
    return '[updateTransportOrderStatusToCompleted] The number of ECMRs in CONFIRMED_DELIVERED are not equal to the total in TransportOrder. ' + confirmedEcmrs.length + ' !== ' + transportOrder.ecmrs.length;
  }

  // compare transportOrder.goods against ecmrs[i].goods
  // return in case the number of goods do not match
  var totalEcmrsGoods = transportOrder.ecmrs
    .map(function (ecmr) {
      if (ecmr.status === EcmrStatus.Cancelled) {
        return 0;
      }

      return ecmr.goods.length;
    }).reduce(function (prev, curr) {
      return prev + curr;
    });

  if (transportOrder.goods.length !== +totalEcmrsGoods) {
    console.log('[updateTransportOrderStatusToCompleted] The number of goods mismatch between TransportOrder and ECMRs');
    return '[updateTransportOrderStatusToCompleted] The number of goods mismatch between TransportOrder and ECMRs';
  }

  if (!validateVinIds(transportOrder, transportOrder.ecmrs)) {
    console.log('[updateTransportOrderStatusToCompleted] Goods mismatch or goods delivering is not completed');
    return '[updateTransportOrderStatusToCompleted] Goods mismatch or goods delivering is not completed';
  }

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

function sortByVin(a, b) {
  if (a.vehicle.getIdentifier() > b.vehicle.getIdentifier()) {
    return 1;
  }
  if (a.vehicle.getIdentifier() < b.vehicle.getIdentifier()) {
    return -1;
  }

  return 0;
}

function validateVinIds(transportOrder, ecmrs) {
  transportOrder.goods = transportOrder.goods.sort(sortByVin);

  var ecmr;
  var counter = 0;
  for (var i = 0; i < ecmrs.length; i++) {
    ecmr = ecmrs[i];
    ecmr.goods = ecmr.goods.sort(sortByVin);

    for (var j = 0; j < ecmr.goods.length; j++) {
      // there is a mismatch of vin number or there is a cancellation
      if ((ecmr.goods[j].vehicle.getIdentifier() !== transportOrder.goods[counter].vehicle.getIdentifier()) ||
        ((ecmr.goods[j].vehicle.getIdentifier() === transportOrder.goods[counter].vehicle.getIdentifier()) &&
          (!ecmr.goods[j].cancellation && typeof ecmr.goods[j].cancellation !== 'undefined'))) {
        return false;
      }
      counter++;
    }
  }

  return true;
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

function updateTransportOrderStatusToOpenAfterECMRCancellation(transportOrderID) {
  return getAssetRegistry('org.digitalcmr.TransportOrder')
    .then(function (assetRegistry) {
      assetRegistry.get(transportOrderID)
        .then(function (transportOrder) {
          transportOrder.status = TransportOrderStatus.Open;
          return assetRegistry.update(transportOrder)
            .catch(function (error) {
              throw new Error('[UpdateTransportOrderStatusToCancelled] An error occurred while updating the registry asset: ' + error);
            });
        })
        .catch(function (error) {
          throw new Error('[UpdateTransportOrderStatusToCancelled] An error occurred while retrieving the item with id ' + transportOrderID + '. reason: ' + error);
        });
    }).catch(function (error) {
      throw new Error('[UpdateTransportOrderStatusToCancelled] An error occurred while retrieving the asset registry: ' + error);
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

  if (typeof currentParticipant === 'undefined' || !currentParticipant) {
    throw new Error('[UpdateTransportOrderStatusToCancelled] Participant is not authenticated');
  }

  for (var ecmrIndex = 0; ecmrIndex < tx.transportOrder.ecmrs.length; ecmrIndex++) {
    cancelECMRsDueToTransportOrderCancellation(tx.transportOrder.ecmrs[ecmrIndex], tx.cancellation.date)
      .catch(function (error) {
        throw new Error('[UpdateTransportOrderStatusToCancelled] An error occurred while cancelling ECMRs ' + error);
      });
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
