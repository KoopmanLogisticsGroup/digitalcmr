#!/bin/bash

SCRIPT_DIR=$(pwd)
ENV_RELATIVE_PATH="/../../environments/$1/network"

# copy and execute this script in the specific config folder which contains the configtx and crypto-config files
FABRIC_VERSION=1.0.6
GENESIS=genericgenesis
CHANNEL_FILE=genericnetwork
CHANNEL_ID=genericchannel

cd $SCRIPT_DIR$ENV_RELATIVE_PATH

export FABRIC_CFG_PATH=$(pwd)

if [ ! -d "./channel-artifacts" ]; then
  mkdir ./channel-artifacts
fi

if [ ! -d "./bin" ]; then
  echo "Download fabric-binary and extract them in ./bin directory"
  curl -sSL https://goo.gl/kFFqh5 | bash -s $FABRIC_VERSION
fi

echo "Generate certificates using cryptogen tool"
./bin/cryptogen generate --config=./crypto-config.yaml

echo "Generating Orderer Genesis block"
./bin/configtxgen -profile TwoOrgsOrdererGenesis -outputBlock ./$GENESIS.block

echo "Generating channel configuration transaction"
./bin/configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./$CHANNEL_FILE.tx -channelID $CHANNEL_ID

echo "Renaming directories"
find . -name "*@*" -type d -exec bash -c 'mv $1 `echo ${1/@/-} | tr [:upper:] [:lower:]`' -- {} \;
sleep 1;

echo "Renaming files"
find . -name "*@*" -type f -exec bash -c 'mv $1 `echo ${1/@/-} | tr [:upper:] [:lower:]`' -- {} \;
echo "done"

#remove the binaries
#rm -rf ./bin

cd $SCRIPT_DIR