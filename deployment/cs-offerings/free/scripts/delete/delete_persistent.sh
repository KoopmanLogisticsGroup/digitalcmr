#!/bin/bash

if [ "${PWD##*/}" == "create" ]; then
    KUBECONFIG_FOLDER=${PWD}/../../kube-configs/persistent
elif [ "${PWD##*/}" == "scripts" ]; then
    KUBECONFIG_FOLDER=${PWD}/../kube-configs/persistent
else
    echo "Please run the script from 'scripts' or 'scripts/delete' folder"
	exit
fi

echo "Deleting Persistent Services Private CouchDB"
echo "Running: kubectl delete -f ${KUBECONFIG_FOLDER}/persistent-service.yaml"
kubectl delete -f ${KUBECONFIG_FOLDER}/persistent-service.yaml

echo "Deleting StatefullSet CouchDB"
echo "Running: kubectl delete -f ${KUBECONFIG_FOLDER}/private-couchdb-statefulset.yaml"
kubectl delete -f ${KUBECONFIG_FOLDER}/private-couchdb-statefulset.yaml

echo "Checking if all pods are deleted"

NUM_PENDING=$(kubectl get svc | grep couchdb | wc -l | awk '{print $1}')
while [ "${NUM_PENDING}" != "0" ]; do
	echo "Waiting for all couchdb services to be deleted. Remaining = ${NUM_PENDING}"
    NUM_PENDING=$(kubectl get svc | grep couchdb | wc -l | awk '{print $1}')
	sleep 1;
done

NUM_PENDING=$(kubectl get pvc | grep couchdb | wc -l | awk '{print $1}')
while [ "${NUM_PENDING}" != "0" ]; do
	echo "Waiting for all couchdb pvc to be deleted. Remaining = ${NUM_PENDING}"
    NUM_PENDING=$(kubectl get pvc | grep couchdb | wc -l | awk '{print $1}')
	sleep 1;
done

echo "All application deployments & services have been removed"
