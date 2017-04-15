#!/bin/bash
# startup hlf v1 and define the channel 'mychannel'
cd /hlfv1
SYSTEST=hlfv1 node create-channel.js
SYSTEST=hlfv1 node join-channel.js
echo "HLF V1 Runtime ready to go. Waiting 30 seconds to deploy business network"

cd /bna
sleep 30

# Deploy network
composer archive create -t dir -n .
composer network deploy \
    -a $COMPOSER_NETWORK\@$COMPOSER_NETWORK_VERSION.bna \
    -i $COMPOSER_USER \
    -s $COMPOSER_PASSWORD
