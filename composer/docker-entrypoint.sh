#!/bin/bash -e
# Deploy network
cd /bna
mkdir dist || true
rm -r dist/*.bna || true

ls /admin-crypto || (echo "Admin keys not found."; exit 1)

# Create archive
composer archive create --sourceType dir --sourceName . -a "./dist/${COMPOSER_NETWORK}.bna"

WAITTIME=${COMPOSER_WAIT_TIME:-60}
echo "Waiting for $WAITTIME seconds to allow the peers to get to know eachother"
sleep $WAITTIME

# Get credentials of admin. Note: make sure that the material is loaded as a volume and that the priv key is correct.
composer identity import \
    -p defaultProfile \
    -u "${COMPOSER_PEER_ADMIN}" \
    -c /admin-crypto/msp/signcerts/Admin@org1.example.com-cert.pem \
    -k /admin-crypto/msp/keystore/114aab0e76bf0c78308f89efc4b8c9423e31568da0c340ca187a9b17aa9a4457_sk

# Deploy
composer network deploy \
    -a "dist/${COMPOSER_NETWORK}.bna" \
    -i "${COMPOSER_PEER_ADMIN}" \
    -s "${COMPOSER_PASSWORD}" \
    -p defaultProfile

#add testdata
echo 'Invoking testdata script'
source testdata/add-testdata.sh &

## Start server
composer-rest-server \
    -p defaultProfile \
    -n "${COMPOSER_NETWORK}" \
    -i "${COMPOSER_PEER_ADMIN}" \
    -s "${COMPOSER_PASSWORD}" \
    -S "${COMPOSER_SECURITY}" \
    -N "required" \

exec "$@"
