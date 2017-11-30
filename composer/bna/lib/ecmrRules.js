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
 * Create ecmr transaction processor function.
 * @param {org.digitalcmr.CreateECMR} tx  - Create ECMR transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function createECMR(tx) {
  return getAssetRegistry('org.digitalcmr.ECMR')
    .then(function (assetRegistry) {
      return assetRegistry.add(tx.ecmr)
        .catch(function (error) {
          throw new Error('[CreateECMR] An error occurred while addAll ECMRs', error);
        });
    }).catch(function (error) {
      throw new Error('[CreateECMR] An error occurred while saving the ECMR asset', error);
    });
}

/**
 * Create ECMRs transaction processor function.
 * @param {org.digitalcmr.CreateECMRs} tx  - Create ECMRs transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function createECMRs(tx) {
  return getAssetRegistry('org.digitalcmr.ECMR')
    .then(function (assetRegistry) {
      return assetRegistry.addAll(tx.ecmrs)
        .then(function () {
          updateTransportOrderToInProgress(tx);
        })
        .catch(function (error) {
          throw new Error('[CreateECMRs] An error occurred while addAll ECMRs', error);
        });
    }).catch(function (error) {
      throw new Error('[CreateECMRs] An error occurred while getting the asset registry', error);
    });
}

/**
 * Update EMCR transaction processor function.
 * @param {org.digitalcmr.UpdateECMR} tx  - UpdateECMR transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function updateECMR(tx) {
  return getAssetRegistry('org.digitalcmr.ECMR')
    .then(function (assetRegistry) {
      return assetRegistry.get(tx.ecmr.ecmrID).catch(function (error) {
        throw new Error('[UpdateECMR] An error occurred while getting the registry asset: ' + error);
      });
    })
    .then(function (ecmr) {
      var factory = getFactory();
      var currentParticipant = getCurrentParticipant() && getCurrentParticipant().getIdentifier();
      if (currentParticipant == undefined) {
        currentParticipant = 'network_admin';
      }

      if (ecmr.status === EcmrStatus.Created) {
        ecmr.status = EcmrStatus.Loaded;

        ecmr.compoundSignature = tx.ecmr.compoundSignature;
        ecmr.compoundSignature.certificate = factory.newRelationship('org.digitalcmr', 'User', currentParticipant);

        // write the compound remarks into the ecmr
        for (var i = 0; tx.ecmr.goods && i < tx.ecmr.goods.length; i++) {
          if (tx.ecmr.goods[i].compoundRemark) {
            ecmr.goods[i].compoundRemark = tx.ecmr.goods[i].compoundRemark;
          }
        }
      } else if (ecmr.status === EcmrStatus.Loaded) {
        if (!ecmr.compoundSignature) {
          throw new Error('[UpdateECMR] Transaction is not valid. Attempt to set the status on IN_TRANSIT before the compound admin signature');
        }

        ecmr.status = EcmrStatus.InTransit;

        ecmr.carrierLoadingSignature = tx.ecmr.carrierLoadingSignature;
        ecmr.carrierLoadingSignature.certificate = factory.newRelationship('org.digitalcmr', 'User', currentParticipant);

        // write the carrier loading remarks into the ecmr
        for (var i = 0; tx.ecmr.goods && i < tx.ecmr.goods.length; i++) {
          if (tx.ecmr.goods[i].carrierLoadingRemark) {
            ecmr.goods[i].carrierLoadingRemark = tx.ecmr.goods[i].carrierLoadingRemark;
          }
        }
      } else if (ecmr.status === EcmrStatus.InTransit) {
        // check if the required signatures has been placed in the previous steps
        if (!ecmr.compoundSignature) {
          throw new Error('[UpdateECMR] Transaction is not valid. Attempt to set the status on DELIVERED before the compound admin signed!');
        }
        if (!ecmr.carrierLoadingSignature) {
          throw new Error('[UpdateECMR] Transaction is not valid. Attempt to set the status on DELIVERED before the transporter signed for the loading!');
        }

        ecmr.status = EcmrStatus.Delivered;

        // write the carrier delivery signature into the ecmr
        ecmr.carrierDeliverySignature = tx.ecmr.carrierDeliverySignature;
        ecmr.carrierDeliverySignature.certificate = factory.newRelationship('org.digitalcmr', 'User', currentParticipant);


        // write the carrier delivery remarks into the ecmr
        for (var i = 0; tx.ecmr.goods && i < tx.ecmr.goods.length; i++) {
          if (tx.ecmr.goods[i].carrierDeliveryRemark) {
            ecmr.goods[i].carrierDeliveryRemark = tx.ecmr.goods[i].carrierDeliveryRemark;
          }
        }

        updateTransportOrderStatusToCompleted(tx);
      } else if (ecmr.status === EcmrStatus.Delivered) {
        // check if the required signatures has been placed in the previous steps
        if (!ecmr.compoundSignature) {
          throw new Error('[UpdateECMR] Transaction is not valid. Attempt to set the status on CONFIRMED_DELIVERED before the compound admin signed!');
        }
        if (!ecmr.carrierLoadingSignature) {
          throw new Error('[UpdateECMR] Transaction is not valid. Attempt to set the status on CONFIRMED_DELIVERED before the transporter signed for the loading!');
        }
        if (!ecmr.carrierDeliverySignature) {
          throw new Error('[UpdateECMR] Transaction is not valid. Attempt to set the status on CONFIRMED_DELIVERED before the transporter signed for the delivery!');
        }

        ecmr.status = EcmrStatus.ConfirmedDelivered;

        // write the recipient signature into the ecmr
        ecmr.recipientSignature = tx.ecmr.recipientSignature;
        ecmr.recipientSignature.certificate = factory.newRelationship('org.digitalcmr', 'User', currentParticipant);

        // write the recipient remarks into the ecmr
        for (var i = 0; tx.ecmr.goods && i < tx.ecmr.goods.length; i++) {
          if (tx.ecmr.goods[i].recipientRemark) {
            ecmr.goods[i].recipientRemark = tx.ecmr.goods[i].recipientRemark;
          }
        }
      } else throw new Error('[UpdateECMR] Validation failure! Provided status: ' + ecmr.status + 'is not a valid status!');

      return getAssetRegistry('org.digitalcmr.ECMR')
        .then(function (assetRegistry) {
          return assetRegistry.update(ecmr)
            .catch(function (error) {
              throw new Error('[UpdateECMR] An error occurred while updating the registry asset: ' + error);
            });
        }).catch(function (error) {
          throw new Error('[UpdateECMR] An error occurred while getting the asset Registry: ' + error);
        });
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

  if (currentParticipant == undefined || null) {
    currentParticipant = 'network_admin';
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
    throw new Error('[UpdateExpectedPickupWindow] Invalid transaction. Trying to set pickup window on an ECMR with an invalid status: ' + tx.ecmr.status);
  }
  tx.ecmr.loading.expectedWindow = tx.expectedWindow;

  return getAssetRegistry('org.digitalcmr.ECMR')
    .then(function (assetRegistry) {
      assetRegistry.update(tx.ecmr)
        .catch(function (error) {
          throw new Error('[UpdateExpectedPickupWindow] An error occurred while updating the registry asset: ' + error);
        });
    })
    .catch(function (error) {
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
    throw new Error('[UpdateExpectedPickupWindow] Invalid transaction. Trying to set pickup window on an ECMR with an invalid status: ' + tx.ecmr.status);
  }
  tx.ecmr.delivery.expectedWindow = tx.expectedWindow;

  return getAssetRegistry('org.digitalcmr.ECMR')
    .then(function (assetRegistry) {
      assetRegistry.update(tx.ecmr).catch(function (error) {
        throw new Error('[UpdateExpectedDeliveryWindow] An error occurred while updating the registry asset: ' + error)
      });
    }).catch(function (error) {
      throw new Error('[UpdateExpectedDeliveryWindow] An error occurred while getting the asset registry: ' + error);
    });
}