#!/bin/sh

# copy and execute this script in the specific config folder which contains the configtx and crypto-config files
FABRIC_VERSION=1.0.6
export FABRIC_CFG_PATH=$(pwd)
GENESIS=genericgenesis
CHANNEL_FILE=genericnetwork
CHANNEL_ID=genericchannel

if [ ! -d "./channel-artifacts" ]; then
  mkdir ./channel-artifacts
fi

echo "Download fabric-binary and extract them in ./bin directory"
curl -sSL https://goo.gl/kFFqh5 | bash -s $FABRIC_VERSION

echo "Generate certificates using cryptogen tool"
../digital-cmr/charts/org1-org2/bin/cryptogen generate --config=./crypto-config.yaml

echo "Generating Orderer Genesis block"
../digital-cmr/charts/org1-org2/bin/configtxgen -profile TwoOrgsOrdererGenesis -outputBlock ./$GENESIS.block

echo "Generating channel configuration transaction"
../digital-cmr/charts/org1-org2/bin/configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./$CHANNEL_FILE.tx -channelID $CHANNEL_ID

echo "Renaming directories"
find . -name "*@*" -type d -exec bash -c 'mv $1 `echo ${1/@/-} | tr [:upper:] [:lower:]`' -- {} \;
sleep 1;

echo "Renaming files"
find . -name "*@*" -type f -exec bash -c 'mv $1 `echo ${1/@/-} | tr [:upper:] [:lower:]`' -- {} \;
echo "done"

remove the binaries
rm -rf ./bin

# remove this file
