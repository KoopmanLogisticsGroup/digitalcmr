FROM node:6

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g @angular/cli@latest --loglevel error

# use cached layer for node modules
COPY package.json package-lock.json /usr/src/app/
RUN cd /usr/src/app/ && npm install --loglevel error
RUN npm cache clear

ADD . /usr/src/app

EXPOSE 4200
EXPOSE 49153
