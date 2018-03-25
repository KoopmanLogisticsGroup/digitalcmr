#!/bin/bash

if [ "${PWD##*/}" == "create" ]; then
    KUBECONFIG_FOLDER=${PWD}/../../kube-configs/application
elif [ "${PWD##*/}" == "scripts" ]; then
    KUBECONFIG_FOLDER=${PWD}/../kube-configs/application
else
    echo "Please run the script from 'scripts' or 'scripts/create' folder"
fi

echo "Creating PersistentVolumes for application"
echo "Running: kubectl apply -f ${KUBECONFIG_FOLDER}/../persistent-volumes/privatedb-pv.yaml"
kubectl apply -f ${KUBECONFIG_FOLDER}/../persistent-volumes/privatedb-pv.yaml

echo "Creating Services for application"
echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/client-services.yaml"
kubectl create -f ${KUBECONFIG_FOLDER}/client-services.yaml
echo "Running: kubectl apply -f ${KUBECONFIG_FOLDER}/privatedb-services.yaml"
kubectl apply -f ${KUBECONFIG_FOLDER}/privatedb-services.yaml
echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/server-services.yaml"
kubectl create -f ${KUBECONFIG_FOLDER}/server-services.yaml
echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/api-services.yaml"
kubectl create -f ${KUBECONFIG_FOLDER}/api-services.yaml

echo "Creating new Deployment"
echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/client.yaml"
kubectl create -f ${KUBECONFIG_FOLDER}/client.yaml --validate=false
echo "Running: kubectl apply -f ${KUBECONFIG_FOLDER}/privatedb.yaml"
kubectl apply -f ${KUBECONFIG_FOLDER}/privatedb.yaml --validate=false
echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/server.yaml"
kubectl create -f ${KUBECONFIG_FOLDER}/server.yaml --validate=false
echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/api.yaml"
kubectl create -f ${KUBECONFIG_FOLDER}/api.yaml --validate=false

echo "Checking if all deployments are ready"

NUMPENDING=$(kubectl get deployments | grep app | awk '{print $5}' | grep 0 | wc -l | awk '{print $1}')
while [ "${NUMPENDING}" != "0" ]; do
    echo "Waiting on pending deployments. Deployments pending = ${NUMPENDING}"
    NUMPENDING=$(kubectl get deployments | grep app | awk '{print $5}' | grep 0 | wc -l | awk '{print $1}')
done
