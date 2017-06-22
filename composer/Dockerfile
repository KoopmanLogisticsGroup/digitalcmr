FROM node:6.10.2

# Workdir
RUN mkdir bna
WORKDIR /bna

EXPOSE 3000
ENTRYPOINT docker-entrypoint.sh

RUN npm install -g composer-cli@latest composer-rest-server@latest --loglevel error

COPY bna/package.json /bna/package.json
RUN cd /bna && npm install --loglevel error
RUN npm cache clean
COPY bna /bna

COPY docker-entrypoint.sh /bin/docker-entrypoint.sh
COPY connection.json /root/.composer-connection-profiles/defaultProfile/connection.json
