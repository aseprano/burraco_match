FROM node:10.15-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN apk add curl
RUN npm install
COPY . .
RUN npm run build

EXPOSE 80
ENTRYPOINT ["sh", "start.sh"]
