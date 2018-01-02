# Bluemix deployment guidelines
Note that the current configuration is valid for:
- Hyperledger Fabric v1.0.x
- Hyperledger Composer v0.13.x

## Create a Kubernetes cluster
This guide will allow you to set up a k8s (kubernetes) cluster on Bluemix.
The following steps are based on: [Develop in a cloud sandbox IBM Blockchain Platform](https://ibm-blockchain.github.io/).

### Why do I get?
The Simple Install will bring up the following components:
- A pre-configured Fabric (blockchain runtime):
  - 3 Fabric CAs (one apiece for the orderer org and two peer orgs)
  - Orderer node (running "solo")
  - 2 Fabric peer nodes (one apiece for each peer org - org1 & org2)
- Composer Playground (UI for creating and deploying Business Networks to Fabric)
- The basic-sample-network deployed

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
Plug-in repo named ‘bluemix’ already exists. Try a different name.
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
- Configure kubectl to use the cluster
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

You have successfully created the blockchain cluster on IBM Container Service. Next, you will deploy the Developer Environment.

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

## Deploy the blockchain network
1. Navigate to the `scripts` sub-directory:
```bash
cd cs-offerings/free/scripts
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

**Note: Creating the blockchain network will make some changes in your configuration files. Revert all these changes to be sure the deployment will work again.**

## Deploy the application 
### Create the Docker images for the application
1. Build the images for `client`, `server` and `private-db`
```bash
docker-compose -f app-only.yml build
```
2. Build the image for the swagger API
```bash
cd api_doc
docker build -t digitalcmr_api_doc .
```
### Tag and push the images to Bluemix
1. First set up a private Docker registry on your current organization if you do not have yet.
[Bluemix Containers - Registry Getting Started](https://console.bluemix.net/containers-kubernetes/home/registryGettingStarted)
2. Tag your images as follows
```bash
docker tag digitalcmr_client registry.eu-gb.bluemix.net/YOUR_SPACE_REGISTRY/digitalcmr_client
docker tag digitalcmr_server registry.eu-gb.bluemix.net/YOUR_SPACE_REGISTRY/digitalcmr_server
docker tag digitalcmr_api_doc registry.eu-gb.bluemix.net/YOUR_SPACE_REGISTRY/digitalcmr_api_doc
```
**Your Bluemix space has a specific limit of images/GBs, therefore we can avoid to push the private-db image and instead using the one from the official docker hub registry**
3. Push all the images to your Bluemix private registry
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
4. Wait until the operation is completed. Then your business network (chaincode container) is up and running

**Note: Wait at least 5 min to be sure the admin user has been succesfully enrolled, otherwise you risk to comproise its certificate.**

Now you can run your application.

### Create the k8s pods for the app
**Note: Before spinning up the application, be sure you have the following:**
- Your server holds the correct addresses of the blockchain network under `server/resources/connectionProfiles/production`
- Your client holds the correct address to your remote server in `client/src/environments/environment.prod.ts`
1. Navigate to the `scripts` sub-directory:
```bash
cd cs-offerings/free/scripts
```
2. Run the script to create all the app services and pods
```bash
./create/create_application.sh
```

## Deploy a new version of the application
**Note: If you want to replace user identities and testData previously added to the system, then follow the section below _Run a clean environemnt_.**

Instead, if you do not want to delete your previous blockchain network together with the ledger of all the transactions, then you could follow the steps below:
1. Delete the application pods and services
```bash
cd cs-offerings/free/scripts
./delete/delete_application.sh
```
2. Create new images of your application components and push to your remote private registry
3. If you made any changes at your business network, export the new `.bna` and deploy it through the Composer Playground service (you could probably upgrade the previous version)
4. Create again all the application pods and services
```bash
cd cs-offerings/free/scripts
./create/create_applicaton.sh
```

## Run the Composer-Rest-Server
1. Navigate to the `scripts` sub-directory:
```bash
cd cs-offerings/free/scripts/
```
2. Run the script to create all the app services and pods
```bash
./create/create_composer-rest-server.sh
```
3. Access the Composer-Rest-Server using the Public IP address and the port provided by k8s
4. Test it out

## Clean up the environment
You can easily clean up all the k8s environment anytime using the `delete_all` script
1. Navigate to the `scripts` sub-directory:
```bash
cd cs-offerings/free/scripts
```
2. Run the script to create all the app services and pods
```bash
./delete_all.sh
```
or, alternatively, you can delete a specific components using one of the script contained in `cs-offerings/scripts/delete` directory.

## Run a clean environment
1. Follow the steps in the section _Clean up the environment_
2. Recreate the blockchain network
```bash
cd cs-offerings/free/scripts
./create_all.sh --with-couchdb
```
3. Export the `.bna`
```bash
cd composer/bna
npm run prepublish
```
4. Deploy the `.bna` through the Composer Playground service
5. Create again all the application pods and services
```bash
cd cs-offerings/free/scripts
./create/create_applicaton.sh
```

## Troubleshooting
### Admin identity
**T:** I get the following errors when I try to connect as admin on Composer Playground
```text
Error: Error trying login and get user Context. Error: Error trying to enroll user. Error: Error: Invalid results returned ::FORBIDDEN

Error: Error trying to ping. Error: Error trying to query business network. Error: Failed to deserialize creator identity, err The supplied identity is not valid, Verify() returned x509: certificate has expired or is not yet valid
```

**S:** You have been too fast and you need to cleanup your environment and restart. Apparently there is a 5 minutes time delay on the certs generated. So if you try using a cert before 5 minutes there is a chance it would be invalid. Apparently this is fixed in fabric v1.0.3.

## References
[Develop in a cloud sandbox IBM Blockchain Platform](https://ibm-blockchain.github.io/)

[Bluemix Containers - Registry Getting Started](https://console.bluemix.net/containers-kubernetes/home/registryGettingStarted)