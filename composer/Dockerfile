FROM node:6

# Workdir
RUN mkdir bna
WORKDIR /bna

EXPOSE 3000
ENTRYPOINT docker-entrypoint.sh

RUN npm install -g composer-cli@0.10.0 composer-rest-server@0.10.0 --loglevel error

COPY bna/package.json /bna/package.json
RUN cd /bna && npm install --loglevel error
RUN npm cache clean
COPY bna /bna

COPY docker-entrypoint.sh /bin/docker-entrypoint.sh
COPY connection.json /root/.composer-connection-profiles/defaultProfile/connection.json
