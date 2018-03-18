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
KPM_ORDERERS_PARTIAL_PATH=crypto-config/ordererOrganizations/kpm-pon/orderers/orderer.kpm-pon/msp
KPM_CA_PARTIAL_PATH=crypto-config/peerOrganizations/kpm-pon/ca
PON_CA_PARTIAL_PATH=crypto-config/peerOrganizations/pon/ca
KPM_PEERS_PARTIAL_PATH=crypto-config/peerOrganizations/kpm-pon/peers/peer0.kpm-pon/msp
PON_PEERS_PARTIAL_PATH=crypto-config/peerOrganizations/pon/peers/peer0.pon/msp

# run kpm network
./kpm/scripts/create_all.sh
