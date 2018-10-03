#!/bin/bash

SCRIPT_DIR=$(pwd)

DIGITALCMR_APPLICATION_CHART_RELATIVE_PATH="/../../digital-cmr/charts/application"

cd $SCRIPT_DIR"/"$DIGITALCMR_APPLICATION_CHART_RELATIVE_PATH

echo "Running helm install application"

helm install . -n blockchain-application

cd $SCRIPT_DIR