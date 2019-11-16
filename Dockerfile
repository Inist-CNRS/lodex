FROM node:10-alpine AS build
RUN apk add --no-cache make gcc g++ python
RUN mkdir /app
COPY package.json /app
WORKDIR /app
RUN npm install --production && npm cache clean --force

FROM node:10-alpine AS release
COPY --from=build /app /app
COPY ./src /app/src
COPY ./config /app/config
COPY ./config.json ./babel.config.js jest.config.js jsconfig.json typings.json /app/
RUN mkdir /app/upload
WORKDIR /app

ENV NODE_ENV="production"

RUN cp ./config/production-dist.js ./config/production.js

# ezmasterizing of lodex
# See https://github.com/Inist-CNRS/ezmaster#ezmasterizing-an-application
# cleanupScript disabled because of this commit https://github.com/Inist-CNRS/lodex/commit/4e7c542a8745f97fb21004c96489a21c5bea32a4
RUN echo '{ \
  "httpPort": 3000, \
  "configPath": "/app/config.json", \
  "dataPath": "/app/src/app/custom", \
  "#cleanupScript": "/app/src/common/mongoCleanup.sh" \
}' > /etc/ezmaster.json

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
