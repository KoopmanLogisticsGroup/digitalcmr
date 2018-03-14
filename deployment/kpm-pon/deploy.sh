#!/usr/bin/env bash

# be sure to be at the level at this script before executing
BASE_PATH=$(pwd)../../config/kpm-pon-config
KPM_PATH=$BASE_PATH/kpm
PON_PATH=$BASE_PATH/pon
CONTAINER_BASE_PATH=/fabric-config
ORDERERS_PARTIAL_PATH=crypto-config/ordererOrganizations/orderers
CA_PARTIAL_PATH=crypto-config/ordererOrganizations/ca
KPM_PEERS_PARTIAL_PATH=crypto-config/peerOrganizations/kpm-pon/peers
PON_PEERS_PARTIAL_PATH=crypto-config/peerOrganizations/pon/peers

# Copy crypto-config to orderer.kpm-pon container
kubectl cp $KPM_PATH/$ORDERERS_PARTIAL_PATH/orderer.kpm-pon orderer.kpm-pon:$CONTAINER_BASE_PATH/$ORDERERS_PARTIAL_PATH/orderer.kpm-pon

# Copy crypto-config to ca.kpm-pon container
kubectl cp $KPM_PATH/$CA_PARTIAL_PATH ca.kpm-pon:$CONTAINER_BASE_PATH/$CA_PARTIAL_PATH

# Copy crypto-config to peer0.kpm-pon container
kubectl cp $KPM_PATH/$KPM_PEERS_PARTIAL_PATH/peer0.kpm-pon peer0.kpm-pon:$CONTAINER_BASE_PATH/$KPM_PEERS_PARTIAL_PATH/peer0.kpm-pon

# Copy crypto-config to ca.pon container
kubectl cp $PON_PATH/$CA_PARTIAL_PATH ca.pon:$CONTAINER_BASE_PATH/$CA_PARTIAL_PATH

# Copy crypto-config to peer0.pon container
kubectl cp $PON_PATH/$PON_PEERS_PARTIAL_PATH/peer0.pon peer0.pon:$CONTAINER_BASE_PATH/$PON_PEERS_PARTIAL_PATH/peer0.pon