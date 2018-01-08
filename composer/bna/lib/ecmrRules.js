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
 * Create ECMRs transaction processor function.
 * @param {org.digitalcmr.CreateECMRs} tx  - Create ECMRs transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function createECMRs(tx) {
  var totalEcmrsGoods = tx.ecmrs
    .map(function (ecmr) {
      return ecmr.goods.length;
    }).reduce(function (prev, curr) {
      return prev + curr;
    });

  if (tx.transportOrder.goods.length !== +totalEcmrsGoods) {
    throw new Error('[CreateECMRs] The number of goods mismatch between TransportOrder ' + tx.transportOrder.orderID + ' and ECMRs. ' + tx.transportOrder.goods.length + ' !== ' + +totalEcmrsGoods);
  }

  return getAssetRegistry('org.digitalcmr.ECMR')
    .then(function (assetRegistry) {
      // maintain relationship with transport order
      tx.ecmrs.forEach(function (ecmr) {
        ecmr.orderID = tx.transportOrder.$identifier;
      });

      return assetRegistry.addAll(tx.ecmrs)
        .then(function () {
          updateTransportOrderToInProgress(tx);
          updateEcmrListInVin(tx.ecmrs);
        })
        .catch(function (error) {
          throw new Error('[CreateECMRs] An error occurred while addAll ECMRs: ' + error);
        });
    }).catch(function (error) {
      throw new Error('[CreateECMRs] An error occurred while getting the asset registry: ' + error);
    });
}

