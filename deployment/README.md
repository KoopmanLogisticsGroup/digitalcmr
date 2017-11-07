# Bluemix deployment guidelines

## Create a Kubernetes cluster
First follow this guide to set up a k8s (kubernetes) cluster on Bluemix:

1. [Develop in a cloud sandbox IBM Blockchain Platform](https://ibm-blockchain.github.io/)

2. Stop at section: **Simple Install**

## Deploy the blockchain network
1. Navigate to the `scripts` sub-directory:
```bash
cd cs-offerings/scripts
```
2. Run the script to use couchdb as worldstate db for peers:
```bash
./create_all.sh --with-couchdb
```
which will create the following:
- Creating the blockchain network (with the configuration mentioned in the guide above)
- Creating the single channel `channel1`
- Adding `peer1org1` and `peer1org2` to `channel1`
- Creating the Composer-Playground

Now your blockchain network is up and running and you should be able to see the pods result running:
```bash
kubectl proxy

# On the browser go to 127.0.0.1:8001/ui
```

## Deploy the application 
### Create the Docker images for the application
1. Build the images for `client`, `server` and `private-db`
```bash
docker-compose -f app-only build
```
2. Build the image for the swagger API
```bash
cd api_doc
docker build -t digitalcmr_api_doc .
```
### Tag and push the images to Bluemix
1. Tag your images as follows
```bash
docker tag digitalcmr_client registry.eu-gb.bluemix.net/YOUR_SPACE_REGISTRY/digitalcmr_client
docker tag digitalcmr_server registry.eu-gb.bluemix.net/YOUR_SPACE_REGISTRY/digitalcmr_server
docker tag digitalcmr_api_doc registry.eu-gb.bluemix.net/YOUR_SPACE_REGISTRY/digitalcmr_api_doc
```
**Your Bluemix space has a specific limit of images/GBs, therefore we can avoid to push the private-db image and instead using the one from the official docker hub registry**
2. Push all the images to your Bluemix private registry
```bash
docker push registry.eu-gb.bluemix.net/YOUR_SPACE_REGISTRY/digitalcmr_client
docker push registry.eu-gb.bluemix.net/YOUR_SPACE_REGISTRY/digitalcmr_server
docker push registry.eu-gb.bluemix.net/YOUR_SPACE_REGISTRY/digitalcmr_api_doc
```
## Deploy your Business Network Archive
1. Export the `.bna` containing all the rules of your business network
```bash
cd composer/bna
npm run prepublish
```
Your `.bna` will be under the `./composer/bna/dist` folder. Check it contains all the updated information
2. Access the Composer-Playground using the Public IP address and the port provided by k8s
3. In the section `hlfv1` go to `deploy` and select the `.bna`
4. Wait until the operation is completed. Then your business network (chaincode container) is up and running.

**Now you can run your application.**

### Create the k8s pods for the app
1. Navigate to the `create` sub-directory:
```bash
cd cs-offerings/scripts/create
```
2. Run the script to create all the app services and pods
```bash
./create_application.sh
```

### Deploy testData
You should now add the initial data needed to your application (including blockchain users).

## Run the Composer-Rest-Server
1. Navigate to the `create` sub-directory:
```bash
cd cs-offerings/scripts/create
```
2. Run the script to create all the app services and pods
```bash
./create_composer-rest-server.sh
```
3. Access the Composer-Rest-Server using the Public IP address and the port provided by k8s
4. Test it out

## Clean up the environment
You can easily clean up all the k8s environment anytime using the `delete_all` script
1. Navigate to the `scripts` sub-directory:
```bash
cd cs-offerings/scripts
```
2. Run the script to create all the app services and pods
```bash
./delete_all.sh
```
or, alternatively, you can delete a specific components using one of the script contained in `cs-offerings/scripts/delete` directory.
