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
 * Create RecipientOrg transaction processor function.
 * @param {org.digitalcmr.CreateVehicles} tx  - CreateVehicles transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function createVehicles(tx) {
  // Get the asset registry for the asset.
  return getAssetRegistry('org.digitalcmr.Vehicle')
    .then(function (assetRegistry) {
      return assetRegistry.addAll(tx.vehicles).catch(function (error) {
        console.log('An error occurred while addAll the Vehicle assets: ' + error);
        throw error;
      });
    }).catch(function (error) {
      console.log('An error occurred while saving the Vehicle assets: ' + error);
      throw error;
    });

}

/**
 * Create UpdateRegistrationCountry transaction processor function.
 * @param {org.digitalcmr.UpdateRegistrationCountry} tx  - Create Registration Country transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function updateRegistrationCountry(tx) {
  // Get the asset registry for the asset.
  return getAssetRegistry('org.digitalcmr.Vehicle')
    .then(function (assetRegistry) {
      tx.vehicle.registrationCountry = tx.registrationCountry;

      return assetRegistry.update(tx.vehicle).catch(function (error) {
            console.log('[Update Vehicle] An error occurred while updating the registry asset: ' + error);
            throw error;
          });
        }).catch(function (error) {
          console.log('[Update Vehicle] An error occurred while updating the Vehicle asset: ' + error);
          throw error;
        });
  // })
}