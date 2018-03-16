#!/bin/bash

if [ "${PWD##*/}" == "create" ]; then
	:
elif [ "${PWD##*/}" == "scripts" ]; then
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
# get pod names from k8s.
ORDERER_POD_NAME=$(kubectl get pod -l name=orderer-kpm-pon -o name | sed 's/pods\///')
CA_POD_NAME=$(kubectl get pod -l name=ca-kpm-pon -o name | sed 's/pods\///')
PEER_POD_NAME=$(kubectl get pod -l tier=peer0-kpm-pon -o name | sed 's/pods\///')

echo ""
echo "=> CREATE_ALL: Copying crypto config into peer"
# Copy crypto-config to peer0.kpm-pon container
kubectl cp $KPM_PATH/crypto-config/ $PEER_POD_NAME:$CONTAINER_BASE_PATH/
kubectl cp $BASE_PATH/composer-channel.tx $PEER_POD_NAME:$CONTAINER_BASE_PATH/composer-channel.tx
kubectl cp $BASE_PATH/composer-genesis.block $PEER_POD_NAME:$CONTAINER_BASE_PATH/composer-genesis.block

echo "=> CREATE_ALL: Copying crypto config into orderer"
# Copy crypto-config to orderer.kpm-pon container
kubectl cp $KPM_PATH/crypto-config/ $ORDERER_POD_NAME:$CONTAINER_BASE_PATH/
kubectl cp $BASE_PATH/composer-channel.tx $ORDERER_POD_NAME:$CONTAINER_BASE_PATH/composer-channel.tx
kubectl cp $BASE_PATH/composer-genesis.block $ORDERER_POD_NAME:$CONTAINER_BASE_PATH/composer-genesis.block

echo "=> CREATE_ALL: Copying crypto config into ca"
# Copy crypto-config to ca.kpm-pon container
kubectl cp $KPM_PATH/crypto-config/ $CA_POD_NAME:$CONTAINER_BASE_PATH/
kubectl cp $BASE_PATH/cas/ca.yaml $CA_POD_NAME:$CONTAINER_BASE_PATH/ca.yaml
kubectl cp $BASE_PATH/composer-channel.tx $CA_POD_NAME:$CONTAINER_BASE_PATH/composer-channel.tx
kubectl cp $BASE_PATH/composer-genesis.block $CA_POD_NAME:$CONTAINER_BASE_PATH/composer-genesis.block
echo "=> CREATE_ALL: done"

echo ""
echo "=> CREATE_ALL: Running Create Channel"
PEER_MSPID="kpm-ponMSP" CHANNEL_NAME="composerchannel" create/create_channel.sh

echo ""
echo "=> CREATE_ALL: Running Join Channel on kpm-pon Peer1"
CHANNEL_NAME="composerchannel" PEER_MSPID="kpm-ponMSP" PEER_ADDRESS="peer0-kpm-pon:5010" MSP_CONFIGPATH="/fabric-config/crypto-config/peerOrganizations/users/Admin@kpm-pon/msp" create/join_channel.sh

echo ""
echo "=> CREATE_ALL: Creating composer playground"
create/create_composer-playground.sh