#!/bin/bash

if [ "${PWD##*/}" == "create" ]; then
    KUBECONFIG_FOLDER=${PWD}/../../kube-configs/blockchain
elif [ "${PWD##*/}" == "scripts" ]; then
    KUBECONFIG_FOLDER=${PWD}/../kube-configs/blockchain
else
    echo "Please run the script from 'scripts' or 'scripts/delete' folder"
	exit
fi

echo "Deleting blockchain services"
# Use the yaml file with couchdb
echo "Running: kubectl delete -f ${KUBECONFIG_FOLDER}/blockchain-couchdb-services.yaml"
kubectl delete -f ${KUBECONFIG_FOLDER}/blockchain-couchdb-services.yaml


echo "Deleting blockchain deployments"
# Use the yaml file with couchdb
echo "Running: kubectl delete -f ${KUBECONFIG_FOLDER}/blockchain-couchdb.yaml"
kubectl delete -f ${KUBECONFIG_FOLDER}/blockchain-couchdb.yaml

echo "Checking if all deployments are deleted"

#NUM_PENDING=$(kubectl get deployments | grep all | grep -v composer | wc -l | awk '{print $1}')
#while [ "${NUM_PENDING}" != "0" ]; do
#	echo "Waiting for all blockchain deployments to be deleted. Remaining = ${NUM_PENDING}"
#    NUM_PENDING=$(kubectl get deployments | grep all | grep -v composer | wc -l | awk '{print $1}')
#	sleep 1;
#done
#
#NUM_PENDING=$(kubectl get svc | grep all | grep -v composer | wc -l | awk '{print $1}')
#while [ "${NUM_PENDING}" != "0" ]; do
#	echo "Waiting for all blockchain servicess to be deleted. Remaining = ${NUM_PENDING}"
#    NUM_PENDING=$(kubectl get svc | grep all | grep -v composer | wc -l | awk '{print $1}')
#	sleep 1;
#done

echo "All blockchain deployments & services have been removed"