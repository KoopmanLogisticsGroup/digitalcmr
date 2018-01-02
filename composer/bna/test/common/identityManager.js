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

'use strict';
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const BrowserFS = require('browserfs/dist/node/index');
const bfs_fs = BrowserFS.BFSRequire('fs');
var Network = require('./network');
Network = new Network();
BrowserFS.initialize(new BrowserFS.FileSystem.InMemory());

var Identity = function () {
  this.users = {
    admin: {userID: 'admin', userSecret: 'randomString'},
    compoundAdmin: {userID: 'willem@amsterdamcompound.org', userSecret: ''},
    carrierMember: {userID: 'harry@koopman.org', userSecret: ''},
    recipientAdmin: {userID: 'rob@cardealer.org', userSecret: ''}
  };
};

/**
 * Reconnect using a different identity.
 * @param {Object} identity The identity to use.
 * @return {Promise} A promise that will be resolved when complete.
 */
Identity.prototype.useIdentity = function useIdentity(businessNetworkConnection, events, identity) {
  return businessNetworkConnection.disconnect()
    .then(() => {
      businessNetworkConnection = new BusinessNetworkConnection({fs: bfs_fs});
      events = [];
      businessNetworkConnection.on('event', (event) => {
        events.push(event);
      });
      return businessNetworkConnection.connect(Network.connectionProfile, Network.networkName, identity.userID, identity.userSecret);
    });
};

module.exports = Identity;