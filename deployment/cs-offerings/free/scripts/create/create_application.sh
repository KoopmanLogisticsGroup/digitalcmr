#!/bin/bash

if [ "${PWD##*/}" == "create" ]; then
    KUBECONFIG_FOLDER=${PWD}/../../kube-configs/application
elif [ "${PWD##*/}" == "scripts" ]; then
    KUBECONFIG_FOLDER=${PWD}/../kube-configs/application
else
    echo "Please run the script from 'scripts' or 'scripts/create' folder"
fi

echo "Creating Services for application"
echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/application-services.yaml"
kubectl create -f ${KUBECONFIG_FOLDER}/application-services.yaml


echo "Creating new Deployment"
echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/application.yaml"
kubectl create -f ${KUBECONFIG_FOLDER}/application.yaml --validate=false

echo "Checking if all deployments are ready"

NUMPENDING=$(kubectl get deployments | grep app | awk '{print $5}' | grep 0 | wc -l | awk '{print $1}')
while [ "${NUMPENDING}" != "0" ]; do
    echo "Waiting on pending deployments. Deployments pending = ${NUMPENDING}"
    NUMPENDING=$(kubectl get deployments | grep app | awk '{print $5}' | grep 0 | wc -l | awk '{print $1}')
done
