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
create/recover_blockchain.sh

NUMPENDING=$(kubectl get pods | grep all | awk '{print $5}' | grep 0 | wc -l | awk '{print $1}')
while [ "${NUMPENDING}" != "0" ]; do
    echo "Waiting on pending pods. Pods pending = ${NUMPENDING}"
    NUMPENDING=$(kubectl get pods | grep all | awk '{print $5}' | grep 0 | wc -l | awk '{print $1}')
done
sleep 60

echo ""
echo "=> CREATE_ALL: Copying crypto"
create/create_cryptos.sh

echo ""
echo "=> CREATE_ALL: Running Join Channel on all Peer1"
CHANNEL_NAME="kpmalliancepretrialchannel" PEER_MSPID="allMSP" PEER_ADDRESS="peer0-all:5010" ORDERER_ADDRESS="149.81.124.89:31010" MSP_CONFIGPATH="/fabric-config/Admin@all/msp" create/join_channel.sh

echo ""
echo "=> CREATE_ALL: Deleting create and join channel pods"
delete/delete_channel-pods.sh

echo ""
echo "=> CREATE_ALL: Creating composer playground"
ORDERER_ADDRESS="149.81.124.89:31010" create/create_composer.sh

TIMEOUT=300
echo ""
echo "=> CREATE_ALL: Wait $TIMEOUT seconds after deploying to allow the admin user to be enrolled correctly..."
sleep $TIMEOUT