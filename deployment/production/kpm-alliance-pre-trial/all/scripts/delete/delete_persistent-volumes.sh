#!/bin/bash

if [ "${PWD##*/}" == "delete" ]; then
    KUBECONFIG_FOLDER=${PWD}/../../kube-configs/persistent-volumes
elif [ "${PWD##*/}" == "scripts" ]; then
    KUBECONFIG_FOLDER=${PWD}/../kube-configs/persistent-volumes
else
    echo "Please run the script from 'scripts' or 'scripts/delete' folder"
fi

echo "Deleting PersistentVolumes"
echo "Running: kubectl delete -f ${KUBECONFIG_FOLDER}/privatedb-pv.yaml"
kubectl delete -f ${KUBECONFIG_FOLDER}/../persistent-volumes/privatedb-pv.yaml
echo "Running: kubectl delete -f ${KUBECONFIG_FOLDER}/credentials-pv.yaml"
kubectl delete -f ${KUBECONFIG_FOLDER}/../persistent-volumes/credentials-pv.yaml
echo "Running: kubectl delete -f ${KUBECONFIG_FOLDER}/blockchain-pv.yaml"
kubectl delete -f ${KUBECONFIG_FOLDER}/../persistent-volumes/credentials-pv.yaml
