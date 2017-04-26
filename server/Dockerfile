FROM node:6.10.2

# Workdir
RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app

# Grunt
RUN npm install -g grunt --loglevel error

# Make sure to build with --build-arg NPM_TOKEN="${NPM_TOKEN)"
ARG NPM_TOKEN
COPY .npmrc /root/.npmrc
COPY package.json package.json
RUN npm install --loglevel error
RUN npm cache clean
RUN rm -f /root/.npmrc

COPY . .
RUN grunt build