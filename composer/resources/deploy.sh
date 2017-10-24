#!/bin/sh -e

sleep 10

composer identity import -u "${COMPOSER_ENROLLMENT_ID}" \
 -p "${COMPOSER_CONNECTION_PROFILE}" -c /admin-crypto/signcerts/Admin@org1.example.com-cert.pem \
 -k /admin-crypto/keystore/`ls /admin-crypto/keystore`

 composer archive create -t dir -n bna -a ./"${COMPOSER_BUSINESS_NETWORK}".bna

 composer network deploy -a "${COMPOSER_BUSINESS_NETWORK}".bna -i "${COMPOSER_ENROLLMENT_ID}" -s "${COMPOSER_ENROLLMENT_SECRET}" -p "${COMPOSER_CONNECTION_PROFILE}" -A admin -S