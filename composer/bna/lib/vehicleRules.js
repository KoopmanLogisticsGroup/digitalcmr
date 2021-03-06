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
  return getAssetRegistry('org.digitalcmr.Vehicle')
    .then(function (assetRegistry) {
      return assetRegistry.addAll(tx.vehicles)
        .catch(function (error) {
          throw new Error('[CreateVehicles] An error occurred while addAll the Vehicle assets: ' + error);
        });
    }).catch(function (error) {
      throw new Error('[CreateVehicles] An error occurred while saving the Vehicle assets: ' + error);
    });

}

/**
 * Create UpdateRegistrationCountry transaction processor function.
 * @param {org.digitalcmr.UpdateRegistrationCountry} tx  - Create Registration Country transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function updateRegistrationCountry(tx) {
  return getAssetRegistry('org.digitalcmr.Vehicle')
    .then(function (assetRegistry) {
      tx.vehicle.registrationCountry = tx.registrationCountry;

      return assetRegistry.update(tx.vehicle)
        .catch(function (error) {
          throw new Error('[UpdateRegistrationCountry] An error occurred while updating the registry asset: ' + error);
        });
    }).catch(function (error) {
      throw new Error('[UpdateRegistrationCountry] An error occurred while updating the Vehicle asset: ' + error);
    });
}

function updateEcmrListInVin(ecmrs) {
  var ecmr, good;
  var promises = [];

  getAssetRegistry('org.digitalcmr.Vehicle')
    .then(function (assetRegistry) {
      for (var i = 0; i < ecmrs.length; i++) {
        ecmr = ecmrs[i];

        for (var j = 0; j < ecmr.goods.length; j++) {
          good = ecmr.goods[j];
          promises.push(retrieveAndUpdateVin(assetRegistry, good, ecmr.getIdentifier()));
        }
      }

      return Promise.all(promises);
      // TODO inspect why this construct does not work properly. updateAll would be computationally better than single update.
      // .then(function (vins) {
      //   return assetRegistry.updateAll(vins)
      //     .catch(function (error) {
      //       throw new Error('[updateEcmrListInVin] An error occurred while updating the registry asset: ' + error);
      //     });
      // });
    }).catch(function (error) {
    throw new Error('[updateEcmrListInVin] An error occurred while retrieving the Vehicle registry: ' + error);
  });
}

function retrieveAndUpdateVin(assetRegistry, good, ecmrID) {
  var factory = getFactory();

  return new Promise(function (resolve, reject) {
    return assetRegistry.get(good.vehicle.getIdentifier())
      .catch(function (error) {
        reject(new Error('[updateEcmrListInVin] An error occurred while retrieving the vin asset: ' + error));
      })
      .then(function (vin) {
        var ecmrSet = new Set(vin.ecmrs.map(function (ecmr) {
          return ecmr.getIdentifier();
        }));

        if (!ecmrSet.has(ecmrID)) {
          vin.ecmrs.push(factory.newRelationship('org.digitalcmr', 'ECMR', ecmrID));
        }

        assetRegistry.update(vin)
          .then(function () {
            resolve();
          });
      });
  }).catch(function (error) {
    throw new Error('[updateEcmrListInVin] An error occurred while retrieving the Vehicle registry: ' + error);
  });
}