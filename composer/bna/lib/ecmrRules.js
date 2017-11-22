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
  return getAssetRegistry('org.digitalcmr.ECMR')
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
  return getAssetRegistry('org.digitalcmr.ECMR')
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
  console.log(tx.ecmr.status);
  console.log(tx.transportOrder);

  // Get the asset registry for the asset.
  return getAssetRegistry('org.digitalcmr.ECMR')
    .then(function (assetRegistry) {
      return assetRegistry.get(tx.ecmr.ecmrID).catch(function (error) {
        console.log('[Update ECMR] An error occurred while updating the registry asset: ' + error);
        throw error;
      });
    })
    .then(function (ecmr) {
      console.log(ecmr.status + ' ' + tx.ecmr.status);
      ecmr.status = tx.ecmr.status;

      var statusIsValid = false;

      //if the compound admin updated the ecmr status as LOADED, add the compound admin signature
      if (ecmr.status === 'LOADED') {
        statusIsValid = true;
        // write the compound signature into the ecmr
        ecmr.compoundSignature = tx.ecmr.compoundSignature;
        console.log('Goes in loaded');
        // write the compound remarks into the ecmr
        for (var i = 0; tx.ecmr.goods && i < tx.ecmr.goods.length; i++) {
          if (tx.ecmr.goods[i].compoundRemark) {
            ecmr.goods[i].compoundRemark = tx.ecmr.goods[i].compoundRemark;
          }
        }
      }

      //if the transporter updated the ecmr status as IN_TRANSIT, add the transporter signature confirming the loading
      if (ecmr.status === 'IN_TRANSIT') {
        console.log('Goes in IN_TRANSIT');
        statusIsValid = true;
        // check if the required signatures has been placed in the previous steps
        if (!ecmr.compoundSignature) {
          throw new Error("[Update ECMR] Transaction is not valid. Attempt to set the status on IN_TRANSIT before the compound admin signature");
        }
        // write the carrier loading signature into the ecmr
        ecmr.carrierLoadingSignature = tx.ecmr.carrierLoadingSignature;
        console.log(tx.ecmr.carrierLoadingSignature);
        // write the carrier loading remarks into the ecmr
        for (var i = 0; tx.ecmr.goods && i < tx.ecmr.goods.length; i++) {
          if (tx.ecmr.goods[i].carrierLoadingRemark) {
            ecmr.goods[i].carrierLoadingRemark = tx.ecmr.goods[i].carrierLoadingRemark;
          }
        }
      }

      //if the transporter updated the ecmr status as DELIVERED, add the trasnsporter admin signature
      if (ecmr.status === 'DELIVERED') {
        statusIsValid = true;
        // check if the required signatures has been placed in the previous steps
        if (!ecmr.compoundSignature) {
          throw new Error("[Update ECMR] Transaction is not valid. Attempt to set the status on DELIVERED before the compound admin signed!");
        }
        if (!ecmr.carrierLoadingSignature) {
          throw new Error("[Update ECMR] Transaction is not valid. Attempt to set the status on DELIVERED before the transporter signed for the loading!");
        }
        // write the carrier delivery signature into the ecmr
        ecmr.carrierDeliverySignature = tx.ecmr.carrierDeliverySignature;

        // write the carrier delivery remarks into the ecmr
        for (var i = 0; tx.ecmr.goods && i < tx.ecmr.goods.length; i++) {
          if (tx.ecmr.goods[i].carrierDeliveryRemark) {
            ecmr.goods[i].carrierDeliveryRemark = tx.ecmr.goods[i].carrierDeliveryRemark;
          }
        }

        updateTransportOrderStatusToCompleted(tx).then(function () {
          console.log('updated transport order');
        });
      }

      //if the recipient has confirmed the delivery and updated the ecmr status as CONFIRMED_DELIVERED, add the recipient signature
      if (ecmr.status === 'CONFIRMED_DELIVERED') {
        statusIsValid = true;
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
        // write the recipient signature into the ecmr
        ecmr.recipientSignature = tx.ecmr.recipientSignature;
        // write the recipient remarks into the ecmr
        for (var i = 0; tx.ecmr.goods && i < tx.ecmr.goods.length; i++) {
          if (tx.ecmr.goods[i].recipientRemark) {
            ecmr.goods[i].recipientRemark = tx.ecmr.goods[i].recipientRemark;
          }
        }
      }

      if (!statusIsValid) {
        throw new Error("[Update ECMR] Validation failure! Provided status: " + ecmr.status + "is not a valid status!");
      }
      return getAssetRegistry('org.digitalcmr.ECMR')
        .then(function (assetRegistry) {
          return assetRegistry.update(ecmr).catch(function (error) {
            console.log('[Update ECMR] An error occurred while updating the registry asset: ' + error);
            throw error;
          });
        }).catch(function (error) {
          console.log('[Update ECMR] An error occurred while updating the ECMR asset: ' + error);
          throw error;
        });
    });
}