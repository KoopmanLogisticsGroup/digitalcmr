#!/bin/sh -e

sleep 10

 composer identity import -u "${COMPOSER_ENROLLMENT_ID}" \
 -p "${COMPOSER_CONNECTION_PROFILE}" -c /admin-crypto/signcerts/Admin@org1.example.com-cert.pem \
 -k /admin-crypto/keystore/`ls /admin-crypto/keystore`

 composer archive create -t dir -n bna -a ./"${COMPOSER_BUSINESS_NETWORK}".bna

 composer network deploy -a "${COMPOSER_BUSINESS_NETWORK}".bna -i "${COMPOSER_ENROLLMENT_ID}" -s "${COMPOSER_ENROLLMENT_SECRET}" -p "${COMPOSER_CONNECTION_PROFILE}"

# composer network deploy -a "${COMPOSER_BUSINESS_NETWORK}".bna -i "${COMPOSER_ENROLLMENT_ID}" -s "${COMPOSER_ENROLLMENT_SECRET}" -p "${COMPOSER_CONNECTION_PROFILE}" -A admin -S
#
# composer participant add -p "${COMPOSER_CONNECTION_PROFILE}" -i admin -s adminpw -d '{"$class":"org.hyperledger.composer.system.NetworkAdmin", "participantId":"admin"}' -n "${COMPOSER_BUSINESS_NETWORK}"
#
# composer identity issue -p "${COMPOSER_CONNECTION_PROFILE}" -i admin -s adminpw -u admin -a "org.hyperledger.composer.system.NetworkAdmin#admin" -n "${COMPOSER_BUSINESS_NETWORK}" -x true
#
# composer network ping -i composeradmin -s randomString -p "${COMPOSER_CONNECTION_PROFILE}" -n "${COMPOSER_BUSINESS_NETWORK}"