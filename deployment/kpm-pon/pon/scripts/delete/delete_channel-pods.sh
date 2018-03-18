#!/bin/bash

if [ "${PWD##*/}" == "create" ]; then
    KUBECONFIG_FOLDER=${PWD}/../../kube-configs/channels
elif [ "${PWD##*/}" == "scripts" ]; then
    KUBECONFIG_FOLDER=${PWD}/../kube-configs/channels
else
    echo "Please run the script from 'scripts' or 'scripts/delete' folder"
fi

# The env variables don't matter as we are deleting pods
PEER_ADDRESS="DoesntMatter"
CHANNEL_NAME="DoesntMatter"
PEER_MSPID="DoesntMatter"
ORDERER_ADDRESS="DoesntMatter"

# Delete Join Channel Pod
echo "Preparing yaml for joinchannel pod for deletion"
sed -e "s/%ORDERER_ADDRESS%/${ORDERER_ADDRESS}/g" -e "s/%PEER_ADDRESS%/${PEER_ADDRESS}/g" -e "s/%CHANNEL_NAME%/${CHANNEL_NAME}/g" -e "s/%PEER_MSPID%/${PEER_MSPID}/g" -e "s|%MSP_CONFIGPATH%|${MSP_CONFIGPATH}|g" ${KUBECONFIG_FOLDER}/join_channel.yaml.base > ${KUBECONFIG_FOLDER}/join_channel.yaml

if [ "$(kubectl get pods -a | grep joinchannel | wc -l | awk '{print $1}')" != "0" ]; then
    echo "Deleting Existing joinchannel pods"
    echo "Running: kubectl delete -f ${KUBECONFIG_FOLDER}/join_channel.yaml"
    kubectl delete -f ${KUBECONFIG_FOLDER}/join_channel.yaml

    # Wait for the pod to be deleted
    while [ "$(kubectl get pods -a | grep joinchannel | wc -l | awk '{print $1}')" != "0" ]; do
        echo "Waiting for old Join Channel to be deleted"
        sleep 1;
    done

    echo "Join channel pod deleted successfully."
else
    echo "joinchannel pod doesn't exist. No need to delete."
fi

