#!/bin/bash

if [ "${PWD##*/}" == "create" ]; then
    KUBECONFIG_FOLDER=${PWD}/../../kube-configs/channels
elif [ "${PWD##*/}" == "scripts" ]; then
    KUBECONFIG_FOLDER=${PWD}/../kube-configs/channels
else
    echo "Please run the script from 'scripts' or 'scripts/create' folder"
fi

BASE_PATH=$(pwd)../../../../../config/kpm-pon-config
KPM_PATH=$BASE_PATH/kpm
CONTAINER_BASE_PATH=/fabric-config
KPM_PEERS_PARTIAL_PATH=crypto-config/peerOrganizations/peers

# Default to peer 1's address if not defined
if [ -z "${PEER_ADDRESS}" ]; then
	echo "PEER_ADDRESS not defined. I will use \"blockchain-peer0.kpm-pon:5010\"."
	echo "I will wait 5 seconds before continuing."
	sleep 5
fi
PEER_ADDRESS=${PEER_ADDRESS:-blockchain-peer0.kpm-pon:5010}

# Default to "kpm-ponMSP" if not defined
if [ -z ${PEER_MSPID} ]; then
	echo "PEER_MSPID not defined. I will use \"kpm-ponMSP\"."
	echo "I will wait 5 seconds before continuing."
	sleep 5
fi
PEER_MSPID=${PEER_MSPID:-kpm-ponMSP}

# Default to "channel1" if not defined
if [ -z "${CHANNEL_NAME}" ]; then
	echo "CHANNEL_NAME not defined. I will use \"composerchannel\"."
	echo "I will wait 5 seconds before continuing."
	sleep 5
fi
CHANNEL_NAME=${CHANNEL_NAME:-composerchannel}

# Default to "admin for peer1" if not defined
if [ -z "${MSP_CONFIGPATH}" ]; then
	echo "MSP_CONFIGPATH not defined. I will use \"/fabric-config/crypto-config/peerOrganizations/kpm-pon/users/Admin@org1.example.com/msp\"."
	echo "I will wait 5 seconds before continuing."
	sleep 5
fi
MSP_CONFIGPATH=${MSP_CONFIGPATH:-/fabric-config/crypto-config/peerOrganizations/users/Admin@kpm-pon/msp}

echo "Deleting old channel pods if exists"
echo "Running: ${KUBECONFIG_FOLDER}/../scripts/delete/delete_channel-pods.sh"
${KUBECONFIG_FOLDER}/../scripts/delete/delete_channel-pods.sh

echo "Preparing yaml for joinchannel pod"
sed -e "s/%PEER_ADDRESS%/${PEER_ADDRESS}/g" -e "s/%CHANNEL_NAME%/${CHANNEL_NAME}/g" -e "s/%PEER_MSPID%/${PEER_MSPID}/g" -e "s|%MSP_CONFIGPATH%|${MSP_CONFIGPATH}|g" ${KUBECONFIG_FOLDER}/join_channel.yaml.base > ${KUBECONFIG_FOLDER}/join_channel.yaml

echo "Creating joinchannel pod"
echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/join_channel.yaml"
kubectl create -f ${KUBECONFIG_FOLDER}/join_channel.yaml
sleep 5
kubectl cp $KPM_PATH/crypto-config/ joinchannel:$CONTAINER_BASE_PATH/
kubectl cp $BASE_PATH/composer-channel.tx joinchannel:$CONTAINER_BASE_PATH/composer-channel.tx
kubectl cp $BASE_PATH/composer-genesis.block joinchannel:$CONTAINER_BASE_PATH/composer-genesis.block

while [ "$(kubectl get pod -a joinchannel | grep joinchannel | awk '{print $3}')" != "Completed" ]; do
    echo "Waiting for joinchannel container to be Completed"
    sleep 1;
done

if [ "$(kubectl get pod -a joinchannel | grep joinchannel | awk '{print $3}')" == "Completed" ]; then
	echo "Join Channel Completed Successfully"
fi

if [ "$(kubectl get pod -a joinchannel | grep joinchannel | awk '{print $3}')" != "Completed" ]; then
	echo "Join Channel Failed"
fi