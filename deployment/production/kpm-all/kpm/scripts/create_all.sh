#!/bin/bash

if [ "${PWD##*/}" == "create" ]; then
	:
elif [ "${PWD##*/}" == "scripts" ]; then
	:
else
    echo "Please run the script from 'scripts' or 'scripts/create' folder"
fi

echo ""
echo "=> CREATE_ALL: Creating blockchain"
GENESIS="production" create/create_blockchain.sh

NUMPENDING=$(kubectl get pods | grep kpm | awk '{print $5}' | grep 0 | wc -l | awk '{print $1}')
while [ "${NUMPENDING}" != "0" ]; do
    echo "Waiting on pending pods. Pods pending = ${NUMPENDING}"
    NUMPENDING=$(kubectl get pods | grep kpm | awk '{print $5}' | grep 0 | wc -l | awk '{print $1}')
done
sleep 30

echo ""
echo "=> CREATE_ALL: Copying crypto"
CHANNEL_FILE="production" GENESIS="production" create/create_cryptos.sh

echo ""
echo "=> CREATE_ALL: Running Create Channel"
CHANNEL_FILE="production" PEER_MSPID="kpm-allMSP" CHANNEL_NAME="kpmallchannel" ORDERER_ADDRESS="orderer-kpm-all:7050" create/create_channel.sh

echo ""
echo "=> CREATE_ALL: Running Join Channel on kpm-all Peer1"
CHANNEL_NAME="kpmallchannel" PEER_MSPID="kpm-allMSP" PEER_ADDRESS="peer0-kpm-all:5010" ORDERER_ADDRESS="orderer-kpm-all:7050" MSP_CONFIGPATH="/fabric-config/Admin@kpm-all/msp" create/join_channel.sh

echo ""
echo "=> CREATE_ALL: Deleting create and join channel pods"
delete/delete_channel-pods.sh

echo ""
echo "=> CREATE_ALL: Creating composer playground"
create/create_composer.sh

TIMEOUT=300
echo ""
echo "=> CREATE_ALL: Wait $TIMEOUT seconds after deploying to allow the admin user to be enrolled correctly..."
sleep $TIMEOUT