# Composer boilerplate  
[![Build Status](https://travis.ibm.com/CICBlockchain/composer-boilerplate.svg?token=YkWWPxQZ9L5fZzx9KKEr&branch=master)](https://travis.ibm.com/CICBlockchain/composer-boilerplate)  

Get started quickly with a Fabric Composer project. Currently it consists of a business network definition and a 
quick way of deploying it on a V1 network. We'll add functionality like the REST server, playground and generators soon. 

## Prerequisites
- Mac or Linux  
- Docker and docker-compose (https://www.docker.com/)  
- npm  

## Log in to whitewater NPM
1. Log in with your enterprise GitHub handle:
```console
npm login --registry=https://npm-registry.whitewater.ibm.com --scope=@cicbenelux --auth-type=oauth
```
2. Open the url you get when you do `npm i -g @cicbenelux/asdf`

3. Execute the following commands to expose your token as an environment variable (always):  
**NOTE**: replace .bashrc with .zshrc or something else if you run a different shell.  
```bash
echo "\nexport NPM_TOKEN=$(grep '//npm-registry.whitewater.ibm.com/:_authToken=' ~/.npmrc | cut -c47-)" >> ~/.bashrc
source ~/.bash_profile
```

## Getting started  
1. Get the baseimage and other images
```bash
docker pull hyperledger/fabric-baseimage:x86_64-0.3.0 && docker tag hyperledger/fabric-baseimage:x86_64-0.3.0 hyperledger/fabric-baseimage:latest
docker pull hyperledger/fabric-ccenv:x86_64-1.0.0-alpha
docker pull hyperledger/fabric-couchdb:x86_64-1.0.0-alpha
docker pull hyperledger/fabric-peer:x86_64-1.0.0-alpha
docker pull hyperledger/fabric-orderer:x86_64-1.0.0-alpha
```
2. Run the blockchain and deploy the business network: `docker-compose up`.  
  
Note: see `composer/docker-entrypoint.sh` if you want to know how it starts.

## Running the application
Start blockchain and server, deploy business network  
```bash
docker-compose up --force-recreate
```

## Generate TypeScript for the server  
When you run the following command
```bash
npm run generateSDK
```


## Using the composer cli
Create composer container in different tab (after deployment succeeded)
```bash
docker run -it \
    -v $(pwd)/composer/bna:/bna \
    --link peer0:peer0.hlf1_default \
    --link ca0:ca0.hlf1_default \
    --env-file=.env \
    --network composerboilerplate_default composerboilerplate_composer bash
```
Tip: execute this so you don't have to add network, user and pass to every following command:  
```bash
alias composer="composer -n \"\$COMPOSER_NETWORK\" -i \$COMPOSER_USER -s \$COMPOSER_PASSWORD"
```

Add participant  
```bash
composer participant add -d '{"$class": "net.biz.digitalPropertyNetwork.Person", "personId": "personId:42", "firstName": "Douglas","lastName": "Adams"}'
```

Create asset  
```bash
#... how?
```

Submit transaction  
```bash
composer transaction submit -d '{"$class": "net.biz.digitalPropertyNetwork.RegisterPropertyForSale","seller":"personId:42", "title": "titleId:0892"}'
```

To manually update the network (note the backslash to not use the alias we set earlier):
```bash
\composer archive create -t dir -n .
composer network deploy -a $COMPOSER_NETWORK\@$COMPOSER_VERSION.bna
```
