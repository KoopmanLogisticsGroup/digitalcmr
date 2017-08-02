#!/bin/bash -e

echo 'Adding testdata to the network'

composer participant add \
    -n "${COMPOSER_NETWORK}" \
    -i "${COMPOSER_USER}" \
    -s "${COMPOSER_PASSWORD}" \
    -d "$( cat testdata/users/compoundadmin.willem.json)"

composer identity issue \
    -n "${COMPOSER_NETWORK}" \
    -i "${COMPOSER_USER}" \
    -s "${COMPOSER_PASSWORD}" \
    -u willem \
    -a "$( cat testdata/users/compoundadmin.willem.identity)"