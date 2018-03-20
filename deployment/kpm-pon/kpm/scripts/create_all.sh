#!/bin/bash

BASE_PATH=$(pwd)../../../../../composer/hlfv1/config/kpm-pon-config
KPM_PATH=$BASE_PATH/kpm
PON_PATH=$BASE_PATH/pon
CONTAINER_BASE_PATH=/fabric-config
KPM_ORDERERS_PARTIAL_PATH=crypto-config/ordererOrganizations/kpm-pon/orderers/orderer.kpm-pon/msp
CA_PARTIAL_PATH=crypto-config/peerOrganizations/kpm-pon/ca
KPM_PEERS_PARTIAL_PATH=crypto-config/peerOrganizations/kpm-pon/peers/peer0.kpm-pon/msp
PON_PEERS_PARTIAL_PATH=crypto-config/peerOrganizations/pon/peers

if [ "${PWD##*/}" == "create" ]; then
	:
elif [ "${PWD##*/}" == "scripts" ]; then
	:
else
    echo "Please run the script from 'scripts' or 'scripts/create' folder"
fi

echo ""
echo "=> CREATE_ALL: Creating blockchain"
create/create_blockchain.sh

# get pod names from k8s.
ORDERER_POD_NAME=$(kubectl get pod -l name=orderer-kpm-pon -o name | sed 's/pods\///')
CA_POD_NAME=$(kubectl get pod -l name=ca-kpm-pon -o name | sed 's/pods\///')
PEER_POD_NAME=$(kubectl get pod -l tier=peer0-kpm-pon -o name | sed 's/pods\///')

NUMPENDING=$(kubectl get pods | grep kpm | awk '{print $5}' | grep 0 | wc -l | awk '{print $1}')
while [ "${NUMPENDING}" != "0" ]; do
    echo "Waiting on pending pods. Pods pending = ${NUMPENDING}"
    NUMPENDING=$(kubectl get pods | grep kpm | awk '{print $5}' | grep 0 | wc -l | awk '{print $1}')
done

echo "=> CREATE_ALL: Copying crypto config into ca"
# Copy crypto-config to ca.kpm-pon container
kubectl cp $KPM_PATH/$CA_PARTIAL_PATH/ $CA_POD_NAME:$CONTAINER_BASE_PATH/ca/

sleep 5

echo "=> CREATE_ALL: Copying crypto config into orderer"
# Copy crypto-config to orderer.kpm-pon container
kubectl cp $KPM_PATH/$KPM_ORDERERS_PARTIAL_PATH/ $ORDERER_POD_NAME:$CONTAINER_BASE_PATH/msp/
kubectl cp $BASE_PATH/composer-channel.tx $ORDERER_POD_NAME:$CONTAINER_BASE_PATH/composer-channel.tx
kubectl cp $BASE_PATH/composer-genesis.block $ORDERER_POD_NAME:$CONTAINER_BASE_PATH/composer-genesis.block

sleep 5

echo ""
echo "=> CREATE_ALL: Copying crypto config into peer"
# Copy crypto-config to peer0.kpm-pon container
kubectl cp $KPM_PATH/$KPM_PEERS_PARTIAL_PATH/ $PEER_POD_NAME:$CONTAINER_BASE_PATH/msp/
kubectl cp $BASE_PATH/composer-channel.tx $PEER_POD_NAME:$CONTAINER_BASE_PATH/composer-channel.tx
kubectl cp $BASE_PATH/composer-genesis.block $PEER_POD_NAME:$CONTAINER_BASE_PATH/composer-genesis.block

echo "=> CREATE_ALL: done"

echo ""
echo "=> CREATE_ALL: Running Create Channel"
PEER_MSPID="kpm-ponMSP" CHANNEL_NAME="composerchannel" ORDERER_ADDRESS="orderer-kpm-pon:31010" create/create_channel.sh

NUMPENDING=$(kubectl get pods | grep kpm | awk '{print $5}' | grep 0 | wc -l | awk '{print $1}')
while [ "${NUMPENDING}" != "0" ]; do
    echo "Waiting on pending pods. Pods pending = ${NUMPENDING}"
    NUMPENDING=$(kubectl get pods | grep kpm | awk '{print $5}' | grep 0 | wc -l | awk '{print $1}')
done

echo ""
echo "=> CREATE_ALL: Running Join Channel on kpm-pon Peer1"
CHANNEL_NAME="composerchannel" PEER_MSPID="kpm-ponMSP" PEER_ADDRESS="peer0-kpm-pon:5010" ORDERER_ADDRESS="orderer-kpm-pon:31010" MSP_CONFIGPATH="/fabric-config/Admin@kpm-pon/msp" create/join_channel.sh

echo ""
echo "=> CREATE_ALL: Creating composer playground"
create/create_composer-playground.sh