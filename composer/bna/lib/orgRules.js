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
 * Create Legal Owner org transaction processor function.
 * @param {org.digitalcmr.CreateLegalOwnerOrg} tx  - The CreateLegalOwnerOrg transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function CreateLegalOwnerOrg(tx) {

  console.log('Invoking function processor CreateLegalOwnerOrg');
  console.log(tx);

  // Get the asset registry for the asset.
  return getAssetRegistry('org.digitalcmr.LegalOwnerOrg')
    .then(function (assetRegistry) {
      return assetRegistry.add(tx.legalOwnerOrg).catch(function (error) {
        console.log('An error occurred while adding all the assets in the registry: ' + error);
        throw error;
      });
    }).catch(function (error) {
      console.log('An error occurred while saving the LegalOwnerOrg asset', error);
      throw error;
    });

}

/**
 * CreateCompoundOrg transaction processor function.
 * @param {org.digitalcmr.CreateCompoundOrg} tx  - The CreateCompoundOrg transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function CreateCompoundOrg(tx) {

  console.log('Invoking function processor create CompoundOrg');
  console.log(tx);

  // Get the asset registry for the asset.
  return getAssetRegistry('org.digitalcmr.CompoundOrg')
    .then(function (assetRegistry) {
      return assetRegistry.add(tx.compoundOrg).catch(function (error) {
        console.log('An error occurred while adding all the assets in the registry: ' + error);
        throw error;
      });
    }).catch(function (error) {
      console.log('An error occurred while saving the CompoundOrg asset', error);
      throw error;
    });

}

/**
 * Create CarrierOrg transaction processor function.
 * @param {org.digitalcmr.CreateCarrierOrg} tx  - The CreateCarrierOrg transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function CreateCarrierOrg(tx) {

  console.log('Invoking function processor create CarrierOrg');
  console.log(tx);

  // Get the asset registry for the asset.
  return getAssetRegistry('org.digitalcmr.CarrierOrg')
    .then(function (assetRegistry) {
      return assetRegistry.add(tx.carrierOrg).catch(function (error) {
        console.log('An error occurred while adding all the assets in the registry: ' + error);
        throw error;
      });
    }).catch(function (error) {
      console.log('An error occurred while saving the CarrierOrg asset', error);
      throw error;
    });

}

/**
 * Create RecipientOrg transaction processor function.
 * @param {org.digitalcmr.CreateRecipientOrg} tx  - The RecipientOrg transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function CreateRecipientOrg(tx) {

  console.log('Invoking function processor create RecipientOrg');
  console.log(tx);

  // Get the asset registry for the asset.
  return getAssetRegistry('org.digitalcmr.RecipientOrg')
    .then(function (assetRegistry) {
      return assetRegistry.add(tx.recipientOrg).catch(function (error) {
        console.log('An error occurred while adding all the assets in the registry: ' + error);
        throw error;
      });
    }).catch(function (error) {
      console.log('An error occurred while saving the RecipientOrg asset: ' + error);
      throw error;
    });

}