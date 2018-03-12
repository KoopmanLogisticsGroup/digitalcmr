#!/bin/sh -e

sleep 10

 composer identity import -u "${COMPOSER_ENROLLMENT_ID}" \
 -p "kpm-pon" -c /admin-crypto/kpm-pon/signcerts/Admin@kpm-pon-cert.pem \
 -k /admin-crypto/kpm-pon/keystore/`ls /admin-crypto/kpm-pon/keystore`

 composer archive create -t dir -n bna -a ./"${COMPOSER_BUSINESS_NETWORK}".bna

 composer network deploy -a "${COMPOSER_BUSINESS_NETWORK}".bna -i "${COMPOSER_ENROLLMENT_ID}" -s "${COMPOSER_ENROLLMENT_SECRET}" -p "kpm-pon"

  composer identity import -u "${COMPOSER_ENROLLMENT_ID}" \
 -p "pon" -c /admin-crypto/pon/signcerts/Admin@pon-cert.pem \
 -k /admin-crypto/pon/keystore/`ls /admin-crypto/pon/keystore`

 composer network deploy -a "${COMPOSER_BUSINESS_NETWORK}".bna -i "${COMPOSER_ENROLLMENT_ID}" -s "${COMPOSER_ENROLLMENT_SECRET}" -p "pon"