/**
 * UpdateEcmrStatusToLoaded transaction processor function.
 * @param {org.digitalcmr.UpdateEcmrStatusToLoaded} tx  - UpdateEcmrStatusToLoaded transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function updateEcmrStatusToLoaded(tx) {
  if (tx.ecmr.status !== EcmrStatus.Created) {
    throw new Error('[UpdateEcmrStatusToLoaded] Invalid transaction. Trying to set status LOADED to an ECMR with status: ' + tx.ecmr.status);
  }

  var factory = getFactory();
  var currentParticipant = getCurrentParticipant() && getCurrentParticipant().getIdentifier();

  if (typeof currentParticipant === 'undefined' || !currentParticipant) {
    throw new Error('[UpdateEcmrStatusToLoaded] Participant is not authenticated');
  }

  tx.ecmr.status = EcmrStatus.Loaded;

  tx.ecmr.compoundSignature = tx.signature;
  tx.ecmr.compoundSignature.certificate = factory.newRelationship('org.digitalcmr', 'User', currentParticipant);

  // write the compound remarks into the ecmr
  for (var i = 0; tx.goods && i < tx.goods.length; i++) {
    if (tx.goods[i].compoundRemark) {
      tx.ecmr.goods[i].compoundRemark = tx.goods[i].compoundRemark;
    }
  }

  return getAssetRegistry('org.digitalcmr.ECMR')
    .then(function (assetRegistry) {
      return assetRegistry.update(tx.ecmr)
        .catch(function (error) {
          throw new Error('[UpdateEcmrStatusToLoaded] An error occurred while updating the registry asset: ' + error);
        });
    }).catch(function (error) {
      throw new Error('[UpdateEcmrStatusToLoaded] An error occurred while getting the asset Registry: ' + error);
    });
}

/**
 * UpdateEcmrStatusToInTransit transaction processor function.
 * @param {org.digitalcmr.UpdateEcmrStatusToInTransit} tx  - UpdateEcmrStatusToInTransit transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function updateEcmrStatusToInTransit(tx) {
  if (tx.ecmr.status !== EcmrStatus.Loaded) {
    throw new Error('[UpdateEcmrStatusToInTransit] Invalid transaction. Trying to set status IN_TRANSIT to an ECMR with status: ' + tx.ecmr.status);
  }

  if (!tx.ecmr.compoundSignature) {
    throw new Error('[UpdateEcmrStatusToInTransit] Transaction is not valid. Attempt to set the status on IN_TRANSIT before the compound admin signed');
  }

  var factory = getFactory();
  var currentParticipant = getCurrentParticipant() && getCurrentParticipant().getIdentifier();

  if (typeof currentParticipant === 'undefined' || !currentParticipant) {
    throw new Error('[UpdateEcmrStatusToInTransit] Participant is not authenticated');
  }

  tx.ecmr.status = EcmrStatus.InTransit;

  tx.ecmr.carrierLoadingSignature = tx.signature;
  tx.ecmr.carrierLoadingSignature.certificate = factory.newRelationship('org.digitalcmr', 'User', currentParticipant);

  // write the carrier loading remarks into the ecmr
  for (var i = 0; tx.goods && i < tx.goods.length; i++) {
    if (tx.goods[i].carrierLoadingRemark) {
      tx.ecmr.goods[i].carrierLoadingRemark = tx.goods[i].carrierLoadingRemark;
    }
  }

  return getAssetRegistry('org.digitalcmr.ECMR')
    .then(function (assetRegistry) {
      return assetRegistry.update(tx.ecmr)
        .catch(function (error) {
          throw new Error('[UpdateEcmrStatusToInTransit] An error occurred while updating the registry asset: ' + error);
        });
    }).catch(function (error) {
      throw new Error('[UpdateEcmrStatusToInTransit] An error occurred while getting the asset Registry: ' + error);
    });
}

/**
 * UpdateEcmrStatusToDelivered transaction processor function.
 * @param {org.digitalcmr.UpdateEcmrStatusToDelivered} tx  - UpdateEcmrStatusToDelivered transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function updateEcmrStatusToDelivered(tx) {
  if (tx.ecmr.status !== EcmrStatus.InTransit) {
    throw new Error('[UpdateEcmrStatusToDelivered] Invalid transaction. Trying to set status DELIVERED to an ECMR with status: ' + tx.ecmr.status);
  }

  if (!tx.ecmr.compoundSignature) {
    throw new Error('[UpdateEcmrStatusToDelivered] Transaction is not valid. Attempt to set the status on DELIVERED before the compound admin signed!');
  }
  if (!tx.ecmr.carrierLoadingSignature) {
    throw new Error('[UpdateEcmrStatusToDelivered] Transaction is not valid. Attempt to set the status on DELIVERED before the transporter signed for loading!');
  }

  var factory = getFactory();
  var currentParticipant = getCurrentParticipant() && getCurrentParticipant().getIdentifier();

  if (typeof currentParticipant === 'undefined' || !currentParticipant) {
    throw new Error('[UpdateEcmrStatusToDelivered] Participant is not authenticated');
  }

  tx.ecmr.status = EcmrStatus.Delivered;

  // write the carrier delivery signature into the ecmr
  tx.ecmr.carrierDeliverySignature = tx.signature;
  tx.ecmr.carrierDeliverySignature.certificate = factory.newRelationship('org.digitalcmr', 'User', currentParticipant);


  // write the carrier delivery remarks into the ecmr
  for (var i = 0; tx.goods && i < tx.goods.length; i++) {
    if (tx.goods[i].carrierDeliveryRemark) {
      tx.ecmr.goods[i].carrierDeliveryRemark = tx.goods[i].carrierDeliveryRemark;
    }
  }

  return getAssetRegistry('org.digitalcmr.ECMR')
    .then(function (assetRegistry) {
      return assetRegistry.update(tx.ecmr)
        .catch(function (error) {
          throw new Error('[UpdateEcmrStatusToDelivered] An error occurred while updating the registry asset: ' + error);
        });
    }).catch(function (error) {
      throw new Error('[UpdateEcmrStatusToDelivered] An error occurred while getting the asset Registry: ' + error);
    });
}

/**
 * UpdateEcmrStatusToConfirmedDelivered transaction processor function.
 * @param {org.digitalcmr.UpdateEcmrStatusToConfirmedDelivered} tx  - UpdateEcmrStatusToConfirmedDelivered transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function updateEcmrStatusToConfirmedDelivered(tx) {
  if (tx.ecmr.status !== EcmrStatus.Delivered) {
    throw new Error('[UpdateEcmrStatusToConfirmedDelivered] Invalid transaction. Trying to set status CONFIRMED_DELIVERED to an ECMR with status: ' + tx.ecmr.status);
  }

  if (!tx.ecmr.compoundSignature) {
    throw new Error('[UpdateEcmrStatusToConfirmedDelivered] Transaction is not valid. Attempt to set the status on CONFIRMED_DELIVERED before the compound admin signed!');
  }
  if (!tx.ecmr.carrierLoadingSignature) {
    throw new Error('[UpdateEcmrStatusToConfirmedDelivered] Transaction is not valid. Attempt to set the status on CONFIRMED_DELIVERED before the transporter signed for loading!');
  }
  if (!tx.ecmr.carrierDeliverySignature) {
    throw new Error('[UpdateEcmrStatusToConfirmedDelivered] Transaction is not valid. Attempt to set the status on CONFIRMED_DELIVERED before the transporter signed for delivery!');
  }

  var factory = getFactory();
  var currentParticipant = getCurrentParticipant() && getCurrentParticipant().getIdentifier();

  if (typeof currentParticipant === 'undefined' || !currentParticipant) {
    // KEEP DISABLE FOR PRODUCTION - enable ONLY for unit test
    // currentParticipant = 'admin';

    throw new Error('[UpdateEcmrStatusToConfirmedDelivered] Participant is not authenticated');
  }

  tx.ecmr.status = EcmrStatus.ConfirmedDelivered;

  // write the recipient signature into the ecmr
  tx.ecmr.recipientSignature = tx.signature;
  tx.ecmr.recipientSignature.certificate = factory.newRelationship('org.digitalcmr', 'User', currentParticipant);

  // write the recipient remarks into the ecmr
  for (var i = 0; tx.goods && i < tx.goods.length; i++) {
    if (tx.goods[i].recipientRemark) {
      tx.ecmr.goods[i].recipientRemark = tx.goods[i].recipientRemark;
    }
  }

  return getAssetRegistry('org.digitalcmr.ECMR')
    .then(function (assetRegistry) {
      return assetRegistry.update(tx.ecmr)
        .catch(function (error) {
          throw new Error('[UpdateEcmrStatusToConfirmedDelivered] An error occurred while updating the registry asset: ' + error);
        });
      // TODO orderID not present in registry error to fix
      // .then(function () {
      //   updateTransportOrderStatusToCompleted(tx.transportOrder);
      // });
    }).catch(function (error) {
      throw new Error('[UpdateEcmrStatusToConfirmedDelivered] An error occurred while getting the asset Registry: ' + error);
    });
}

/**
 * UpdateECMRStatusToCancelled transaction processor function.
 * @param {org.digitalcmr.UpdateECMRStatusToCancelled} tx  - UpdateECMRStatusToCancelled transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function updateECMRStatusToCancelled(tx) {
  var factory = getFactory();
  var currentParticipant = getCurrentParticipant() && getCurrentParticipant().getIdentifier();

  if (typeof currentParticipant === 'undefined' || !currentParticipant) {
    throw new Error('[UpdateECMRStatusToCancelled] Participant is not authenticated');
  }

  // Get the asset registry for the asset.
  // Updates the status of a ECMR when the status of the specific ECMR is still CREATED
  tx.ecmr.status = EcmrStatus.Cancelled;

  // Updates the ECMR with an object that displays cancellation information
  tx.ecmr.cancellation = factory.newConcept('org.digitalcmr', 'Cancellation');
  tx.ecmr.cancellation.cancelledBy = factory.newRelationship('org.digitalcmr', 'Entity', currentParticipant);
  tx.ecmr.cancellation.date = tx.cancellation.date;
  tx.ecmr.cancellation.reason = tx.cancellation.reason;

  return getAssetRegistry('org.digitalcmr.ECMR')
    .then(function (assetRegistry) {
      return assetRegistry.update(tx.ecmr)
        .catch(function (error) {
          throw new Error('[UpdateECMRStatusToCancelled] An error occurred while updating the registry asset: ' + error);
        });
    }).catch(function (error) {
      throw new Error('[UpdateECMRStatusToCancelled] An error occurred while retrieving the asset registry: ' + error);
    });
}


/**
 * UpdateExpectedPickupWindow transaction processor function.
 * @param {org.digitalcmr.UpdateExpectedPickupWindow} tx  - UpdateExpectedPickupWindow transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function updateExpectedPickupWindow(tx) {
  if (tx.ecmr.status !== EcmrStatus.Created) {
    throw new Error('[UpdateExpectedPickupWindow] Transaction is not valid. Attempting to set an ExpectedPickupWindow when status is not CREATED. Actual status: ' + tx.ecmr.status);
  }

  tx.ecmr.loading.expectedWindow = tx.expectedWindow;

  return getAssetRegistry('org.digitalcmr.ECMR')
    .then(function (assetRegistry) {
      assetRegistry.update(tx.ecmr)
        .catch(function (error) {
          throw new Error('[UpdateExpectedPickupWindow] An error occurred while updating the registry asset: ' + error);
        });
    }).catch(function (error) {
      throw new Error('[UpdateExpectedPickupWindow] An error occurred while getting the asset registry: ' + error);
    });
}

/**
 * UpdateExpectedDeliveryWindow transaction processor function.
 * @param {org.digitalcmr.UpdateExpectedDeliveryWindow} tx  - UpdateExpectedDeliveryWindow transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function updateExpectedDeliveryWindow(tx) {
  if (tx.ecmr.status !== EcmrStatus.InTransit) {
    throw new Error('[UpdateExpectedDeliveryWindow] Transaction is not valid. Attempting to set an ExpectedDeliveryWindow when status is not IN_TRANSIT. Actual status: ' + tx.ecmr.status);
  }

  tx.ecmr.delivery.expectedWindow = tx.expectedWindow;

  return getAssetRegistry('org.digitalcmr.ECMR')
    .then(function (assetRegistry) {
      assetRegistry.update(tx.ecmr)
        .catch(function (error) {
          throw new Error('[UpdateExpectedDeliveryWindow] An error occurred while updating the registry asset: ' + error)
        });
    }).catch(function (error) {
      throw new Error('[UpdateExpectedDeliveryWindow] An error occurred while getting the asset registry: ' + error);
    });
}