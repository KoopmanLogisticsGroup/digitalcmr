#!/bin/bash

if [ "${PWD##*/}" == "create" ]; then
    KUBECONFIG_FOLDER=${PWD}/../../kube-configs/persistent-volumes
elif [ "${PWD##*/}" == "scripts" ]; then
    KUBECONFIG_FOLDER=${PWD}/../kube-configs/persistent-volumes
else
    echo "Please run the script from 'scripts' or 'scripts/create' folder"
fi

echo "Creating Persistent Volume for Private CouchDB"
echo "Running: kubectl apply -f ${KUBECONFIG_FOLDER}/private-couchdb-pv.yaml"
kubectl create -f ${KUBECONFIG_FOLDER}/private-couchdb-pv.yaml

echo "Checking if all persistent volumes are ready"

NUMPENDING=$(kubectl get pv | grep pv | awk '{print $5}' | grep 0 | wc -l | awk '{print $1}')
while [ "${NUMPENDING}" != "0" ]; do
    echo "Waiting on pending persistent volumes. Persistent Volumes pending = ${NUMPENDING}"
    NUMPENDING=$(kubectl get pod | grep persistent | awk '{print $5}' | grep 0 | wc -l | awk '{print $1}')
done