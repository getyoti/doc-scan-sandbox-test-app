# Doc Scan Sandbox test app

Demo app used to demonstrate Doc Scan sandbox testing

## Configuration

Configure using the following environment variables:
- `YOTI_CLIENT_SDK_ID` your sandbox client SDK ID
- `YOTI_KEY_FILE_PATH` path to pem file within container
- `YOTI_DOC_SCAN_API_URL` to point to the sandbox environment
- `YOTI_APP_BASE_URL` the app base URL - defaults to https://localhost:3000

## Docker

To build:
```
docker build . -t yoti-doc-scan-test-app
```

To run:
```
docker run -e YOTI_CLIENT_SDK_ID=YOUR_CLIENT_SDK_ID -e YOTI_KEY_FILE_PATH=/path/in/container/to/privateKey.pem -e YOTI_DOC_SCAN_API_URL=https://api.yoti.com/sandbox/idverify/v1 -p 3000:3000 yoti-doc-scan-test-app
```

## Docker Compose

```yml
version: '3'

services:
  app:
    build: https://github.com/getyoti/doc-scan-sandbox-test-app.git
    environment:
        - YOTI_KEY_FILE_PATH=/usr/src/keys/privateKey.pem
        - YOTI_CLIENT_SDK_ID=YOUR_CLIENT_SDK_ID
        - YOTI_DOC_SCAN_API_URL=https://api.yoti.com/sandbox/idverify/v1
    volumes:
        - /path/to/privateKey.pem:/usr/src/keys/privateKey.pem
    ports:
        - "3000:3000"
```
