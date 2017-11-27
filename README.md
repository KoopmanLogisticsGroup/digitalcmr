# Digital CMR on Blockchain

## Prerequisites
- Mac or Linux  
- Docker and docker-compose (https://www.docker.com/)  
- node 6.xx
- npm 5.xx (usually included in node package)

## Getting started  
Get the baseimage and other images and install the node modules in local:
```bash
npm install
```
Cleanup the running containers first:
```bash
docker rm -f `docker ps -aq`
```
**Tip:** You can add something like a `cleanDocker` alias to use anytime for cleaning up your env.
```bash
echo "alias cleanDocker='docker rm -f -v $(docker ps -aq) 2>/dev/null; docker rmi $(docker images -qf "dangling=true") 2>/dev/null; docker rmi $(docker images | grep "dev-" | awk "{print $1}") 2>/dev/null; docker rmi $(docker images | grep "^<none>" | awk "{print $3}") 2>/dev/null;'" >> ~/.bash_profile
source ~/.bash_profile
```
Restart your terminal and then try to run: `cleanDocker`.


Start the blockchain network, composer and deploy business network: 
```bash
docker-compose up --force-recreate
```
Wait until the chaincode has been deployed (`dev-` container up and running) and `composer-cli` exits.
**Tip:** you can wait until you see the `composer-rest-server` logging:
```bash
composer-rest-server_1    | 0|composer | Web server listening at: http://localhost:3000
composer-rest-server_1    | 0|composer | Browse your REST API at http://localhost:3000/explorer
```
Then open a new tab in you terminal and run the application (server and private data source)
```bash
docker-compose -f app-only.yml up --force-recreate
```
Additional and useful commands:
- to build all the application components: `docker-compose -f app-only.yml build`
- to build only one application component: `docker-compose -f app-only.yml build server`
- to run only one component at time: `docker-compose -f app-only.yml up --force-recreate server`
- if you are working only frontend: `docker-compose -f app-only.yml up --force-recreate client`

**Remember you can kill containers singularly and restart them in case you need. You should not clean up and restart all the environment every time if not needed** (that will save you a lot of time).