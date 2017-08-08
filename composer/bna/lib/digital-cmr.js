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
            var factory = getFactory();
            var obj = factory.newResource('org.digitalcmr', 'LegalOwnerOrg', tx.legalOwnerOrg.entityID);
            Object.keys(tx.legalOwnerOrg).forEach(function(key,index) {
                obj[key] = tx.legalOwnerOrg[key];
            });
            return assetRegistry.addAll([obj]);
        }).catch(function (error) {
            console.log('An error occurred while saving the LegalOwnerOrg asset');
            console.log(error);
            return error;
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
            var factory = getFactory();
            var obj = factory.newResource('org.digitalcmr', 'CompoundOrg', tx.compoundOrg.entityID);
            Object.keys(tx.compoundOrg).forEach(function(key,index) {
                obj[key] = tx.compoundOrg[key];
            });
            return assetRegistry.addAll([obj]);
        }).catch(function (error) {
            console.log('An error occurred while saving the CompoundOrg asset');
            console.log(error);
            return error;
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
            var factory = getFactory();
            var obj = factory.newResource('org.digitalcmr', 'CarrierOrg', tx.carrierOrg.entityID);
            Object.keys(tx.carrierOrg).forEach(function(key,index) {
                obj[key] = tx.carrierOrg[key];
            });
            return assetRegistry.addAll([obj]);
        }).catch(function (error) {
            console.log('An error occurred while saving the CarrierOrg asset');
            console.log(error);
            return error;
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
            var factory = getFactory();
            var obj = factory.newResource('org.digitalcmr', 'RecipientOrg', tx.recipientOrg.entityID);
            Object.keys(tx.recipientOrg).forEach(function(key,index) {
                obj[key] = tx.recipientOrg[key];
            });
            return assetRegistry.addAll([obj]);
        }).catch(function (error) {
            console.log('An error occurred while saving the RecipientOrg asset');
            console.log(error);
            return error;
        });

}

/**
 * Create RecipientOrg transaction processor function.
 * @param {org.digitalcmr.CreateVehicles} tx  - The CreateVehicles transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function CreateVehicles(tx) {

    console.log('Invoking function processor CreateVehicles');
    console.log(tx);

    // Get the asset registry for the asset.
    return getAssetRegistry('org.digitalcmr.Vehicle')
        .then(function (assetRegistry) {
            var factory = getFactory();
            var vehicleArr = [];
            for (var i = 0 ; i < tx.vehicles.length ; i++) {
                var inputObj = tx.vehicles[i];
                var obj = factory.newResource('org.digitalcmr', 'Vehicle', inputObj.vin);
                Object.keys(tx.vehicles[i]).forEach(function(key,index) {
                    obj[key] = inputObj[key];
                });
                vehicleArr.push(obj);
            }
            return assetRegistry.addAll(vehicleArr).catch(function (error) {
                console.log('An error occurred while addAll the Vehicle assets');
                console.log(error);
                return error;
            });
        }).catch(function (error) {
            console.log('An error occurred while saving the Vehicle assets');
            console.log(error);
            return error;
        });

}