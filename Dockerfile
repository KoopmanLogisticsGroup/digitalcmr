FROM node:6
RUN apt update && apt install -qq netcat nano && rm -rf /var/lib/apt/lists/*
RUN npm install -g composer-cli --loglevel error

COPY config/hlfv1/package.json /hlfv1/package.json
RUN cd /hlfv1 && npm install --loglevel error

COPY config/hlfv1 /hlfv1
COPY config/start.sh /bin/start
COPY config/connection.json /root/.composer-connection-profiles/defaultProfile/connection.json

RUN mkdir bna
WORKDIR /bna

CMD start