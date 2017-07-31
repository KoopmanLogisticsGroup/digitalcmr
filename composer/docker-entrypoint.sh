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
    -u "$COMPOSER_USER" \
    -c /admin-crypto/signcerts/Admin@org1.example.com-cert.pem \
    -k /admin-crypto/keystore/9022d671ceedbb24af3ea69b5a8136cc64203df6b9920e26f48123fcfcb1d2e9_sk

# Deploy
composer network deploy \
    -a "dist/${COMPOSER_NETWORK}.bna" \
    -i "${COMPOSER_USER}" \
    -s notused

# Start server
composer-rest-server \
    -p defaultProfile \
    -n "${COMPOSER_NETWORK}" \
    -i "${COMPOSER_USER}" \
    -s "${COMPOSER_PASSWORD}" \
    -S "${COMPOSER_SECURITY}" \
    -N "required"

exec "$@"