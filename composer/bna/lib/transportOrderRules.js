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
 * Create transport order transaction processor function.
 * @param {org.digitalcmr.CreateTransportOrder} tx - The create transport order transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function CreateTransportOrder(tx) {
  console.log('Invoking function: CreateTransportOrder');

  // Get the asset registry for the asset.
  return getAssetRegistry('org.digitalcmr.TransportOrder')
    .then(function (assetRegistry) {
      return assetRegistry.add(tx.transportOrder)
        .then(function () {
          console.log('Asset added with success');
        })
        .catch(function (error) {
          console.log('An error occurred while add transport order assets', error);
          throw error;
        })
    }).catch(function (error) {
      console.log('An error occurred while retrieving the asset registry', error);
      throw error;
    })
}

/**
 * Create transport orders transaction processor function.
 * @param {org.digitalcmr.CreateTransportOrders} tx - The create transport orders transaction
 * @return {Promise} Asset registry Promise
 * @transaction
 */
function CreateTransportOrders(tx) {
  console.log('Invoking function: CreateTransportOrders');

  // Get the asset registry for the asset.
  return getAssetRegistry('org.digitalcmr.TransportOrder')
    .then(function (assetRegistry) {
      return assetRegistry.addAll(tx.transportOrders)
        .then(function () {
          console.log('Assets added with success');
        })
        .catch(function (error) {
          console.log('An error occurred while addAll transport orders assets', error);
          throw error;
        })
    }).catch(function (error) {
      console.log('An error occurred while retrieving the asset registry', error);
      throw error;
    })
}

/**
 *  Update DateWindow transport order transaction processor function
 *  @param {org.digitalcmr.UpdateTransportOrderPickupWindow} tx - The update transport order transaction
 *  @return {Promise} Asset registry Promise
 *  @transaction
 */
function UpdateTransportOrderPickupWindow(tx) {
  console.log('Invoking function processor to update DateWindow');

  return getAssetRegistry('org.digitalcmr.TransportOrder')
    .then(function (assetRegistry) {
      for (var goodIndex = 0; goodIndex < tx.transportOrder.goods.length; goodIndex++) {
        if (tx.transportOrder.goods[goodIndex].vehicle.vin === tx.vin) {
          tx.transportOrder.goods[goodIndex].pickupWindow = tx.dateWindow;
        }
      }
      return assetRegistry.update(tx.transportOrder).catch(function (error) {
        console.log('[Update TransporOrder pickupwindow] An error occurred while updating the registry asset: ' + error);
        throw error;
      });
    }).catch(function (error) {
      console.log('[Update TransporOrder pickupwindow] An error occurred while retrieving the asset registry: ' + error);
      throw error;
    });
}