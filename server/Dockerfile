FROM node:6.11.2

# Workdir
RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app

COPY package.json package.json
RUN npm install --loglevel error
RUN npm cache clean

COPY . .

COPY resources/connectionProfiles /root/.composer-connection-profiles
