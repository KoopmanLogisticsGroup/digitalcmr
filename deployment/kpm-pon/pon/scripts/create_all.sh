#!/bin/bash

if [ "${PWD##*/}" == "create" ]; then
	:
elif [ "${PWD##*/}" == "scripts" ]; then
	:
else
    echo "Please run the script from 'scripts' or 'scripts/create' folder"
fi


BASE_PATH=$(pwd)../../../../../composer/hlfv1/config/kpm-pon-config
PON_PATH=$BASE_PATH/pon
CONTAINER_BASE_PATH=/fabric-config
PON_CA_PARTIAL_PATH=crypto-config/peerOrganizations/pon/ca
PON_PEERS_PARTIAL_PATH=crypto-config/peerOrganizations/pon/peers/peer0.pon/msp

echo ""
echo "=> CREATE_ALL: Creating blockchain"
create/create_blockchain.sh

# get pod names from k8s
CA_POD_NAME=$(kubectl get pod -l name=ca-pon -o name | sed 's/pods\///')
PEER_POD_NAME=$(kubectl get pod -l tier=peer0-pon -o name | sed 's/pods\///')

echo ""
echo "=> CREATE_ALL: Copying crypto config into peer"
# Copy crypto-config to peer0-pon container
kubectl cp $PON_PATH/$PON_PEERS_PARTIAL_PATH/ $PEER_POD_NAME:$CONTAINER_BASE_PATH/msp/

echo "=> CREATE_ALL: Copying crypto config into ca"
# Copy crypto-config to ca-pon container
kubectl cp $PON_PATH/$PON_CA_PARTIAL_PATH/ $CA_POD_NAME:$CONTAINER_BASE_PATH/ca/
echo "=> CREATE_ALL: done"

echo ""
echo "=> CREATE_ALL: Running Join Channel on pon Peer0"
ORDERER_ADDRESS="159.122.174.172:31010" CHANNEL_NAME="composerchannel" PEER_MSPID="ponMSP" PEER_ADDRESS="peer0-pon:5010" MSP_CONFIGPATH="/fabric-config/Admin@pon/msp" create/join_channel.sh