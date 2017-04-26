FROM node:6.10.2

# Workdir
RUN mkdir bna
WORKDIR /bna

EXPOSE 3000
ENTRYPOINT docker-entrypoint.sh

RUN npm install -g composer-cli composer-rest-server --loglevel error

COPY hlfv1/package.json /hlfv1/package.json
RUN cd /hlfv1 && npm install --loglevel error
RUN npm cache clean

COPY hlfv1 /hlfv1
COPY docker-entrypoint.sh /bin/docker-entrypoint.sh
COPY connection.json /root/.composer-connection-profiles/defaultProfile/connection.json
