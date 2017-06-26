###What's in this directory
Bna and hlfv1 are straight from the source (see below how to update).  


###To upgrade

```bash
cd composer
rm -r fabric-tools

# Download tools (crypto and docker compose)
curl -O https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/fabric-dev-servers.zip
unzip fabric-dev-servers.zip

cd fabric-tools

# To see if there are changes
./downloadFabric.sh
./startFabric.sh
./createComposerProfile.sh
cat ~/.composer-connection-profiles/hlfv1/connection.json
# See if there are any changes in the format and change them in docker-compose.yml

cd ..
mv -r fabric-tools/fabric-scripts/hlfv1 .
rm -rf fabric-tools fabric-dev-servers.zip

```

## To upgrade bna
```bash
curl -O -L https://github.com/hyperledger/composer-sample-networks/archive/master.zip 
unzip master.zip
rm master.zip

# Careful
rm -rf bna
cp -r composer-sample-networks-master/packages/basic-sample-network bna
rm -rf composer-sample-networks-master
cd bna
npm install
```