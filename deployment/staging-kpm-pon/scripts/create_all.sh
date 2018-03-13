#!/bin/bash

if [ "${PWD##*/}" == "create" ]; then
	:
elif [ "${PWD##*/}" == "scripts" ]; then
	:
else
    echo "Please run the script from 'scripts' or 'scripts/create' folder"
fi

echo ""
echo "=> CREATE_ALL: Creating blockchain"
create/create_blockchain.sh ${1}

echo ""
echo "=> CREATE_ALL: Running Create Channel"
PEER_MSPID="kpm-ponMSP" CHANNEL_NAME="channel1" create/create_channel.sh

echo ""
echo "=> CREATE_ALL: Running Join Channel on kpm-pon Peer1"
CHANNEL_NAME="channel1" PEER_MSPID="kpm-ponMSP" PEER_ADDRESS="blockchain-kpm-ponpeer1:5010" MSP_CONFIGPATH="/shared/crypto-config/peerOrganizations/kpm-pon/users/Admin@kpm-pon/msp" create/join_channel.sh

echo "=> CREATE_ALL: Running Join Channel on pon Peer1"
CHANNEL_NAME="channel1" PEER_MSPID="ponMSP" PEER_ADDRESS="blockchain-ponpeer1:5010" MSP_CONFIGPATH="/shared/crypto-config/peerOrganizations/pon/users/Admin@pon/msp" create/join_channel.sh

echo ""
echo "=> CREATE_ALL: Creating composer playground"
create/create_composer-playground.sh

# Can't create this until the user has performed manual actions in the Composer Playground.
# echo ""
# echo "=> CREATE_ALL: Creating composer rest server"
# create/create_composer-rest-server.sh

#echo ""
#echo "=> CREATE_ALL: Running Install Chaincode on kpm-pon Peer1"
#CHAINCODE_NAME="example02" CHAINCODE_VERSION="v1" MSP_CONFIGPATH="/shared/crypto-config/peerOrganizations/kpm-pon/users/Admin@kpm-pon/msp"  PEER_MSPID="kpm-ponMSP" PEER_ADDRESS="blockchain-kpm-ponpeer1:5010" create/chaincode_install.sh

#echo ""
#echo "=> CREATE_ALL: Running Install Chaincode on pon Peer1"
#CHAINCODE_NAME="example02" CHAINCODE_VERSION="v1" MSP_CONFIGPATH="/shared/crypto-config/peerOrganizations/pon/users/Admin@pon/msp"  PEER_MSPID="ponMSP" PEER_ADDRESS="blockchain-ponpeer1:5010" create/chaincode_install.sh
#
#echo ""
#echo "=> CREATE_ALL: Running instantiate chaincode on channel \"channel1\" using \"kpm-ponMSP\""
#CHANNEL_NAME="channel1" CHAINCODE_NAME="example02" CHAINCODE_VERSION="v1" MSP_CONFIGPATH="/shared/crypto-config/peerOrganizations/kpm-pon/users/Admin@kpm-pon/msp"  PEER_MSPID="kpm-ponMSP" PEER_ADDRESS="blockchain-kpm-ponpeer1:5010" create/chaincode_instantiate.sh
