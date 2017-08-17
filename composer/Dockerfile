FROM node:6

# Workdir
RUN mkdir bna
WORKDIR /bna

RUN npm install -g composer-cli@0.10.0 composer-rest-server@0.10.0 passport-github --loglevel error

COPY bna/package.json bna/package-lock.json ./bna/
RUN cd /bna && npm install --loglevel error
RUN npm cache clean
COPY bna /bna

ENTRYPOINT docker-entrypoint.sh

COPY docker-entrypoint.sh /bin/docker-entrypoint.sh
COPY connection.json /root/.composer-connection-profiles/defaultProfile/connection.json

EXPOSE 3000