#!/usr/bin/env bash

# be sure to be at the level at this script before executing
if [ "${PWD##*/}" == "kpm-pon" ]; then
	:
else
    echo "Please run the deployment script from 'kpm-pon' folder"
fi

# set variables
BASE_PATH=$(pwd)../../config/kpm-pon-config
KPM_PATH=$BASE_PATH/kpm
PON_PATH=$BASE_PATH/pon
CONTAINER_BASE_PATH=/fabric-config
ORDERERS_PARTIAL_PATH=crypto-config/ordererOrganizations/orderers
CA_PARTIAL_PATH=crypto-config/ordererOrganizations/ca
KPM_PEERS_PARTIAL_PATH=crypto-config/peerOrganizations/peers
PON_PEERS_PARTIAL_PATH=crypto-config/peerOrganizations/peers

# Copy crypto-config to orderer.kpm-pon container
kubectl cp $KPM_PATH/$ORDERERS_PARTIAL_PATH/orderer.kpm-pon orderer.kpm-pon:$CONTAINER_BASE_PATH/$ORDERERS_PARTIAL_PATH/orderer.kpm-pon
kubectl cp $KPM_PATH/composer-genesis.block orderer.kpm-pon:$CONTAINER_BASE_PATH/composer-genesis.block

# Copy crypto-config to ca.kpm-pon container
kubectl cp $KPM_PATH/$CA_PARTIAL_PATH ca.kpm-pon:$CONTAINER_BASE_PATH/$CA_PARTIAL_PATH

# Copy crypto-config to peer0.kpm-pon container
kubectl cp $KPM_PATH/$KPM_PEERS_PARTIAL_PATH/peer0.kpm-pon peer0.kpm-pon:$CONTAINER_BASE_PATH/$KPM_PEERS_PARTIAL_PATH/peer0.kpm-pon
kubectl cp $KPM_PATH/composer-genesis.block peer0.kpm-pon:$CONTAINER_BASE_PATH/composer-genesis.block
kubectl cp $KPM_PATH/composer-channel.tx peer0.kpm-pon:$CONTAINER_BASE_PATH/composer-channel.tx

# Copy crypto-config to joinchannels
kubectl cp $KPM_PATH/$KPM_PEERS_PARTIAL_PATH/peer0.kpm-pon joinchannel:$CONTAINER_BASE_PATH/$KPM_PEERS_PARTIAL_PATH/peer0.kpm-pon
kubectl cp $KPM_PATH/composer-genesis.block joinchannel:$CONTAINER_BASE_PATH/composer-genesis.block
kubectl cp $KPM_PATH/composer-channel.tx joinchannel:$CONTAINER_BASE_PATH/composer-channel.tx

# Copy crypto-config to composer-identity-import
kubectl cp $KPM_PATH/ composer-identity-import-kpm:$CONTAINER_BASE_PATH

# Copy crypto-config to ca.pon container
kubectl cp $PON_PATH/$CA_PARTIAL_PATH ca.pon:$CONTAINER_BASE_PATH/$CA_PARTIAL_PATH

# Copy crypto-config to peer0.pon container
kubectl cp $PON_PATH/$PON_PEERS_PARTIAL_PATH/peer0.pon peer0.pon:$CONTAINER_BASE_PATH/$PON_PEERS_PARTIAL_PATH/peer0.pon
kubectl cp $PON_PATH/composer-genesis.block peer0.pon:$CONTAINER_BASE_PATH/composer-genesis.block
kubectl cp $PON_PATH/composer-channel.tx peer0.pon:$CONTAINER_BASE_PATH/composer-channel.tx

# Copy crypto-config to composer-identity-import
kubectl cp $KPM_PATH/ composer-identity-import-pon:$CONTAINER_BASE_PATH
