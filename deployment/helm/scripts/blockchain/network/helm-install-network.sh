#!/bin/bash

SCRIPT_DIR=$(pwd)
ENV_RELATIVE_PATH="/../../environments/"$1
BNA_RELATIVE_PATH="/../../bna/"

BLOCKCHAIN_CA_RELATIVE_PATH="/../../digital-cmr/charts/blockchain-network/charts/blockchain-ca"
BLOCKCHAIN_ORDERER_RELATIVE_PATH="/../../digital-cmr/charts/blockchain-network/charts/blockchain-orderer"
BLOCKCHAIN_PEER_RELATIVE_PATH="/../../digital-cmr/charts/blockchain-network/charts/blockchain-peer"
DIGITALCMR_BLOCKCHAIN_CHART_RELATIVE_PATH="/../../digital-cmr/charts/blockchain-network"

cd $SCRIPT_DIR"/"$DIGITALCMR_BLOCKCHAIN_CHART_RELATIVE_PATH

#mark confitgtx.yaml and crypto-config.yaml as .tmpcfg to helm ignore them

mv $SCRIPT_DIR"/"$DIGITALCMR_BLOCKCHAIN_CHART_RELATIVE_PATH"/templates/configtx.yaml" $SCRIPT_DIR"/"$DIGITALCMR_BLOCKCHAIN_CHART_RELATIVE_PATH"/templates/configtx.yaml.tmpcfg"
mv $SCRIPT_DIR"/"$DIGITALCMR_BLOCKCHAIN_CHART_RELATIVE_PATH"/templates/crypto-config.yaml" $SCRIPT_DIR"/"$DIGITALCMR_BLOCKCHAIN_CHART_RELATIVE_PATH"/templates/crypto-config.yaml.tmpcfg"

helm install . -n blockchain-network

#mark back confitgtx.yaml and crypto-config.yaml

mv $SCRIPT_DIR"/"$DIGITALCMR_BLOCKCHAIN_CHART_RELATIVE_PATH"/templates/configtx.yaml.tmpcfg" $SCRIPT_DIR"/"$DIGITALCMR_BLOCKCHAIN_CHART_RELATIVE_PATH"/templates/configtx.yaml"
mv $SCRIPT_DIR"/"$DIGITALCMR_BLOCKCHAIN_CHART_RELATIVE_PATH"/templates/crypto-config.yaml.tmpcfg" $SCRIPT_DIR"/"$DIGITALCMR_BLOCKCHAIN_CHART_RELATIVE_PATH"/templates/crypto-config.yaml"


cd $SCRIPT_DIR