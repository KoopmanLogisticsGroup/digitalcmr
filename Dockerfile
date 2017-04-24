FROM node:6
RUN apt update && apt install -qq netcat nano && rm -rf /var/lib/apt/lists/*
RUN npm install -g composer-cli composer-rest-server --loglevel error

COPY config/hlfv1/package.json /hlfv1/package.json
RUN cd /hlfv1 && npm install --loglevel error

COPY config/hlfv1 /hlfv1
COPY config/docker-entrypoint.sh /bin/docker-entrypoint.sh
COPY config/connection.json /root/.composer-connection-profiles/defaultProfile/connection.json

RUN mkdir bna
WORKDIR /bna

EXPOSE 3000

ENTRYPOINT docker-entrypoint.sh