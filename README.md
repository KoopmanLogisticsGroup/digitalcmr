# Digital CMR on Blockchain

## Prerequisites
- Mac or Linux  
- Docker and docker-compose (https://www.docker.com/)  
- node 6.xx
- npm 5.xx (usually included in node package)

## Log in to whitewater NPM
1. Log in with your enterprise GitHub handle:
```bash
npm login --registry=https://npm-registry.whitewater.ibm.com --scope=@cicbenelux --auth-type=oauth
```
2. Optional: If your browser does not open any login page, then run `npm i -g @cicbenelux/notexistingpackage` and open the URL you get.

3. Execute the following commands to expose your token as an environment variable (always):  
**NOTE**: replace `.bash_profile` with `.zshrc` or something else if you run a different shell.  
```bash
source ~/.bash_profile
echo "export NPM_TOKEN=$(grep '//npm-registry.whitewater.ibm.com/:_authToken=' ~/.npmrc | cut -c47-)" >> ~/.bash_profile
```

## Getting started  
Get the baseimage and other images and install the node modules in local
```bash
npm install
```

Cleanup the running containers first
```bash
docker rm -f `docker ps -aq`
```

Start the blockchain network, composer and deploy business network  
```bash
docker-compose up --force-recreate
```
Wait until the chaincode has been deployed (`dev-` container up and running) and `composer-cli` exits.
Tip: you can wait until you see the `composer-rest-server` logging:
```bash
composer-rest-server_1    | 0|composer | Web server listening at: http://localhost:3000
composer-rest-server_1    | 0|composer | Browse your REST API at http://localhost:3000/explorer
```
Then open a new tab in you terminal and run the application (server and private data source)
```bash
docker-compose -f app-only.yml up --force-recreate
```

## Generate TypeScript for the server  
When you run the following command the models and API's are generated automatically.
```bash
npm run generateSDK
```