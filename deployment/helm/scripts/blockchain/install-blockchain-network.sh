#!/bin/sh

# arguments:
# first argument: enviroment name (the directory ../environments/$1 will be searched)
# second argument:
#   if '--generate-network' network cryptos and tx will be generated
#   if '--import-network' network cryptos and tx will be imported


if [ $2 = '--generate-network' ]
  then
    source ./network/generate-configtx.sh template-environment
fi

if [ $2 = '--import-network' ]
  then
    echo import
fi

#check environment directory

#generate configuration based on configtx.yaml

#run generate network script

#copy environment folder into charts

#run helm install blockchain network

#remove environment folder from charts