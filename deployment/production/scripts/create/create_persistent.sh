#!/bin/bash

if [ "${PWD##*/}" == "create" ]; then
    KUBECONFIG_FOLDER=${PWD}/../../kube-configs/persistent
elif [ "${PWD##*/}" == "scripts" ]; then
    KUBECONFIG_FOLDER=${PWD}/../kube-configs/persistent
else
    echo "Please run the script from 'scripts' or 'scripts/create' folder"
fi

echo "Creating Persistent Services Private CouchDB"
echo "Running: kubectl apply -f ${KUBECONFIG_FOLDER}/persistent-service.yaml"
kubectl create -f ${KUBECONFIG_FOLDER}/persistent-services.yaml

echo "Creating StatefullSet CouchDB"
echo "Running: kubectl apply -f ${KUBECONFIG_FOLDER}/private-couchdb-statefulset.yaml"
kubectl create -f ${KUBECONFIG_FOLDER}/persistent-statefulsets.yaml

echo "Checking if all deployments are ready"

NUMPENDING=$(kubectl get pod | grep persistent | awk '{print $5}' | grep 0 | wc -l | awk '{print $1}')
while [ "${NUMPENDING}" != "0" ]; do
    echo "Waiting on pending pods. Pods pending = ${NUMPENDING}"
    NUMPENDING=$(kubectl get pod | grep persistent | awk '{print $5}' | grep 0 | wc -l | awk '{print $1}')
done

NUMPENDING=$(kubectl get pvc | grep pvc | awk '{print $5}' | grep 0 | wc -l | awk '{print $1}')
while [ "${NUMPENDING}" != "0" ]; do
    echo "Waiting on pending persistent volumes claims. Persistent Volumes Claims pending = ${NUMPENDING}"
    NUMPENDING=$(kubectl get svc | grep persistent | awk '{print $5}' | grep 0 | wc -l | awk '{print $1}')
done