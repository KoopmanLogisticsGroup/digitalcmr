#!/bin/bash

BASE_PATH=$(pwd)../../../../../composer/hlfv1/config/kpm-pon-config
CRYPTO_PATH=$BASE_PATH/pon
CONTAINER_BASE_PATH=/fabric-config
USERS_PARTIAL_PATH=crypto-config/peerOrganizations/pon/users/Admin@pon
POD_NAME=joinchannel-pon

if [ "${PWD##*/}" == "create" ]; then
    KUBECONFIG_FOLDER=${PWD}/../../kube-configs/channels
elif [ "${PWD##*/}" == "scripts" ]; then
    KUBECONFIG_FOLDER=${PWD}/../kube-configs/channels
else
    echo "Please run the script from 'scripts' or 'scripts/create' folder"
fi

# Default to peer0's address if not defined
if [ -z "${PEER_ADDRESS}" ]; then
	echo "PEER_ADDRESS not defined. I will use \"peer0-pon:5010\"."
	echo "I will wait 5 seconds before continuing."
	sleep 5
fi
PEER_ADDRESS=${PEER_ADDRESS:-peer0-pon:5010}

# Default to "ponMSP" if not defined
if [ -z ${PEER_MSPID} ]; then
	echo "PEER_MSPID not defined. I will use \"ponMSP\"."
	echo "I will wait 5 seconds before continuing."
	sleep 5
fi
PEER_MSPID=${PEER_MSPID:-ponMSP}

# Default to "composerchannel" if not defined
if [ -z "${CHANNEL_NAME}" ]; then
	echo "CHANNEL_NAME not defined. I will use \"composerchannel\"."
	echo "I will wait 5 seconds before continuing."
	sleep 5
fi
CHANNEL_NAME=${CHANNEL_NAME:-composerchannel}

# Default to "admin for peer0" if not defined
if [ -z "${MSP_CONFIGPATH}" ]; then
	echo "MSP_CONFIGPATH not defined. I will use \"/fabric-config/Admin@pon/msp\"."
	echo "I will wait 5 seconds before continuing."
	sleep 5
fi
MSP_CONFIGPATH=${MSP_CONFIGPATH:-/fabric-config/Admin@pon/msp}

# Default to "orderer-kpm-pon:31010" if not defined
if [ -z "${ORDERER_ADDRESS}" ]; then
	echo "ORDERER_ADDRESS not defined. I will use \"orderer-kpm-pon:31010\"."
	echo "I will wait 5 seconds before continuing."
	sleep 5
fi
ORDERER_ADDRESS=${ORDERER_ADDRESS:-orderer-kpm-pon:31010}

echo "Deleting old channel pods if exists"
echo "Running: ${KUBECONFIG_FOLDER}/../scripts/delete/delete_channel-pods.sh"
${KUBECONFIG_FOLDER}/../../scripts/delete/delete_channel-pods.sh

echo "Preparing yaml for joinchannel pod"
sed -e "s/%ORDERER_ADDRESS%/${ORDERER_ADDRESS}/g" -e "s/%PEER_ADDRESS%/${PEER_ADDRESS}/g" -e "s/%CHANNEL_NAME%/${CHANNEL_NAME}/g" -e "s/%PEER_MSPID%/${PEER_MSPID}/g" -e "s|%MSP_CONFIGPATH%|${MSP_CONFIGPATH}|g" ${KUBECONFIG_FOLDER}/join_channel.yaml.base > ${KUBECONFIG_FOLDER}/join_channel.yaml

echo "Creating joinchannel pod"
echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/join_channel.yaml"
kubectl create -f ${KUBECONFIG_FOLDER}/join_channel.yaml

TIMEOUT=15
echo "Waiting for $TIMEOUT seconds for pod to settle"
sleep $TIMEOUT

echo ""
echo "=> CREATE_ALL: Copying crypto config into peer"
# Copy crypto-config to peer0-pon container
kubectl cp $CRYPTO_PATH/$USERS_PARTIAL_PATH/ $POD_NAME:$CONTAINER_BASE_PATH/

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