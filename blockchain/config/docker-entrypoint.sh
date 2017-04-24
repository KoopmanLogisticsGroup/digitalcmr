#!/bin/bash -e
# startup hlf v1 and define the channel 'mychannel'
cd /hlfv1
SYSTEST=hlfv1 node create-channel.js
SYSTEST=hlfv1 node join-channel.js

echo "HLF V1 Runtime ready to go."

# Deploy network
cd /bna
composer archive create -t dir -n .
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