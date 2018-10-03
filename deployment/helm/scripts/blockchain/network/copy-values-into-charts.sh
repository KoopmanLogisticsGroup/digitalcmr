#!/bin/bash

SCRIPT_DIR=$(pwd)
ENV_RELATIVE_PATH="/../../environments/"$1

BLOCKCHAIN_CHART_RELATIVE_PATH="/../../digital-cmr/charts/blockchain-network/"
APPLICATION_CHART_RELATIVE_PATH="/../../digital-cmr/charts/application/"

cp $SCRIPT_DIR$ENV_RELATIVE_PATH/values/blockchain/values.yaml $SCRIPT_DIR$BLOCKCHAIN_CHART_RELATIVE_PATH/values.yaml
cp $SCRIPT_DIR$ENV_RELATIVE_PATH/values/application/values.yaml $SCRIPT_DIR$APPLICATION_CHART_RELATIVE_PATH/values.yaml
