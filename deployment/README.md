# Bluemix deployment guidelines
Note that the current configuration is valid for:
- Hyperledger Fabric v1.0.x
- Hyperledger Composer v0.13.x
- Kubernetes and Kubernetes-CLI v1.9.x

## Create a Kubernetes cluster
This guide will allow you to set up a k8s (kubernetes) cluster on Bluemix.
The following steps are based on: [Develop in a cloud sandbox IBM Blockchain Platform](https://ibm-blockchain.github.io/).

**Note: The version of the above guide could be updated and differ from the steps explain below, so consider it as general understanding of the following procedure.**

### Prepare required CLIs and plugins
First, we will download and add the CLIs and plugins that we need to interact with the IBM Container Service. If you do not already have `zip` and `unzip`, install them now.

- Download and install [kubectl CLI](https://kubernetes.io/docs/tasks/kubectl/install/). If you have `brew` installed: `brew install kubernetes-cli kubectl`
- Download and install the [Bluemix CLI](https://console.bluemix.net/docs/cli/reference/bluemix_cli/download_cli.html#download_install)
- Add the bluemix plugins repo
```bash
bx plugin repo-add bluemix https://plugins.ng.bluemix.net
```
Note: If you get the following error, it means that the repository bluemix already exists on your computer. Thus, you can ignore the error and move to the next step.
```bash
Plug-in repo named 'bluemix' already exists. Try a different name.
```
- Add the container service plugin
```bash
bx plugin install container-service -r bluemix
```

## Setup a cluster
Now, we will use those CLIs and plugins to create a cluster on the IBM Container Service. Use these steps to setup a cluster named blockchain on IBM Container Service. For more information about how to use the [bluemix cli](https://console.bluemix.net/docs/cli/reference/bluemix_cli/bx_cli.html#bluemix_cli).

- Point Bluemix CLI to production API
```bash
bx api api.ng.bluemix.net
```
Note: The API used in the guide are for US. If you want to set up a cluster in any other location you need to specify the right API address.

e.g. For UK: **api.eu-gb.bluemix.net**

- Login to Bluemix
```bash
bx login
```

- Create a cluster on IBM Container Service
This will create a **free cluster** on the IBM Container Service.
```bash
bx cs cluster-create --name YOURCLUSTERNAME
```

- Wait for the cluster to be ready
Issue the following command to ascertain the status of your cluster:
```bash
bx cs clusters
```
The process goes through the following lifecycle - `requesting –> pending –> deploying –> normal`. Initially you will see something similar to the following:
```bash
Name              ID                                 State       Created                    Workers
YOURCLUSTERNAME   7fb45431d9a54d2293bae421988b0080   deploying   2017-05-09T14:55:09+0000   0
```
Wait for the State to change to normal. Note that this can take upwards of 15-30 minutes. If it takes more than 30 minutes, there is an inner issue on the IBM Container Service.

You should see the following output when the cluster is ready:
```bash
$ bx cs clusters
Listing clusters...
OK
Name              ID                                 State    Created                    Workers
YOURCLUSTERNAME   0783c15e421749a59e2f5b7efdd351d1   normal   2017-05-09T16:13:11+0000   1
```
Use the following syntax to inspect on the status of the workers: Command:
```bash
bx cs workers YOURCLUSTERNAME
```
The expected response is as follows:
```bash
$ bx cs workers YOURCLUSTERNAME
Listing cluster workers...
OK
ID                                                 Public IP       Private IP       Machine Type   State    Status
kube-dal10-pa0783c15e421749a59e2f5b7efdd351d1-w1   169.48.140.48   10.176.190.176   free           normal   Ready
```
- Configure `kubectl` to use the cluster
Issue the following command to download the configuration for your cluster:
```bash
bx cs cluster-config YOURCLUSTERNAME
```
Expected output:
```bash
Downloading cluster config for YOURCLUSTERNAME
OK
The configuration for YOURCLUSTERNAME was downloaded successfully. Export environment variables to start using Kubernetes.

export KUBECONFIG=/home/*****/.bluemix/plugins/container-service/clusters/blockchain/kube-config-prod-dal10-blockchain.yml
```
The export command in the output must be run as a separate command along with the `KUBECONFIG` information that followed it.

(Replace this example with the output from running the step above!)
```bash
$ export KUBECONFIG=/home/*****/.bluemix/plugins/container-service/clusters/blockchain/kube-config-prod-dal10-blockchain.yml
```

**Congratulations!**

You have successfully created the blockchain cluster on IBM Container Service.

### Helpful commands for kubectl
```bash
# To get the logs of a component, use -f to follow the logs
kubectl logs $(kubectl get pods | grep <component> | awk '{print $1}')
# Example
kubectl logs $(kubectl get pods | grep org1peer1 | awk '{print $1}')

# To get into a running container
kubectl exec -ti $(kubectl get pods | grep <component> | awk '{print $1}') bash
# Example
kubectl exec -ti $(kubectl get pods | grep ordererca | awk '{print $1}') bash

# To get kubernetes UI
kubectl proxy

# On the browser go to 127.0.0.1:8001/ui
```

## Deploy the application 
### Create the Docker images for the application
Build the images for `client`, `server` and `api`
```bash
docker-compose -f app-only.yml build
```
### Tag and push the images to Bluemix
1. First set up a private Docker registry on your current organization if you do not have yet.
[Bluemix Containers - Registry Getting Started](https://console.bluemix.net/containers-kubernetes/registry/start)
```bash
bx plugin update container-registry -r Bluemix
bx cr login
bx cr image-list
```
2. Tag your images as follows

- The `REGISTRY_BASEPATH` mentioned below should contain the address based on your space location.

e.g. For UK: _registry.eu-gb.bluemix.net_

- The `REGISTRY_SPACE` is the space within your organization in which the docker images will be pushed.
- The `TAG` should be referred to the specific environment your going to depoy against. Be sure this information match the ones contained in the kubernetes config files.
```bash
export REGISTRY_BASEPATH=YOUR_BASPATH
export REGISTRY_SPACE=YOUR_SPACE_REGISTRY
export TAG=ENVIRONMENT
docker tag digitalcmr_client $REGISTRY_BASEPATH/$REGISTRY_SPACE/digitalcmr_client:$TAG
docker tag digitalcmr_server $REGISTRY_BASEPATH/$REGISTRY_SPACE/digitalcmr_server:$TAG
docker tag digitalcmr_api_doc $REGISTRY_BASEPATH/$REGISTRY_SPACE/digitalcmr_api_doc:$TAG
```
**Be aware your Bluemix space has a specific limit of images/GBs. You may need to delete other images to push new ones.**
3. Push all the images to your Bluemix private registry
```bash
docker push $REGISTRY_BASEPATH/$REGISTRY_SPACE/digitalcmr_client:$TAG
docker push $REGISTRY_BASEPATH/$REGISTRY_SPACE/digitalcmr_server:$TAG
docker push $REGISTRY_BASEPATH/$REGISTRY_SPACE/digitalcmr_api_doc:$TAG
```

## Create the Business Network Archive (BNA)
1. Move to the Composer folder
```bash
cd composer/bna
```
2. Install the required dependencies
```bash
npm i
```
3. Export the `.bna` containing all the rules of your business network
```bash
npm run prepublish
```

## Single environment - Development
This procedure will deploy a similar configuration we use as `development` on our local environment.
It can be used for testing/demo purposes.

### What do I get?
The `create_all` script will bring up the following components:
- A pre-configured Fabric (blockchain runtime):
  - 1 Fabric CA
  - 1 Orderer node (running "solo")
  - 2 Fabric peer nodes (one apiece for each peer org - org1 & org2 running on couchdb)
  - 2 CouchDBs for the worldstate
- Composer Playground (UI for creating and deploying Business Networks to Fabric)
- Some utilities to generate the crypto-config and the channel/genesis-block configurations
- The application composed by:
  - 1 Client application
  - 1 Server application
  - 1 API server (based on swagger)
  - 1 Private DB
- Persistent volumes are in place for: worldstate and blockchain; private database; participant credentials

### Before starting
**Move to the following folder:**
```bash
cd development
```

### Deploy the blockchain network
1. Navigate to the `scripts` sub-directory:
```bash
cd ./scripts
```
2. Run the script to use couchdb as worldstate db for peers:
```bash
./create_all.sh
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

### Deploy your Business Network Archive
If you follow the procedure to create the `.bna` file, it will be under the `./composer/bna/dist` folder. Check it contains all the updated information
1. Access the Composer-Playground using the Public IP address and the port provided by k8s
2. In the section `hlfv1` go to `deploy` and select the `.bna`
3. Wait until the operation is completed. Then your business network (chaincode container) is up and running

**Note: Wait at least 5 min to be sure the admin user has been successfully enrolled, otherwise you risk to compromise its certificate.**

Now you can run your application.

### Deploy your application
**Note: Before spinning up the application, be sure you have the following:**
- Your server holds the correct addresses of the blockchain network under `server/resources/connectionProfiles/PROFILE_NAME`
- Your server has a configuration for your environment under `server/config/` and it is linked to `server/config/index.ts`
- Your client holds the correct address to your remote server in `client/src/environments/environment.ENVIRONMENT.ts`

**Note: In case you made some changes in the steps above, remember to rebuild the image and to push it again to the registry.** 
1. Navigate to the `scripts` sub-directory:
```bash
cd ./scripts
```
2. Run the script to create all the app services and pods
```bash
./create/create_application.sh
```
or, alternatively, if you want to create selectively a single component of the application
```text
Open the file scripts/create/create_application.sh
KUBECONFIG_FOLDER=${PWD}/../kube-configs/application
The following commands, for instance, will run only the private database and the server (on persistent volumes):
kubectl apply -f ${KUBECONFIG_FOLDER}/../persistent-volumes/privatedb-pv.yaml
kubectl apply -f ${KUBECONFIG_FOLDER}/../persistent-volumes/credentials-pv.yaml

kubectl apply -f ${KUBECONFIG_FOLDER}/privatedb-services.yaml
kubectl apply -f ${KUBECONFIG_FOLDER}/server-services.yaml

kubectl apply -f ${KUBECONFIG_FOLDER}/privatedb.yaml --validate=false
kubectl apply -f ${KUBECONFIG_FOLDER}/server.yaml --validate=false

```

### Deploy a new version of the application
**Note: If you want to replace user identities and data previously added to the system, then follow the section below _Run a clean environemnt_.**

Instead, if you do not want to delete your previous blockchain network together with the ledger of all the transactions, then you could follow the steps below:

1. Delete the application pods and services
- If you want to delete selectively a single component of the application
```text
Open the file scripts/delete/delete_application.sh
KUBECONFIG_FOLDER=${PWD}/../kube-configs/application
Then use a single command like:
kubectl delete -f ${KUBECONFIG_FOLDER}/client-services.yaml
```
- If you want to delete all the application services and components in once
```bash
cd ./scripts
./delete/delete_application.sh
```
This will tier down and remove all the containers and services of each component of the application
2. Create new images of your application components and push to your remote private registry
3. If you made any changes at your business network, export the new `.bna` and deploy it through the Composer Playground service (you could probably upgrade the previous version)
4. Create again all the application pods and services
```bash
cd ./scripts
./create/create_applicaton.sh
```

### Run the Composer-Rest-Server
1. Navigate to the `scripts` sub-directory:
```bash
cd ./scripts
```
2. Run the script to create all the app services and pods
```bash
./create/create_composer-rest-server.sh
```
3. Access the Composer-Rest-Server using the Public IP address and the port provided by k8s
4. Test it out

### Clean up the environment
You can easily clean up all the k8s environment anytime using the `delete_all` script
1. Navigate to the `scripts` sub-directory:
```bash
cd ./scripts
```
2. Run the script to create all the app services and pods
```bash
./delete_all.sh
```
or, alternatively, you can delete a specific components using one of the script contained in `cs-offerings/scripts/delete` directory.

### Run a clean environment
1. Follow the steps in the section _Clean up the environment_
2. Recreate the blockchain network
```bash
cd ./scripts
./create_all.sh
```
3. Export the `.bna`
```bash
cd composer/bna
npm run prepublish
```
4. Deploy the `.bna` through the Composer Playground service
5. Create again all the application pods and services
```bash
cd ./scripts
./create/create_applicaton.sh
```

## Koopman-Pon - Multi-org double environment
We are now going to deploy multi-org double environment setup (completely portable), a similar configuration which will be present on production.

### What do I get?
The `create_all` script will bring up the following setup:

`kpm-pon` organization

- 1 Fabric CA - `ca-kpm-pon`
- 1 Orderer (SOLO) - `orderer-kpm-pon` configured at `kpmOrderer` organization - MSP ID `kpmOrdererMSP`
- 1 Peer - `peer0-kpm-pon` - MSP ID `kpm-ponMSP`
- 1 Composer-CLI utility to deploy the chaincode and register the admin user (removed once completed)
- Some other utilities to create and join the channel (removed once completed)
- The application composed by:
  - 1 Client application
  - 1 Server application
  - 1 API server (based on swagger)
  - 1 Private DB
- Persistent volumes are in place for: worldstate and blockchain; private database; participant credentials

`pon` organization
- 1 Fabric CA - `ca-pon`
- 1 Orderer (SOLO) using the same of the `kpm-pon` org - `orderer-kpm-pon` configured at `kpmOrderer` organization - MSP ID `kpmOrdererMSP`
- 1 Peer - `peer0-pon` - MSP ID `ponMSP`
- 1 Composer-CLI utility to install the chaincode and register the admin user (removed once completed)
- Some other utilities to join the channel (removed once completed)
- The application composed by:
  - 1 Client application
  - 1 Server application
  - 1 API server (based on swagger)
  - 1 Private DB
- Persistent volumes are in place for: worldstate and blockchain; private database; participant credentials

### Before starting
1. Be sure you are connected to the right account and cluster. Follow the configuration steps explained above at the section: _Setup a cluster_
2. **Move to the following folder:**
```bash
cd kpm-pon/kpm
```

### Deploy the Koopman environment
1. Navigate to the `scripts` sub-directory:
```bash
cd ./scripts
```
2. Open the `create_all` and verify there are the correct parameters for `CHANNEL_FILE`, `ORDRER_ADDRESS`, etc.
3. Run the script to use couchdb as worldstate db for peers:
```bash
./create_all.sh
```
which will execute the following:
- creating the blockchain network (on persisten volumes)
- creating the channel and joining it
- deploying the chaincode and enrolling the admin user

**Note: the script will wait a fixed amount of time before returning (logged in console). Please wait that time or you risk to compromise all the setup.**

Once the script is completed and you waited the requested time, you start deploying the application:
- Follow the steps at the section: _Deploy your application_

Now your blockchain network and application are up and running and you should be able to see the pods result running:
```bash
kubectl proxy

# On the browser go to 127.0.0.1:8001/ui
```

### Before starting
1. Be sure you are connected to the right account and cluster. Follow the configuration steps explained above at the section: _Setup a cluster_
2. **Move to the following folder:**
```bash
cd kpm-pon/pon
```

### Deploy the Pon environment
Same procedure as for the Koopman environment.

## Useful commands
### Create single service and pod
```bash
KUBECONFIG_FOLDER=${PWD}/../kube-configs/application
```
e.g. client
```bash
kubectl create -f ${KUBECONFIG_FOLDER}/client-services.yaml
kubectl create -f ${KUBECONFIG_FOLDER}/client.yaml --validate=false
```
### Delete single service and pod
e.g. client
```bash
kubectl delete -f ${KUBECONFIG_FOLDER}/client-services.yaml
kubectl delete -f ${KUBECONFIG_FOLDER}/client.yaml
```

## Troubleshooting
### Admin identity
**T:** I get the following errors when I try to connect as admin on Composer Playground
```text
Error: Error trying login and get user Context. Error: Error trying to enroll user. Error: Error: Invalid results returned ::FORBIDDEN

Error: Error trying to ping. Error: Error trying to query business network. Error: Failed to deserialize creator identity, err The supplied identity is not valid, Verify() returned x509: certificate has expired or is not yet valid
```

**S:** You have been too fast and you need to cleanup your environment and restart. Apparently there is a 5 minutes time delay on the certs generated. So if you try using a cert before 5 minutes there is a chance it would be invalid. Apparently this is fixed in fabric v1.0.3.

If you are on a version >= 1.0.3 then the issue could be related to a bad configuration of your CA. Be sure you are starting the CA server with the right credentials.


**T:** Do not manage to build the chaincode, timeout, etc. check the log of your peer. it is possible it is not able to connect to the orderer.
```text
[ConnProducer] NewConnection -&gt; ERRO 15d5 Failed connecting to orderer-kpm-pon:7050 , error: context deadline exceeded
```

**S:** You have to be sure all the peers can reach the orderering service. The address of the orderer is written in the configuration of genesis block, `configtx.yaml` in the section `Orderer`, therefore, if you are connecting two different environments, be sure to use public addresses.

## References
[Develop in a cloud sandbox IBM Blockchain Platform](https://ibm-blockchain.github.io/)

[Bluemix Containers - Registry Getting Started](https://console.bluemix.net/containers-kubernetes/registry/start)