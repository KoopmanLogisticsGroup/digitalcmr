#!/usr/bin/env bash

SCRIPT_DIR=$(pwd)

DIGITALCMR_APPLICATION_CHART_RELATIVE_PATH="../digital-cmr/charts/application/persistent-volumes"
DIGITALCMR_BLOCKCHAIN_CHART_RELATIVE_PATH="../digital-cmr/charts/blockchain-network/persistent-volumes"

helm init
echo "helm initialised, waiting for 10 seconds to deploy persistent volumes"
sleep 10
kubectl -f $SCRIPT_DIR"/"$DIGITALCMR_APPLICATION_CHART_RELATIVE_PATH"/couchdb-pv.yaml" apply
kubectl -f $SCRIPT_DIR"/"$DIGITALCMR_BLOCKCHAIN_CHART_RELATIVE_PATH"/blockchain-couchdb-pv.yaml" apply
echo "persistent volumes deployed, deploying persistent volume claims"
sleep 1

kubectl -f $SCRIPT_DIR"/"$DIGITALCMR_APPLICATION_CHART_RELATIVE_PATH"/couchdb-pvc.yaml" apply
kubectl -f $SCRIPT_DIR"/"$DIGITALCMR_BLOCKCHAIN_CHART_RELATIVE_PATH"/blockchain-couchdb-pvc.yaml" apply
echo "done"

