#!/bin/bash

if [ "${PWD##*/}" == "create" ]; then
    KUBECONFIG_FOLDER=${PWD}/../../kube-configs/blockchain
elif [ "${PWD##*/}" == "scripts" ]; then
    KUBECONFIG_FOLDER=${PWD}/../kube-configs/blockchain
else
    echo "Please run the script from 'scripts' or 'scripts/create' folder"
fi

echo "Creating Services for blockchain network"
# Use the yaml file with couchdb
echo "Running: kubectl apply -f ${KUBECONFIG_FOLDER}/blockchain-couchdb-services.yaml"
kubectl apply -f ${KUBECONFIG_FOLDER}/blockchain-couchdb-services.yaml

echo "Creating new Deployment"
# Use the yaml file with couchdb
echo "Running: kubectl apply -f ${KUBECONFIG_FOLDER}/blockchain-couchdb.yaml"
kubectl apply -f ${KUBECONFIG_FOLDER}/blockchain-couchdb.yaml --validate=false

echo "Checking if all deployments are ready"

NUMPENDING=$(kubectl get pods | grep all | awk '{print $5}' | grep 0 | wc -l | awk '{print $1}')
while [ "${NUMPENDING}" != "0" ]; do
    echo "Waiting on pending pods. Pods pending = ${NUMPENDING}"
    NUMPENDING=$(kubectl get pods | grep all | awk '{print $5}' | grep 0 | wc -l | awk '{print $1}')
done

TIMEOUT=30
echo "Waiting for $TIMEOUT seconds for peers to settle, as we are running with couchdb"
sleep $TIMEOUT
