FROM node:14.15.3-alpine3.12

WORKDIR /usr/src/app

RUN apk add curl
COPY . .
RUN npm install
RUN npm run build
EXPOSE 80
ENTRYPOINT ["sh", "start.sh"]
