#!/bin/bash

BASE_PATH=$(pwd)../../../../../../composer/hlfv1/config/kpm-pon-config-production
KPM_PATH=$BASE_PATH/kpm
PON_PATH=$BASE_PATH/pon
CONTAINER_BASE_PATH=/fabric-config
KPM_ORDERERS_PARTIAL_PATH=crypto-config/ordererOrganizations/kpm-pon/orderers/orderer.kpm-pon/msp
CA_PARTIAL_PATH=crypto-config/peerOrganizations/kpm-pon/ca
KPM_PEERS_PARTIAL_PATH=crypto-config/peerOrganizations/kpm-pon/peers/peer0.kpm-pon/msp
PON_PEERS_PARTIAL_PATH=crypto-config/peerOrganizations/pon/peers

# get pod names from k8s.
ORDERER_POD_NAME=$(kubectl get pod -l name=orderer-kpm-pon -o name | sed 's/pods\///')
CA_POD_NAME=$(kubectl get pod -l name=ca-kpm-pon -o name | sed 's/pods\///')
PEER_POD_NAME=$(kubectl get pod -l tier=peer0-kpm-pon -o name | sed 's/pods\///')

echo "=> CREATE_ALL: Copying crypto config into ca"
# Copy crypto-config to ca.kpm-pon container
kubectl cp $KPM_PATH/$CA_PARTIAL_PATH/ $CA_POD_NAME:$CONTAINER_BASE_PATH/ca/

sleep 5

# Default to "production" if not defined
if [ -z ${CHANNEL_FILE} ]; then
	echo "CHANNEL_FILE not defined. I will use \"production\"."
	echo "I will wait 5 seconds before continuing."
	sleep 5
fi
CHANNEL_FILE=${CHANNEL_FILE:-production}

# Default to "production" if not defined
if [ -z ${GENESIS} ]; then
	echo "GENESIS not defined. I will use \"production\"."
	echo "I will wait 5 seconds before continuing."
	sleep 5
fi
GENESIS=${GENESIS:-production}

echo "=> CREATE_ALL: Copying crypto config into orderer"
# Copy crypto-config to orderer.kpm-pon container
kubectl cp $KPM_PATH/$KPM_ORDERERS_PARTIAL_PATH/ $ORDERER_POD_NAME:$CONTAINER_BASE_PATH/msp/
kubectl cp $BASE_PATH/$GENESIS.block $ORDERER_POD_NAME:$CONTAINER_BASE_PATH/$GENESIS.block

sleep 5

echo "=> CREATE_ALL: Copying crypto config into peer"
# Copy crypto-config to peer0.kpm-pon container
kubectl cp $KPM_PATH/$KPM_PEERS_PARTIAL_PATH/ $PEER_POD_NAME:$CONTAINER_BASE_PATH/msp/

echo "=> CREATE_ALL: done"