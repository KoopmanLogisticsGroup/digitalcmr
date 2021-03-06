#!/bin/bash

BASE_PATH=$(pwd)../../../../../../composer/hlfv1/config/kpm-alliance-config-trial
KPM_PATH=$BASE_PATH/kpm
CONTAINER_BASE_PATH=/fabric-config
KPM_USERS_PARTIAL_PATH=crypto-config/peerOrganizations/kpm-all/users/Admin@kpm-all
BNA=$(pwd)../../../../../../composer/bna/dist
POD_NAME=composer-identity-import-kpm-all

if [ "${PWD##*/}" == "create" ]; then
    KUBECONFIG_FOLDER=${PWD}/../../kube-configs/composer
elif [ "${PWD##*/}" == "scripts" ]; then
    KUBECONFIG_FOLDER=${PWD}/../kube-configs/composer
else
    echo "Please run the script from 'scripts' or 'scripts/create' folder"
fi

echo "Creating utils pod"
echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/composer-utils.yaml"
kubectl create -f ${KUBECONFIG_FOLDER}/composer-utils.yaml

while [ "$(kubectl get pods -a | grep composer-utils | awk '{print $3}')" != "Completed" ]; do
    echo "Waiting for composer-utils container to be Completed"
    sleep 1;
done

if [ "$(kubectl get pods -a | grep composer-utils | awk '{print $3}')" == "Completed" ]; then
	echo "Composer Utils Completed Successfully"
fi

if [ "$(kubectl get pods -a | grep composer-utils | awk '{print $3}')" != "Completed" ]; then
	echo "Composer Utils Failed"
fi

echo "Deleting composer-utils pod"
echo "Running: kubectl delete -f ${KUBECONFIG_FOLDER}/composer-utils.yaml"
kubectl delete -f ${KUBECONFIG_FOLDER}/composer-utils.yaml

while [ "$(kubectl get svc | grep composer-utils | wc -l | awk '{print $1}')" != "0" ]; do
	echo "Waiting for composer-utils pod to be deleted"
	sleep 1;
done

# Default to "orderer-kpm-all:7050" if not defined
if [ -z "${ORDERER_ADDRESS}" ]; then
	echo "ORDERER_ADDRESS not defined. I will use \"orderer-kpm-all:7050\"."
	echo "I will wait 5 seconds before continuing."
	sleep 5
fi
ORDERER_ADDRESS=${ORDERER_ADDRESS:-orderer-kpm-all:7050}

echo "Preparing yaml file for composer identity import"
sed -e "s/%ORDERER_ADDRESS%/${ORDERER_ADDRESS}/g" ${KUBECONFIG_FOLDER}/composer-identity-import.yaml.base > ${KUBECONFIG_FOLDER}/composer-identity-import.yaml

echo "Creating composer-identity-import pod"
echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/composer-identity-import.yaml"
kubectl create -f ${KUBECONFIG_FOLDER}/composer-identity-import.yaml

TIMEOUT=30
echo "Waiting for $TIMEOUT seconds for pod to settle"
sleep $TIMEOUT

echo ""
echo "=> Copying BNAs into pod"
kubectl cp $BNA/ $POD_NAME:$CONTAINER_BASE_PATH/bna/
echo "=> CREATE_ALL: Copying crypto config into pod"
# Copy crypto-config to pod container
kubectl cp $KPM_PATH/$KPM_USERS_PARTIAL_PATH/ $POD_NAME:$CONTAINER_BASE_PATH/

while [ "$(kubectl get pods -a | grep composer-identity-import | awk '{print $3}')" != "Completed" ]; do
    echo "Waiting for composer-identity-import container to be Completed"
    sleep 1;
done

if [ "$(kubectl get pods -a | grep composer-identity-import | awk '{print $3}')" == "Completed" ]; then
	echo "Composer Identity Import Completed Successfully"
fi

if [ "$(kubectl get pods -a | grep composer-identity-import | awk '{print $3}')" != "Completed" ]; then
	echo "Composer Identity Import Failed"
fi

echo "Deleting composer-identity-import-kpm-all pod"
echo "Running: kubectl delete -f ${KUBECONFIG_FOLDER}/composer-identity-import.yaml"
kubectl delete -f ${KUBECONFIG_FOLDER}/composer-identity-import.yaml

while [ "$(kubectl get svc | grep composer-identity-import-kpm-all | wc -l | awk '{print $1}')" != "0" ]; do
	echo "Waiting for composer-identity-import pod to be deleted"
	sleep 1;
done

#echo "Preparing yaml file for composer playground"
#sed -e "s/%ORDERER_ADDRESS%/${ORDERER_ADDRESS}/g" ${KUBECONFIG_FOLDER}/composer-playground.yaml.base > ${KUBECONFIG_FOLDER}/composer-playground.yaml
#
#echo "Creating composer-playground deployment"
#echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/composer-playground.yaml"
#kubectl create -f ${KUBECONFIG_FOLDER}/composer-playground.yaml
#
#if [ "$(kubectl get svc | grep composer-playground | wc -l | awk '{print $1}')" == "0" ]; then
#    echo "Creating composer-playground service"
#    echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/composer-playground-services.yaml"
#    kubectl create -f ${KUBECONFIG_FOLDER}/composer-playground-services.yaml
#fi
#
#echo "Checking if all deployments are ready"
#
#NUMPENDING=$(kubectl get deployments | grep composer-playground | awk '{print $5}' | grep 0 | wc -l | awk '{print $1}')
#while [ "${NUMPENDING}" != "0" ]; do
#    echo "Waiting on pending deployments. Deployments pending = ${NUMPENDING}"
#    NUMPENDING=$(kubectl get deployments | grep composer-playground | awk '{print $5}' | grep 0 | wc -l | awk '{print $1}')
#done
#
#echo "Composer playground created successfully"
