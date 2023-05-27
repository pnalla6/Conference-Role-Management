FROM node:alpine

WORKDIR /crmapp

COPY package.json ./

COPY package-lock.json ./

RUN npm install

COPY ./ ./

CMD [ "npm","start" ]