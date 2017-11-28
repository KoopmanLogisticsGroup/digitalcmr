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
  console.log('Invoking function: CreateECMR');

  // Get the asset registry for the asset.
  return getAssetRegistry(nameSpaces.Ecmr)
    .then(function (assetRegistry) {
      return assetRegistry.add(tx.ecmr)
        .then(function () {
          console.log('Asset added with success');
        })
        .catch(function (error) {
          console.log('An error occurred while addAll ECMRs', error);
          throw error;
        });
    }).catch(function (error) {
      console.log('An error occurred while saving the ECMR asset', error);
      throw error;
    });
}

/**
 * Create ECMRs transaction processor function.
 * @param {org.digitalcmr.CreateECMRs} tx  - Create ECMRs transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function createECMRs(tx) {
  console.log('Invoking function: CreateECMRs');

  // Get the asset registry for the asset.
  return getAssetRegistry(nameSpaces.Ecmr)
    .then(function (assetRegistry) {
      return assetRegistry.addAll(tx.ecmrs)
        .then(function () {
          console.log('ECMRs added with success');
          updateTransportOrderToInProgress(tx);
        })
        .catch(function (error) {
          console.log('An error occurred while addAll ECMRs', error);
          throw error;
        });
    }).catch(function (error) {
      console.log('An error occurred while getting the asset registry', error);
      throw error;
    });
}

/**
 * Update EMCR transaction processor function.
 * @param {org.digitalcmr.UpdateECMR} tx  - UpdateECMR transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function updateECMR(tx) {
  console.log('Invoking function processor to set update ECMR');
  console.log('ecmrID: ' + tx.ecmr.ecmrID);

  // Get the asset registry for the asset.
  return getAssetRegistry(nameSpaces.Ecmr)
    .then(function (assetRegistry) {
      return assetRegistry.get(tx.ecmr.ecmrID).catch(function (error) {
        console.log('[Update ECMR] An error occurred while getting the registry asset: ' + error);
        throw error;
      });
    })
    .then(function (ecmr) {
      var factory = getFactory();
      var currentParticipant = getCurrentParticipant() && getCurrentParticipant().getIdentifier();
      if (currentParticipant == undefined) {
        console.log('setting currentParticipant');
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
          throw new Error("[Update ECMR] Transaction is not valid. Attempt to set the status on IN_TRANSIT before the compound admin signature");
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
          throw new Error("[Update ECMR] Transaction is not valid. Attempt to set the status on DELIVERED before the compound admin signed!");
        }
        if (!ecmr.carrierLoadingSignature) {
          throw new Error("[Update ECMR] Transaction is not valid. Attempt to set the status on DELIVERED before the transporter signed for the loading!");
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

        updateTransportOrderStatusToCompleted(tx).then(function () {
          console.log('updated transport order');
        });
      } else if (ecmr.status === EcmrStatus.Delivered) {
        // check if the required signatures has been placed in the previous steps
        if (!ecmr.compoundSignature) {
          throw new Error("[Update ECMR] Transaction is not valid. Attempt to set the status on CONFIRMED_DELIVERED before the compound admin signed!");
        }
        if (!ecmr.carrierLoadingSignature) {
          throw new Error("[Update ECMR] Transaction is not valid. Attempt to set the status on CONFIRMED_DELIVERED before the transporter signed for the loading!");
        }
        if (!ecmr.carrierDeliverySignature) {
          throw new Error("[Update ECMR] Transaction is not valid. Attempt to set the status on CONFIRMED_DELIVERED before the transporter signed for the delivery!");
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
      } else throw new Error("[Update ECMR] Validation failure! Provided status: " + ecmr.status + "is not a valid status!");

      return getAssetRegistry(nameSpaces.Ecmr)
        .then(function (assetRegistry) {
          return assetRegistry.update(ecmr).catch(function (error) {
            console.log('[Update ECMR] An error occurred while updating the registry asset: ' + error);
            throw error;
          });
        }).catch(function (error) {
          console.log('[Update ECMR] An error occurred while getting the asset Registry: ' + error);
          throw error;
        });
    });
}

/**
 * Update EMCR delivery ETA transaction processor function.
 * @param {org.digitalcmr.UpdateEcmrDeliveryEta} tx  - UpdateEcmrDeliveryEta transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function updateEcmrDeliveryEta(tx) {
  console.log('Invoking function UpdateEcmrDeliveryEta');
  console.log('ecmrID: ', tx.ecmr.ecmrID);

  tx.ecmr.deliveryEta = tx.etaWindow;

  return getAssetRegistry('org.digitalcmr.ECMR')
    .then(function (assetRegistry) {
      assetRegistry.update(tx.ecmr).catch(function (error) {
        console.log('[UpdateEcmrDeliveryEta] An error occurred while updating the registry asset: ' + error)
        throw error;
      });
    }).catch(function (error) {
      console.log('[UpdateEcmrDeliveryEta] An error occurred while getting the asset registry: ' + error);
      throw error;
    });
}


