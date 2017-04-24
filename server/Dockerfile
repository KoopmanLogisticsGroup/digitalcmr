FROM node:6
RUN npm install -g grunt --loglevel error
RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app

# Make sure to build with --build-arg NPM_TOKEN="${NPM_TOKEN)"
# (or, if you use docker-compose,
ARG NPM_TOKEN
COPY .npmrc /root/.npmrc
COPY package.json package.json
RUN npm install --loglevel error
RUN rm -f /root/.npmrc

COPY . .
RUN grunt build