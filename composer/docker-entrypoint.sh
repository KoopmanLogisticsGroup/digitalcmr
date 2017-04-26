#!/bin/bash -e
# startup hlf v1 and define the channel 'mychannel'
cd /hlfv1
SYSTEST=hlfv1 node create-channel.js
SYSTEST=hlfv1 node join-channel.js
echo "HLF V1 Runtime ready to go."

# Deploy network
cd /bna
composer archive create -t dir -n .

# (TODO: can we make this variable to account for different processor speeds?)
#echo "Waiting for 60 seconds to allow the peers to get to know eachother"
#sleep 60

# We can consider building in a check to see if it exists and if so, upgrade instead of deploy.
composer network deploy \
    -a "${COMPOSER_NETWORK}@${COMPOSER_NETWORK_VERSION}.bna" \
    -i "${COMPOSER_USER}" \
    -s "${COMPOSER_PASSWORD}"

composer-rest-server \
    -p defaultProfile \
    -n "${COMPOSER_NETWORK}" \
    -i "${COMPOSER_USER}" \
    -s "${COMPOSER_PASSWORD}"

exec "$@"