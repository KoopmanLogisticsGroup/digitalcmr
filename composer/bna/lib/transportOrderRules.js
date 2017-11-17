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
 *  @param {org.digitalcmr.UpdateTransportOrder} tx - The update transport order transaction
 *  @return {Promise} Asset registry Promise
 *  @transaction
 */
function UpdateTransportOrderPickUpDateWindow(tx) {
  console.log('Invoking function processor to update DateWindow');
  console.log(tx);
  console.log(tx.order);
  console.log(tx.vin);
  console.log(tx.dateWindow);

  return getAssetRegistry('org.digitalcmr.TransportOrder')
    .then(function (assetRegistry) {
      for (var goodIndex = 0; goodIndex < tx.order.goods.length; goodIndex ++ ) {
        if (tx.order.goods[goodIndex].vehicle.vin === tx.vin) {
          transportOrder.order.goods[goodIndex].pickUpDateWindow = tx.dateWindow;
        }
      }
      return assetRegistry.update(transportOrder).catch(function (error) {
        console.log('[Update TransporOrder pickupwindow] An error occurred while updating the registry asset: ' + error);
        throw error;
      });
    }).catch(function (error) {
      console.log('[Update TransporOrder pickupwindow] An error occurred while retrieving the asset registry: ' + error);
      throw error;
    });
}


/**
 *  Update transport order transaction processor function
 *  @param {org.digitalcmr.UpdateTransportOrder} tx - The update transport order transaction
 *  @return {Promise} Asset registry Promise
 *  @transaction
 */
function UpdateTransportOrder(tx) {
  console.log('Invoking function processor to set update TransportOrder');
  console.log('TransportOrderID: ' + tx.transportOrder.orderID);

  // Get the asset registry for the asset.
  return getAssetRegistry('org.digitalcmr.TransportOrder')
    .then(function (assetRegistry) {
      return assetRegistry.get(tx.transportOrder.orderID).catch(function (error) {
        console.log('[Update TransportOrder] An error occured while getting the transport order from the registry: ' + error);
        throw error;
      });
    })
    .then(function (transportOrder) {
      for (var goodIndex = 0; goodIndex < transportOrder.goods.length; goodIndex++) {
        if (transportOrder.goods[goodIndex] !== tx.transportOrder.goods[goodIndex]) {
          transportOrder.goods[goodIndex] = tx.transportOrder.goods[goodIndex];
        }
      }
      return getAssetRegistry('org.digitalcmr.TransportOrder')
        .then(function (assetRegistry) {
          return assetRegistry.update(transportOrder).catch(function (error) {
            console.log('[Update TransportOrder] An error occured while updating the registry asset: ' + error);
            throw error;
          });
        }).catch(function (error) {
          console.log('[Update TransportOrder] An error occurred while getting the TransportOrder asset registry: ' + error);
          throw error;
        });
    });
}