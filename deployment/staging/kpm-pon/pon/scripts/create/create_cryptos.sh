#!/bin/bash

BASE_PATH=$(pwd)../../../../../../composer/hlfv1/config/kpm-pon-config
CRYPTO_PATH=$BASE_PATH/pon
CONTAINER_BASE_PATH=/fabric-config
CA_PARTIAL_PATH=crypto-config/peerOrganizations/pon/ca
PEERS_PARTIAL_PATH=crypto-config/peerOrganizations/pon/peers/peer0.pon/msp

# get pod names from k8s.
CA_POD_NAME=$(kubectl get pod -l name=ca-pon -o name | sed 's/pods\///')
PEER_POD_NAME=$(kubectl get pod -l tier=peer0-pon -o name | sed 's/pods\///')

echo "=> CREATE_ALL: Copying crypto config into ca"
# Copy crypto-config to ca-pon container
kubectl cp $CRYPTO_PATH/$CA_PARTIAL_PATH/ $CA_POD_NAME:$CONTAINER_BASE_PATH/ca/

sleep 5

echo "=> CREATE_ALL: Copying crypto config into peer"
# Copy crypto-config to peer0-pon container
kubectl cp $CRYPTO_PATH/$PEERS_PARTIAL_PATH/ $PEER_POD_NAME:$CONTAINER_BASE_PATH/msp/

echo "=> CREATE_ALL: done"