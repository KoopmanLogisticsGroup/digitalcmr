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
create/create_blockchain.sh

NUMPENDING=$(kubectl get pods | grep kpm | awk '{print $5}' | grep 0 | wc -l | awk '{print $1}')
while [ "${NUMPENDING}" != "0" ]; do
    echo "Waiting on pending pods. Pods pending = ${NUMPENDING}"
    NUMPENDING=$(kubectl get pods | grep kpm | awk '{print $5}' | grep 0 | wc -l | awk '{print $1}')
done

echo ""
echo "=> CREATE_ALL: Copying crypto"
create/create_cryptos.sh

echo ""
echo "=> CREATE_ALL: Running Create Channel"
PEER_MSPID="kpm-ponMSP" CHANNEL_NAME="composerchannel" ORDERER_ADDRESS="orderer-kpm-pon:7050" create/create_channel.sh

echo ""
echo "=> CREATE_ALL: Running Join Channel on kpm-pon Peer1"
CHANNEL_NAME="composerchannel" PEER_MSPID="kpm-ponMSP" PEER_ADDRESS="peer0-kpm-pon:5010" ORDERER_ADDRESS="orderer-kpm-pon:7050" MSP_CONFIGPATH="/fabric-config/Admin@kpm-pon/msp" create/join_channel.sh

echo ""
echo "=> CREATE_ALL: Deleting create and join channel pods"
delete/delete_channel-pods.sh

echo ""
echo "=> CREATE_ALL: Creating composer playground"
create/create_composer.sh