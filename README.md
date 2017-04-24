# Composer boilerplate
Get started quickly with a Fabric Composer project. Currently it only consists of a business network definition and a 
quick way of deploying it on a V1 network. We'll add functionality like the REST server, playground and generators soon. 

## Prerequisites
- Docker and docker-compose (https://www.docker.com/)  

## Getting started  
1. Get the latest baseimage and other images
```console
docker pull hyperledger/fabric-baseimage:x86_64-0.3.0 && docker tag hyperledger/fabric-baseimage:x86_64-0.3.0 hyperledger/fabric-baseimage:latest
docker pull hyperledger/fabric-ccenv:x86_64-1.0.0-alpha
docker pull hyperledger/fabric-couchdb:x86_64-1.0.0-alpha
```
2. Run the blockchain and deploy the business network: `docker-compose up`.  
  
Note: see `config/start.sh` if you want to know how it starts.

## Running the application
Start blockchain and deploy network  

Create composer container in different tab (after deployment succeeded)
```console
docker run -it \
    -v $(pwd)/bna:/bna \
    --link peer0:peer0.hlf1_default \
    --link ca0:ca0.hlf1_default \
    --env-file=.env \
    --network composerboilerplate_default composerboilerplate_setup bash
```
Tip: execute this so you don't have to add network, user and pass to every following command:  
```console
alias composer="composer -n \"\$COMPOSER_NETWORK\" -i \$COMPOSER_USER -s \$COMPOSER_PASSWORD"
```

Add participant  
```console
composer participant add -d '{"$class": "net.biz.digitalPropertyNetwork.Person", "personId": "personId:9631", "firstName": "","lastName": ""}'
```

Create asset  
```console
... how?
```

Submit transaction  
```console
composer transaction submit -d '{"$class": "net.biz.digitalPropertyNetwork.RegisterPropertyForSale","seller":"personId:9631", "title": "titleId:0892"}'
```

To manually update the network (note the backslash to not use the alias we set earlier):
```console
\composer archive create -t dir -n .
composer network deploy -a composer-boilerplate\@0.0.1.bna
```

Generate TypeScript  
```console
docker run --rm -v $(pwd)/server/src:/local --net=host swaggerapi/swagger-codegen-cli generate \
    -i http://localhost:3000/explorer/swagger.json \
    -l typescript-node \
    -o /local/sdk -DsupportsES6=true
```
