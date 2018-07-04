#!/bin/bash

BASE_PATH=$(pwd)../../../../../../composer/hlfv1/config/kpm-alliance-config-trial
CRYPTO_PATH=$BASE_PATH/all
CONTAINER_BASE_PATH=/fabric-config
CA_PARTIAL_PATH=crypto-config/peerOrganizations/all/ca
PEERS_PARTIAL_PATH=crypto-config/peerOrganizations/all/peers/peer0.all/msp

# get pod names from k8s.
CA_POD_NAME=$(kubectl get pod -l name=ca-all -o name | sed 's/pods\///')
PEER_POD_NAME=$(kubectl get pod -l tier=peer0-all -o name | sed 's/pods\///')

echo "=> CREATE_ALL: Copying crypto config into ca"
# Copy crypto-config to ca-all container
kubectl cp $CRYPTO_PATH/$CA_PARTIAL_PATH/ $CA_POD_NAME:$CONTAINER_BASE_PATH/ca/

sleep 5

echo "=> CREATE_ALL: Copying crypto config into peer"
# Copy crypto-config to peer0-all container
kubectl cp $CRYPTO_PATH/$PEERS_PARTIAL_PATH/ $PEER_POD_NAME:$CONTAINER_BASE_PATH/msp/

echo "=> CREATE_ALL: done"