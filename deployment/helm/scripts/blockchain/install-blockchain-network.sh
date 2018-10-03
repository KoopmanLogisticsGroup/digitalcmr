#!/bin/sh

# arguments:
# first argument: enviroment name (the directory ../environments/$1 will be searched)
# second argument:
#   if '--generate-network' network cryptos and tx will be generated
#   if '--import-network' network cryptos and tx will be imported


if [ $2 = '--generate-network' ]
  then
    source ./network/generate-configtx.sh $1
    source ./network/generate-crypto-config.sh $1
    source ./network/generate-network.sh $1
fi

if [ $2 = '--import-network' ]
  then
    source ./network/copy-values-into-charts.sh $1
    echo "importing network"
fi

source ./network/copy-environment-into-charts.sh $1

source ./network/helm-install-network.sh $1

#copy environment folder into charts

#run helm install blockchain network

#remove environment folder from charts