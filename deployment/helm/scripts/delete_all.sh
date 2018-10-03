#!/bin/sh

echo "deleting blockchain network"
helm delete blockchain-network --purge;
echo "done. Deleting blockchain app"
helm delete blockchain-application --purge;
echo "done. Deleting unfinished jobs"
kubectl delete jobs --all
echo "done"
