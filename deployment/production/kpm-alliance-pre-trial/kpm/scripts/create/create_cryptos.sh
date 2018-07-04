#!/bin/bash

BASE_PATH=$(pwd)../../../../../../composer/hlfv1/config/kpm-alliance-config-pre-trial
KPM_PATH=$BASE_PATH/kpm
all_PATH=$BASE_PATH/all
CONTAINER_BASE_PATH=/fabric-config
KPM_ORDERERS_PARTIAL_PATH=crypto-config/ordererOrganizations/kpm-all/orderers/orderer.kpm-all/msp
CA_PARTIAL_PATH=crypto-config/peerOrganizations/kpm-all/ca
KPM_PEERS_PARTIAL_PATH=crypto-config/peerOrganizations/kpm-all/peers/peer0.kpm-all/msp
all_PEERS_PARTIAL_PATH=crypto-config/peerOrganizations/all/peers

# get pod names from k8s.
ORDERER_POD_NAME=$(kubectl get pod -l name=orderer-kpm-all -o name | sed 's/pods\///')
CA_POD_NAME=$(kubectl get pod -l name=ca-kpm-all -o name | sed 's/pods\///')
PEER_POD_NAME=$(kubectl get pod -l tier=peer0-kpm-all -o name | sed 's/pods\///')

echo "=> CREATE_ALL: Copying crypto config into ca"
# Copy crypto-config to ca.kpm-all container
kubectl cp $KPM_PATH/$CA_PARTIAL_PATH/ $CA_POD_NAME:$CONTAINER_BASE_PATH/ca/

sleep 5

# Default to "pre-trial" if not defined
if [ -z ${CHANNEL_FILE} ]; then
	echo "CHANNEL_FILE not defined. I will use \"pre-trial\"."
	echo "I will wait 5 seconds before continuing."
	sleep 5
fi
CHANNEL_FILE=${CHANNEL_FILE:-pre-trial}

# Default to "pre-trial" if not defined
if [ -z ${GENESIS} ]; then
	echo "GENESIS not defined. I will use \"pre-trial\"."
	echo "I will wait 5 seconds before continuing."
	sleep 5
fi
GENESIS=${GENESIS:-pre-trial}

echo "=> CREATE_ALL: Copying crypto config into orderer"
# Copy crypto-config to orderer.kpm-all container
kubectl cp $KPM_PATH/$KPM_ORDERERS_PARTIAL_PATH/ $ORDERER_POD_NAME:$CONTAINER_BASE_PATH/msp/
kubectl cp $BASE_PATH/$GENESIS.block $ORDERER_POD_NAME:$CONTAINER_BASE_PATH/$GENESIS.block

sleep 5

echo "=> CREATE_ALL: Copying crypto config into peer"
# Copy crypto-config to peer0.kpm-all container
kubectl cp $KPM_PATH/$KPM_PEERS_PARTIAL_PATH/ $PEER_POD_NAME:$CONTAINER_BASE_PATH/msp/

echo "=> CREATE_ALL: done"