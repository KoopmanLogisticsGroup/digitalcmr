#!/bin/bash

if [ "${PWD##*/}" == "scripts" ]; then
	:
else
    echo "Please run the script from 'scripts' or 'scripts/create' folder"
fi


BASE_PATH=$(pwd)../../../../../config/kpm-pon-config
KPM_PATH=$BASE_PATH/kpm
PON_PATH=$BASE_PATH/pon
CONTAINER_BASE_PATH=/fabric-config
ORDERERS_PARTIAL_PATH=crypto-config/ordererOrganizations/orderers
CA_PARTIAL_PATH=crypto-config/ordererOrganizations/ca
KPM_PEERS_PARTIAL_PATH=crypto-config/peerOrganizations/peers
PON_PEERS_PARTIAL_PATH=crypto-config/peerOrganizations/peers


echo ""
echo "=> CREATE_ALL: Creating blockchain"
create/create_blockchain.sh ${1}
#
#echo ""
#echo "=> CREATE_ALL: Running Create Channel"
#PEER_MSPID="kpm-ponMSP" CHANNEL_NAME="channel1" create/create_channel.sh

# get pod names from k8s.
ORDERER_POD_NAME=$(kubectl get pod -l name=orderer-kpm-pon -o name | sed 's/pods\///')
CA_POD_NAME=$(kubectl get pod -l name=ca-kpm-pon -o name | sed 's/pods\///')
PEER_POD_NAME=$(kubectl get pod -l name=ca-kpm-pon -o name | sed 's/pods\///')

sleep 30

# Copy crypto-config to peer0.kpm-pon container
kubectl cp $KPM_PATH/$KPM_PEERS_PARTIAL_PATH/peer0.kpm-pon $PEER_POD_NAME:$CONTAINER_BASE_PATH/$KPM_PEERS_PARTIAL_PATH/peer0.kpm-pon
kubectl cp $KPM_PATH/ $PEER_POD_NAME:$CONTAINER_BASE_PATH/

# Copy crypto-config to orderer.kpm-pon container
kubectl cp $KPM_PATH/$ORDERERS_PARTIAL_PATH/orderer.kpm-pon $ORDERER_POD_NAME:$CONTAINER_BASE_PATH/$ORDERERS_PARTIAL_PATH/orderer.kpm-pon
kubectl cp $KPM_PATH/ $ORDERER_POD_NAME:$CONTAINER_BASE_PATH/

# Copy crypto-config to ca.kpm-pon container
kubectl cp $KPM_PATH/ $CA_POD_NAME:$CONTAINER_BASE_PATH/

echo ""
echo "=> CREATE_ALL: Running Join Channel on kpm-pon Peer1"
CHANNEL_NAME="channel1" PEER_MSPID="kpm-ponMSP" PEER_ADDRESS="blockchain-kpm-ponpeer:5010" MSP_CONFIGPATH="/fabric-config/crypto-config/peerOrganizations/kpm-pon/users/Admin@kpm-pon/msp" create/join_channel.sh

echo ""
echo "=> CREATE_ALL: Creating composer playground"
create/create_composer-playground.sh