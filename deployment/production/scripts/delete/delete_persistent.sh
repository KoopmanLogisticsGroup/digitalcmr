#!/bin/bash

if [ "${PWD##*/}" == "create" ]; then
    KUBECONFIG_FOLDER=${PWD}/../../kube-configs/persistent
elif [ "${PWD##*/}" == "scripts" ]; then
    KUBECONFIG_FOLDER=${PWD}/../kube-configs/persistent
else
    echo "Please run the script from 'scripts' or 'scripts/delete' folder"
	exit
fi

echo "Deleting Persistent Services"
echo "Running: kubectl delete -f ${KUBECONFIG_FOLDER}/persistent-services.yaml"
kubectl delete -f ${KUBECONFIG_FOLDER}/persistent-services.yaml

echo "Deleting Persistent StatefullSet"
echo "Running: kubectl delete -f ${KUBECONFIG_FOLDER}/persistent-statefulsets.yaml"
kubectl delete -f ${KUBECONFIG_FOLDER}/persistent-statefulsets.yaml

echo "Checking if all Persistent Services and Statefulsets are deleted"

NUM_PENDING=$(kubectl get svc | grep persistent | wc -l | awk '{print $1}')
while [ "${NUM_PENDING}" != "0" ]; do
	echo "Waiting for all persistent services to be deleted. Remaining = ${NUM_PENDING}"
    NUM_PENDING=$(kubectl get svc | grep persistent | wc -l | awk '{print $1}')
	sleep 1;
done

NUM_PENDING=$(kubectl get statefulset | grep persistent | wc -l | awk '{print $1}')
while [ "${NUM_PENDING}" != "0" ]; do
	echo "Waiting for all persistent volume claims to be deleted. Remaining = ${NUM_PENDING}"
    NUM_PENDING=$(kubectl get pvc | grep persistent | wc -l | awk '{print $1}')
	sleep 1;
done

echo "All application deployments & services have been removed"
