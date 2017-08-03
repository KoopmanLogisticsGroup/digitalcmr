#!/bin/bash -e

echo 'Adding testdata to the network'

echo 'Adding participant lapo as LegalOwnerAdmin'
composer participant add \
    -n "${COMPOSER_NETWORK}" \
    -i "${COMPOSER_USER}" \
    -s "${COMPOSER_PASSWORD}" \
    -d "$( cat testdata/users/lapo/legalowneradmin.lapo.json)"

composer identity issue \
    -n "${COMPOSER_NETWORK}" \
    -i "${COMPOSER_USER}" \
    -s "${COMPOSER_PASSWORD}" \
    -u lapo \
    -a "$( cat testdata/users/lapo/legalowneradmin.lapo.identity)" \
    &

echo 'Adding participant willem as CompoundAdmin'
composer participant add \
    -n "${COMPOSER_NETWORK}" \
    -i "${COMPOSER_USER}" \
    -s "${COMPOSER_PASSWORD}" \
    -d "$( cat testdata/users/willem/compoundadmin.willem.json)"

composer identity issue \
    -n "${COMPOSER_NETWORK}" \
    -i "${COMPOSER_USER}" \
    -s "${COMPOSER_PASSWORD}" \
    -u willem \
    -a "$( cat testdata/users/willem/compoundadmin.willem.identity)" \
    &

echo 'Adding participant goslin as CarrierAdmin'
composer participant add \
    -n "${COMPOSER_NETWORK}" \
    -i "${COMPOSER_USER}" \
    -s "${COMPOSER_PASSWORD}" \
    -d "$( cat testdata/users/goslin/carrieradmin.goslin.json)"

composer identity issue \
    -n "${COMPOSER_NETWORK}" \
    -i "${COMPOSER_USER}" \
    -s "${COMPOSER_PASSWORD}" \
    -u goslin \
    -a "$( cat testdata/users/goslin/carrieradmin.goslin.identity)" \
    &

echo 'Adding participant harry as CarrierMember'
composer participant add \
    -n "${COMPOSER_NETWORK}" \
    -i "${COMPOSER_USER}" \
    -s "${COMPOSER_PASSWORD}" \
    -d "$( cat testdata/users/harry/carriermember.harry.json)"

composer identity issue \
    -n "${COMPOSER_NETWORK}" \
    -i "${COMPOSER_USER}" \
    -s "${COMPOSER_PASSWORD}" \
    -u harry \
    -a "$( cat testdata/users/harry/carriermember.harry.identity)" \
    &

echo 'Adding participant rob as RecipientMember'
composer participant add \
    -n "${COMPOSER_NETWORK}" \
    -i "${COMPOSER_USER}" \
    -s "${COMPOSER_PASSWORD}" \
    -d "$( cat testdata/users/rob/recipientmember.rob.json)"

composer identity issue \
    -n "${COMPOSER_NETWORK}" \
    -i "${COMPOSER_USER}" \
    -s "${COMPOSER_PASSWORD}" \
    -u rob \
    -a "$( cat testdata/users/rob/recipientmember.rob.identity)" \
    &

echo 'Adding participant clara as RecipientAdmin'
composer participant add \
    -n "${COMPOSER_NETWORK}" \
    -i "${COMPOSER_USER}" \
    -s "${COMPOSER_PASSWORD}" \
    -d "$( cat testdata/users/clara/recipientadmin.clara.json)"

composer identity issue \
    -n "${COMPOSER_NETWORK}" \
    -i "${COMPOSER_USER}" \
    -s "${COMPOSER_PASSWORD}" \
    -u clara \
    -a "$( cat testdata/users/clara/recipientadmin.clara.identity)" \
    &

echo 'Creating first LegalOwnerOrg'
composer transaction submit \
    -p defaultProfile \
    -n "${COMPOSER_NETWORK}" \
    -i "${COMPOSER_USER}" \
    -s "${COMPOSER_PASSWORD}" \
    -d "$( cat testdata/organizations/leaseplan.json)"

echo 'Creating first CompoundOrg'
composer transaction submit \
    -p defaultProfile \
    -n "${COMPOSER_NETWORK}" \
    -i "${COMPOSER_USER}" \
    -s "${COMPOSER_PASSWORD}" \
    -d "$( cat testdata/organizations/amsterdamcompound.json)"

echo 'Creating first CarrierOrg'
composer transaction submit \
    -p defaultProfile \
    -n "${COMPOSER_NETWORK}" \
    -i "${COMPOSER_USER}" \
    -s "${COMPOSER_PASSWORD}" \
    -d "$( cat testdata/organizations/koopman.json)"

echo 'Creating first RecipientOrg'
composer transaction submit \
    -p defaultProfile \
    -n "${COMPOSER_NETWORK}" \
    -i "${COMPOSER_USER}" \
    -s "${COMPOSER_PASSWORD}" \
    -d "$( cat testdata/organizations/cardealer.json)"

echo 'Creating first vehicles'
composer transaction submit \
    -p defaultProfile \
    -n "${COMPOSER_NETWORK}" \
    -i "${COMPOSER_USER}" \
    -s "${COMPOSER_PASSWORD}" \
    -d "$( cat testdata/vehicles/vehicles.json)"

echo 'Creating first ECMR'
composer transaction submit \
    -p defaultProfile \
    -n "${COMPOSER_NETWORK}" \
    -i "${COMPOSER_USER}" \
    -s "${COMPOSER_PASSWORD}" \
    -d "$( cat testdata/ecmr/ecmr-01.json)"