#!/usr/bin/env bash
cd composer

echo "removing old crypto"
rm -rf crypto-config

cp -r kpm-ponProfile/ .
echo "creating crypto"
cryptogen generate --config=./crypto-config.yaml
export FABRIC_CFG_PATH=$PWD
echo "creating genesis block"
configtxgen -profile TwoOrgsOrdererGenesis -outputBlock ./composer-genesis.block
echo "creating channel tx"
configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./composer-channel.tx -channelID composerchannel
echo "clean up"
rm configtx.yaml crypto-config.yaml
echo "done"