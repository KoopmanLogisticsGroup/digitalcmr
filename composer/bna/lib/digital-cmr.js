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
 * @param {org.digitalcmr.CreateECMR} tx  - The create ecmr transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function CreateECMR(tx) {

    console.log('Invoking function processor create CMR');
    console.log(tx);

    // Get the asset registry for the asset.
    return getAssetRegistry('org.digitalcmr.ECMR')
        .then(function (assetRegistry) {
            var factory = getFactory();
            var ecmrObj = factory.newResource('org.digitalcmr', 'ECMR', tx.ecmr.ecmrID);
            Object.keys(tx.ecmr).forEach(function (key, index) {
                ecmrObj[key] = tx.ecmr[key];
            });
            return assetRegistry.add(ecmrObj);
        }).catch(function (error) {
            console.log('An error occurred while saving the ECMR asset');
            console.log(error);
            return error;
        });

}

/**
 * Create ECMRs transaction processor function.
 * @param {org.digitalcmr.CreateECMRs} tx  - Create ecmrs transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function CreateECMRs(tx) {

    console.log('Invoking function processor to create CMRs');
    console.log(tx);

    // Get the asset registry for the asset.
    return getAssetRegistry('org.digitalcmr.ECMR')
        .then(function (assetRegistry) {
            var factory = getFactory();
            var ecmrArr = [];
            for (var i = 0; i < tx.ecmrs.length; i++) {
                var inputObj = tx.ecmrs[i];
                var obj = factory.newResource('org.digitalcmr', 'ECMR', inputObj.ecmrID);
                Object.keys(tx.ecmrs[i]).forEach(function (key, index) {
                    obj[key] = inputObj[key];
                });
                ecmrArr.push(obj);
            }
            return assetRegistry.addAll(ecmrArr).catch(function (error) {
                console.log('An error occurred while addAll ecmr assets');
                console.log(error);
                return error;
            });
        }).catch(function (error) {
            console.log('An error occurred while saving the ecmr assets');
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
            Object.keys(tx.legalOwnerOrg).forEach(function (key, index) {
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
            Object.keys(tx.compoundOrg).forEach(function (key, index) {
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
            Object.keys(tx.carrierOrg).forEach(function (key, index) {
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
            Object.keys(tx.recipientOrg).forEach(function (key, index) {
                obj[key] = tx.recipientOrg[key];
            });
            return assetRegistry.addAll([obj]).catch(function (error) {
                console.log('An error occurred while adding all the assets in the registry: ' + error);
                return error;
            });
        }).catch(function (error) {
            console.log('An error occurred while saving the RecipientOrg asset: ' + error);
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
            for (var i = 0; i < tx.vehicles.length; i++) {
                var inputObj = tx.vehicles[i];
                var obj = factory.newResource('org.digitalcmr', 'Vehicle', inputObj.vin);
                Object.keys(tx.vehicles[i]).forEach(function (key, index) {
                    obj[key] = inputObj[key];
                });
                vehicleArr.push(obj);
            }
            return assetRegistry.addAll(vehicleArr).catch(function (error) {
                console.log('An error occurred while addAll the Vehicle assets: ' + error);
                return error;
            });
        }).catch(function (error) {
            console.log('An error occurred while saving the Vehicle assets: ' + error);
            return error;
        });

}

/**
 * Update EMCR transaction processor function.
 * @param {org.digitalcmr.UpdateECMR} tx  - The UpdateECMR transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function UpdateECMR(tx) {

    console.log('Invoking function processor to set update ECMR');
    console.log('ecmrID: ' + tx.ecmr.ecmrID);

    // Get the asset registry for the asset.
    return getAssetRegistry('org.digitalcmr.ECMR')
        .then(function (assetRegistry) {
            return assetRegistry.get(tx.ecmr.ecmrID).catch(function (error) {
                console.log('An error occurred while updating the registry asset: ' + error);
                return error;
            });
        })
        .then(function (ecmr) {
            ecmr.status = tx.ecmr.status;

            //if the compound admin updated the ecmr status as LOADED, add the compound admin signature
            if (ecmr.status === 'LOADED') {
                ecmr.compoundSignature = tx.ecmr.compoundSignature;
            }

            //if the transporter updated the ecmr status as IN_TRANSIT, add the transporter signature confirming the loading
            if (ecmr.status === 'IN_TRANSIT') {
                // check if the required signatures has been placed in the previous steps
                if (! ecmr.compoundSignature ) {
                    throw new Error("Transaction is not valid. Attempt to set the status on IN_TRANSIT before the compound admin signature");
                }
                ecmr.carrierLoadingSignature = tx.ecmr.carrierLoadingSignature;
            }

            //if the transporter updated the ecmr status as DELIVERED, add the trasnsporter admin signature
            if (ecmr.status === 'DELIVERED') {
                // check if the required signatures has been placed in the previous steps
                if (! ecmr.compoundSignature ) {
                    throw new Error("Transaction is not valid. Attempt to set the status on DELIVERED before the compound admin signed!");
                }
                if (! ecmr.carrierLoadingSignature ) {
                    throw new Error("Transaction is not valid. Attempt to set the status on DELIVERED before the transporter signed for the loading!");
                }
                ecmr.carrierDeliverySignature = tx.ecmr.carrierDeliverySignature;
            }

            //if the recipient has confirmed the delivery and updated the ecmr status as CONFIRMED_DELIVERED, add the recipient signature
            if (ecmr.status === 'CONFIRMED_DELIVERED') {
                // check if the required signatures has been placed in the previous steps
                if (! ecmr.compoundSignature ) {
                    throw new Error("Transaction is not valid. Attempt to set the status on CONFIRMED_DELIVERED before the compound admin signed!");
                }
                if (! ecmr.carrierLoadingSignature ) {
                    throw new Error("Transaction is not valid. Attempt to set the status on CONFIRMED_DELIVERED before the transporter signed for the loading!");
                }
                if (! ecmr.carrierDeliverySignature ) {
                    throw new Error("Transaction is not valid. Attempt to set the status on CONFIRMED_DELIVERED before the transporter signed for the delivery!");
                }
                ecmr.recipientSignature = tx.ecmr.recipientSignature;
            }

            return getAssetRegistry('org.digitalcmr.ECMR')
                .then(function (assetRegistry) {
                    return assetRegistry.update(ecmr).catch(function (error) {
                        console.log('An error occurred while updating the registry asset: ' + error);
                        return error;
                    });
                }).catch(function (error) {
                    console.log('An error occurred while updating the ECMR asset: ' + error);
                    return error;
                });
        });
}
