# Deploying part of loopback-composer-boilerplate to IBM Kubernetes with Helm

In this document the deployment of part of the loopback-composer-boilerplate to kubernetes with Helm will be explained.

This document explains how to deploy the client, server, and couchDB. This will not make the boilerplate work. To do this you have to make a connection with IBM blockchain network.

## Requirements

The requirements for the kubernetes configurations to work are:

- Paid kubernetes cluster on IBM Cloud
- Image registry on IBM Cloud

## Initializing the cluster and environment

In this section settings the environment variables, creating persistent volume claim, building and pushing images, and initializing Helm will be described.

### Setting the values for Helm

In the values.yaml file the variables should be set accordingly.

### Connect `kubectl` to IBM Cloud cluster

Connect `kubectl` to your IBM Cloud cluster by following 'Access' setup in your IBM Cloud kubernetes cluster overview.

### Creating persistent volume claim

To create a persistent volume claim do the following:

- Set the `volume.beta.kubernetes.io/storage-class` value to the storage class that is need for your project. The different storage classes can be found [here](https://console.bluemix.net/docs/containers/cs_storage.html#storage).
- Set the billing type. It is good practice to set this to hourly.

After this run: 

`kubectl create -f kubernetes/volume-claim.yaml`

This claim is needed for the couchdb, to persist its data when the container goes down.

### Building and pushing images
 
To build and push the images go to the docker folder and run:
  1. `./docker/build-custom-images-ibmcloud.sh`
  2. `./docker/push-custom-images-ibmcloud.sh`
  
This will make the images available in the IBM Cloud image registry.

### Initialize Helm

Running `helm init` will initialize Helm in your cluster. 

NOTE: No security configurations will be set with running a dry helm init. Make sure to configure the security settings to match the security level needed for your project.

## Deploying the boilerplate to cluster

In this section setting the deploying the boilerplate with a helm chart will be explained.

### Deploying the boilerplate

#### Creating helm chart in cluster

To actual deploy the boilerplate 3 containers have to be created within the cluster, the couchDB (private-db), the server, and the client. Also the configmap and the secrets have to be instantiated. Helm charts are used for this.

To deploy the helm chart run `helm install -n "cloud-env" helm/loopback-composer-boilerplate`

After this is done run `kubectl get pods` to make sure all the containers are now running as pods and created successfully.

#### Connecting client and server

To connect the client that is running in the browser to the server that is located within the cluster. Do the following:

- Run `kubectl get service loopback-composer-boilerplate-server`. This will display the information about the loopback-composer-boilerplate-server running in the cluster.
- Run the `./docker/set-server-address.sh` script. It will automatically set the correct server host and port in your client container. Remember to do this every time the client gets redeployed, as these changes are only temporary.

To make these change active, follow the steps in 'Release new version of your code'

## Release new version of your code

Say you have added some functionality to the boilerplate which you would like to deploy. Do the following:
3. Run `./docker/build-custom-images-ibmcloud.sh [REGISTRY_FULLPATH] [TAG_IMAGE]` (e.g. `./docker/build-custom-images-ibmcloud.sh registry.eu-de.bluemix.net/apps sprint1`)
4. Run `./docker/push-custom-images-ibmcloud.sh`
5. Run `helm upgrade -i "cloud-env" loopback-composer-boilerplate` to redeploy it again

## Connecting to the client

To connect to the client run `kubectl get services loopback-composer-boilerplate-client`. Copy the EXTERNAL-IP and add the port 4200 at the end of the url, e.g. `123.456.78.901:4200`.

Now paste this in the url of the web browser and the client should be served.

## Purge the deployed environment
1. `helm del --purge cloud-env`
2. `kubectl delete -f kubernetes/volume-claim.yaml`

## Stop the minikube VM
Run `minikube stop`

## Purge the minikube VM
Run `minikube delete`
