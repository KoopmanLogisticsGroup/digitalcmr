#!/bin/bash

if [ "${PWD##*/}" == "create" ]; then
	:
elif [ "${PWD##*/}" == "scripts" ]; then
	:
else
    echo "Please run the script from 'scripts' or 'scripts/create' folder"
fi

echo ""
echo "=> DELETE_ALL: Deleting application"
delete/delete_application.sh

echo ""
echo "=> DELETE_ALL: Deleting blockchain"
delete/delete_blockchain.sh

echo ""
echo "=> DELETE_ALL: Deleting create and join channel pods"
delete/delete_channel-pods.sh

echo ""
echo "=> DELETE_ALL: Deleting composer playground"
delete/delete_composer.sh

echo ""
echo "=> DELETE_ALL: Deleting persistent volumes and claims"
delete/delete_persistent-volumes.sh

echo ""
echo "=> DELETE_ALL: Wiping the shared folder empty"
./wipe_shared.sh