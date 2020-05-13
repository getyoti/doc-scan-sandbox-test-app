FROM node:12-alpine

WORKDIR /usr/src/app

COPY . .

RUN apk --no-cache add openssl

RUN openssl req \
    -x509 \
    -nodes \
    -days 365 \
    -newkey rsa:2048 \
    -keyout /etc/ssl/server.key \
    -out /etc/ssl/server.crt \
    -subj "/C=UK/ST=London/L=London/O=Yoti/OU=Yoti/CN=localhost"

RUN npm install

EXPOSE 3000
CMD [ "npm", "start" ]
