#!/bin/bash
# startup hlf v1 and define the channel 'mychannel'

cd /hlfv1
SYSTEST=hlfv1 node create-channel.js
SYSTEST=hlfv1 node join-channel.js
echo "HLF V1 Runtime ready to go"

cd /bna

sleep 60

cat /root/.composer-connection-profiles/defaultProfile/connection.json

ls -la /root/.hfc-key-store
composer archive create -t dir -n .
composer network deploy \
    -a composer-boilerplate\@0.0.1.bna \
    -i $COMPOSER_USER \
    -s $COMPOSER_PASSWORD
