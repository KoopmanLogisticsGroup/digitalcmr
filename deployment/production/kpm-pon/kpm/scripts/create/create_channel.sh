#!/bin/bash

if [ "${PWD##*/}" == "create" ]; then
    KUBECONFIG_FOLDER=${PWD}/../../kube-configs/channels
elif [ "${PWD##*/}" == "scripts" ]; then
    KUBECONFIG_FOLDER=${PWD}/../kube-configs/channels
else
    echo "Please run the script from 'scripts' or 'scripts/create' folder"
fi

BASE_PATH=$(pwd)../../../../../../composer/hlfv1/config/kpm-pon-config
KPM_PATH=$BASE_PATH/kpm
CONTAINER_BASE_PATH=/fabric-config
KPM_PEERS_PARTIAL_PATH=crypto-config/peerOrganizations/kpm-pon/peers/peer0.kpm-pon/msp
POD_NAME=createchannel

# Default to "kpm-ponMSP" if not defined
if [ -z ${PEER_MSPID} ]; then
	echo "PEER_MSPID not defined. I will use \"kpm-ponMSP\"."
	echo "I will wait 5 seconds before continuing."
	sleep 5
fi
PEER_MSPID=${PEER_MSPID:-kpm-ponMSP}

# Default to "composerchannel" if not defined
if [ -z "${CHANNEL_NAME}" ]; then
	echo "CHANNEL_NAME not defined. I will use \"composerchannel\"."
	echo "I will wait 5 seconds before continuing."
	sleep 5
fi
CHANNEL_NAME=${CHANNEL_NAME:-composerchannel}

# Default to "production" if not defined
if [ -z ${CHANNEL_FILE} ]; then
	echo "CHANNEL_FILE not defined. I will use \"production\"."
	echo "I will wait 5 seconds before continuing."
	sleep 5
fi
CHANNEL_FILE=${CHANNEL_FILE:-production}

# Default to "orderer-kpm-pon:7050" if not defined
if [ -z "${ORDERER_ADDRESS}" ]; then
	echo "ORDERER_ADDRESS not defined. I will use \"orderer-kpm-pon:7050\"."
	echo "I will wait 5 seconds before continuing."
	sleep 5
fi
ORDERER_ADDRESS=${ORDERER_ADDRESS:-orderer-kpm-pon:7050}

echo "Deleting old channel pods if exists"
echo "Running: ${KUBECONFIG_FOLDER}/../scripts/delete/delete_channel-pods.sh"
${KUBECONFIG_FOLDER}/../../scripts/delete/delete_channel-pods.sh

echo "Preparing yaml file for create channel"
sed -e "s/%CHANNEL_FILE%/${CHANNEL_FILE}/g" -e "s/%CHANNEL_NAME%/${CHANNEL_NAME}/g" -e "s/%PEER_MSPID%/${PEER_MSPID}/g" -e "s/%ORDERER_ADDRESS%/${ORDERER_ADDRESS}/g" ${KUBECONFIG_FOLDER}/create_channel.yaml.base > ${KUBECONFIG_FOLDER}/create_channel.yaml

echo "Creating createchannel pod"
echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/create_channel.yaml"
kubectl create -f ${KUBECONFIG_FOLDER}/create_channel.yaml

TIMEOUT=30
echo "Waiting for $TIMEOUT seconds for pod to settle"
sleep $TIMEOUT

echo ""
echo "=> CREATE_ALL: Copying crypto config into createchannel"
kubectl cp $KPM_PATH/$KPM_PEERS_PARTIAL_PATH/ $POD_NAME:$CONTAINER_BASE_PATH/msp/
kubectl cp $BASE_PATH/$CHANNEL_FILE.tx $POD_NAME:$CONTAINER_BASE_PATH/$CHANNEL_FILE.tx

while [ "$(kubectl get pod -a createchannel | grep createchannel | awk '{print $3}')" != "Completed" ]; do
    echo "Waiting for createchannel container to be Completed"
    sleep 1;
done

if [ "$(kubectl get pod -a createchannel | grep createchannel | awk '{print $3}')" == "Completed" ]; then
	echo "Create Channel Completed Successfully"
fi

if [ "$(kubectl get pod -a createchannel | grep createchannel | awk '{print $3}')" != "Completed" ]; then
	echo "Create Channel Failed"
fi