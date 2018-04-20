#!/bin/bash

# The env variables don't matter as we are deleting pods
ORDERER_ADDRESS="DoesntMatter"

if [ "${PWD##*/}" == "create" ]; then
    KUBECONFIG_FOLDER=${PWD}/../../kube-configs/composer
elif [ "${PWD##*/}" == "scripts" ]; then
    KUBECONFIG_FOLDER=${PWD}/../kube-configs/composer
else
    echo "Please run the script from 'scripts' or 'scripts/delete' folder"
fi

echo "Deleting composer-utils pod"
echo "Running: kubectl delete -f ${KUBECONFIG_FOLDER}/composer-utils.yaml"
kubectl delete -f ${KUBECONFIG_FOLDER}/composer-utils.yaml

while [ "$(kubectl get svc | grep composer-utils | wc -l | awk '{print $1}')" != "0" ]; do
	echo "Waiting for composer-utils pod to be deleted"
	sleep 1;
done

echo "Preparing yaml file for composer identity import"
sed -e "s/%ORDERER_ADDRESS%/${ORDERER_ADDRESS}/g" ${KUBECONFIG_FOLDER}/composer-identity-import.yaml.base > ${KUBECONFIG_FOLDER}/composer-identity-import.yaml

echo "Deleting composer-identity-import pod"
echo "Running: kubectl delete -f ${KUBECONFIG_FOLDER}/composer-identity-import.yaml"
kubectl delete -f ${KUBECONFIG_FOLDER}/composer-identity-import.yaml

while [ "$(kubectl get svc | grep composer-identity-import | wc -l | awk '{print $1}')" != "0" ]; do
	echo "Waiting for composer-identity-import pod to be deleted"
	sleep 1;
done

echo "Preparing yaml file for composer playground"
sed -e "s/%ORDERER_ADDRESS%/${ORDERER_ADDRESS}/g" ${KUBECONFIG_FOLDER}/composer-playground.yaml.base > ${KUBECONFIG_FOLDER}/composer-playground.yaml

echo "Deleting Composer Playground pod"
echo "Running: kubectl delete -f ${KUBECONFIG_FOLDER}/composer-playground.yaml"
kubectl delete -f ${KUBECONFIG_FOLDER}/composer-playground.yaml

while [ "$(kubectl get deployments | grep composer-playground | wc -l | awk '{print $1}')" != "0" ]; do
	echo "Waiting for composer-playground deployment to be deleted"
	sleep 1;
done

echo "Deleting Composer Playground services"
echo "Running: kubectl delete -f ${KUBECONFIG_FOLDER}/composer-playground-services.yaml"
kubectl delete -f ${KUBECONFIG_FOLDER}/composer-playground-services.yaml

while [ "$(kubectl get svc | grep composer-playground | wc -l | awk '{print $1}')" != "0" ]; do
	echo "Waiting for composer-playground service to be deleted"
	sleep 1;
done

echo "Composer Playground is deleted"
