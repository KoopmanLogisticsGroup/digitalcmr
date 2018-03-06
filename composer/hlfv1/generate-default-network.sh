#!/usr/bin/env bash
cd composer

echo "removing old crypto"
rm -rf crypto-config

cp -r defaultProfile/ .
echo "creating crypto"
cryptogen generate --config=./crypto-config.yaml
export FABRIC_CFG_PATH=$PWD
echo "creating genesis block"
configtxgen -profile ComposerOrdererGenesis -outputBlock ./composer-genesis.block
echo "creating channel tx"
configtxgen -profile ComposerChannel -outputCreateChannelTx ./composer-channel.tx -channelID composerchannel
echo "clean up"
rm configtx.yaml crypto-config.yaml
echo "done"