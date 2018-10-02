#!/bin/bash

SCRIPT_DIR=$(pwd)
ENV_RELATIVE_PATH="/../../environments/"$1
BNA_RELATIVE_PATH="/../../bna/"

BLOCKCHAIN_CHART_RELATIVE_PATH="/../../digital-cmr/charts/blockchain-network"
BLOCKCHAIN_CA_RELATIVE_PATH="/../../digital-cmr/charts/blockchain-network/charts/blockchain-ca"
BLOCKCHAIN_ORDERER_RELATIVE_PATH="/../../digital-cmr/charts/blockchain-network/charts/blockchain-orderer"
BLOCKCHAIN_PEER_RELATIVE_PATH="/../../digital-cmr/charts/blockchain-network/charts/blockchain-peer"
DIGITALCMR_CHARTS_RELATIVE_PATH="/../../digital-cmr/charts"

echo "Copy environment $1 into charts"


#make environment package dir
mkdir $SCRIPT_DIR$ENV_RELATIVE_PATH/network/environment-package

#copy crypto-config into environment package dir
cp -R $SCRIPT_DIR$ENV_RELATIVE_PATH/network/crypto-config/ $SCRIPT_DIR$ENV_RELATIVE_PATH/network/environment-package/crypto-config/

#copy genericgenesis into environment package dir
cp $SCRIPT_DIR$ENV_RELATIVE_PATH/network/genericgenesis.block $SCRIPT_DIR$ENV_RELATIVE_PATH/network/environment-package/genericgenesis.block

#copy genericnetwork into environment package dir
cp $SCRIPT_DIR$ENV_RELATIVE_PATH/network/genericnetwork.tx $SCRIPT_DIR$ENV_RELATIVE_PATH/network/environment-package/genericnetwork.tx

#copy bna into environment package dir
cp $SCRIPT_DIR$BNA_RELATIVE_PATH/digital-cmr-network.bna $SCRIPT_DIR$ENV_RELATIVE_PATH/network/environment-package/digital-cmr-network.bna


#copy environment dir into blockchain CA
rm -rf $SCRIPT_DIR$BLOCKCHAIN_CA_RELATIVE_PATH/environment/
cp -R $SCRIPT_DIR$ENV_RELATIVE_PATH/network/environment-package/ $SCRIPT_DIR$BLOCKCHAIN_CA_RELATIVE_PATH/environment/

#copy environment dir into blockchain ORDERER
rm -rf $SCRIPT_DIR$BLOCKCHAIN_ORDERER_RELATIVE_PATH/environment/
cp -R $SCRIPT_DIR$ENV_RELATIVE_PATH/network/environment-package/ $SCRIPT_DIR$BLOCKCHAIN_ORDERER_RELATIVE_PATH/environment/

#copy environment dir into blockchain PEER
rm -rf $SCRIPT_DIR$BLOCKCHAIN_PEER_RELATIVE_PATH/environment/
cp -R $SCRIPT_DIR$ENV_RELATIVE_PATH/network/environment-package/ $SCRIPT_DIR$BLOCKCHAIN_PEER_RELATIVE_PATH/environment/

#copy environment dir into blockchain PEER
rm -rf $SCRIPT_DIR$BLOCKCHAIN_CHART_RELATIVE_PATH/environment/
cp -R $SCRIPT_DIR$ENV_RELATIVE_PATH/network/environment-package/ $SCRIPT_DIR$BLOCKCHAIN_CHART_RELATIVE_PATH/environment/

#remove environment-package dir
rm -rf mkdir $SCRIPT_DIR$ENV_RELATIVE_PATH/network/environment-package

cd $SCRIPT_DIR