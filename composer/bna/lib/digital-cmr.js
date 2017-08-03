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
 * @param {org.digitalcmr.CreateCMR} tx  - The create ecmr transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function CreateCMR(tx) {

    console.log('Invoking function processor create CMR');
    console.log(tx);

    // Get the asset registry for the asset.
    return getAssetRegistry('org.digitalcmr.ECMR')
        .then(function (assetRegistry) {
            console.log(assetRegistry);
            var factory = getFactory();
            var ecmrObj = factory.newResource('org.digitalcmr', 'ECMR', tx.ecmr.ecmrID);
            Object.keys(tx.ecmr).forEach(function(key,index) {
                ecmrObj[key] = tx.ecmr[key];
            });
            return assetRegistry.addAll([ecmrObj]);
        }).catch(function (error) {
            console.log('An error occurred while saving the ECMR asset');
            console.log(error);
            return error;
        });

}
