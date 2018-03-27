#!/bin/sh

FABRIC_VERSION=1.0.6
export FABRIC_CFG_PATH=$(pwd)/config
GENESIS=staging
CHANNEL_FILE=staging
CHANNEL_ID=composerchannel

if [ ! -d "./channel-artifacts" ]; then
  mkdir ./channel-artifacts
fi

echo "Download fabric-binary and extract them in ./bin directory"
curl -sSL https://goo.gl/kFFqh5 | bash -s $FABRIC_VERSION

echo "Generate certificates using cryptogen tool"
./bin/cryptogen generate --config=./crypto-config.yaml

echo "Generating Orderer Genesis block"
./bin/configtxgen -profile TwoOrgsOrdererGenesis -outputBlock ./$GENESIS.block

echo "Generating channel configuration transaction"
./bin/configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./$CHANNEL_FILE.tx -channelID $CHANNEL_ID

# remove the binaries
rm -rf ./bin