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

NUMPENDING=$(kubectl get pods | grep pon | awk '{print $5}' | grep 0 | wc -l | awk '{print $1}')
while [ "${NUMPENDING}" != "0" ]; do
    echo "Waiting on pending pods. Pods pending = ${NUMPENDING}"
    NUMPENDING=$(kubectl get pods | grep pon | awk '{print $5}' | grep 0 | wc -l | awk '{print $1}')
done

echo ""
echo "=> CREATE_ALL: Copying crypto"
create/create_cryptos.sh

echo ""
echo "=> CREATE_ALL: Running Join Channel on pon Peer1"
CHANNEL_NAME="composerchannel" PEER_MSPID="ponMSP" PEER_ADDRESS="peer0-pon:5010" ORDERER_ADDRESS="159.122.177.125:31010" MSP_CONFIGPATH="/fabric-config/Admin@pon/msp" create/join_channel.sh

echo ""
echo "=> CREATE_ALL: Creating composer playground"
ORDERER_ADDRESS="159.122.177.125:31010" create/create_composer.sh