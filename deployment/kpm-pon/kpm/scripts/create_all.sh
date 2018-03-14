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
create/create_blockchain.sh ${1}

echo ""
echo "=> CREATE_ALL: Running Create Channel"
PEER_MSPID="kpm-ponMSP" CHANNEL_NAME="channel1" create/create_channel.sh

echo ""
echo "=> CREATE_ALL: Running Join Channel on kpm-pon Peer1"
CHANNEL_NAME="channel1" PEER_MSPID="kpm-ponMSP" PEER_ADDRESS="blockchain-kpm-ponpeer:5010" MSP_CONFIGPATH="/fabric-config/crypto-config/peerOrganizations/kpm-pon/users/Admin@kpm-pon/msp" create/join_channel.sh

echo ""
echo "=> CREATE_ALL: Creating composer playground"
create/create_composer-playground.sh