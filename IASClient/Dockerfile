FROM node:12.16.1-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ENTRYPOINT ["npm", "start" ]
