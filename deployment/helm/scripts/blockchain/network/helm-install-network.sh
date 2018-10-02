#!/bin/bash

SCRIPT_DIR=$(pwd)
ENV_RELATIVE_PATH="/../../environments/"$1
BNA_RELATIVE_PATH="/../../bna/"

BLOCKCHAIN_CA_RELATIVE_PATH="/../../digital-cmr/charts/blockchain-network/charts/blockchain-ca"
BLOCKCHAIN_ORDERER_RELATIVE_PATH="/../../digital-cmr/charts/blockchain-network/charts/blockchain-orderer"
BLOCKCHAIN_PEER_RELATIVE_PATH="/../../digital-cmr/charts/blockchain-network/charts/blockchain-peer"
DIGITALCMR_BLOCKCHAIN_CHART_RELATIVE_PATH="/../../digital-cmr/charts/blockchain-network"

cd $SCRIPT_DIR"/"$DIGITALCMR_BLOCKCHAIN_CHART_RELATIVE_PATH

helm install . -n blockchain-network

cd $SCRIPT_DIR