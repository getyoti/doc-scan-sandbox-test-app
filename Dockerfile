FROM node:12-alpine

WORKDIR /usr/src/app

COPY ./ssl/openssl.cnf /etc/ssl/openssl.localhost.cnf
COPY . .

RUN apk --no-cache add openssl

RUN openssl req \
    -config /etc/ssl/openssl.localhost.cnf \
    -x509 \
    -nodes \
    -days 365 \
    -sha256 \
    -newkey rsa:2048 \
    -keyout /etc/ssl/server.key \
    -out /etc/ssl/server.crt

RUN npm install

EXPOSE 3000
CMD [ "npm", "start" ]
