#!/bin/bash

if [ "${PWD##*/}" == "create" ]; then
    KUBECONFIG_FOLDER=${PWD}/../../kube-configs/application
elif [ "${PWD##*/}" == "scripts" ]; then
    KUBECONFIG_FOLDER=${PWD}/../kube-configs/application
else
    echo "Please run the script from 'scripts' or 'scripts/delete' folder"
	exit
fi

echo "Deleting application services"
echo "Running: kubectl delete -f ${KUBECONFIG_FOLDER}/application-services.yaml"
kubectl delete -f ${KUBECONFIG_FOLDER}/application-services.yaml

echo "Deleting application deployments"
echo "Running: kubectl delete -f ${KUBECONFIG_FOLDER}/application.yaml"
kubectl delete -f ${KUBECONFIG_FOLDER}/application.yaml

echo "Checking if all deployments are deleted"

NUM_PENDING=$(kubectl get deployments | grep app | wc -l | awk '{print $1}')
while [ "${NUM_PENDING}" != "0" ]; do
	echo "Waiting for all application deployments to be deleted. Remaining = ${NUM_PENDING}"
    NUM_PENDING=$(kubectl get deployments | grep app | wc -l | awk '{print $1}')
	sleep 1;
done

NUM_PENDING=$(kubectl get svc | grep app | wc -l | awk '{print $1}')
while [ "${NUM_PENDING}" != "0" ]; do
	echo "Waiting for all application servicess to be deleted. Remaining = ${NUM_PENDING}"
    NUM_PENDING=$(kubectl get svc | grep app | wc -l | awk '{print $1}')
	sleep 1;
done

echo "All application deployments & services have been removed"
