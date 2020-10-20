FROM node:12-alpine AS build
RUN apk add --no-cache make gcc g++ python bash git openssh
RUN mkdir /app
COPY package.json /app
WORKDIR /app
RUN npm install --production && npm cache clean --force

FROM node:12-alpine AS release
RUN apk add --no-cache su-exec
COPY --from=build /app /app
COPY . /app/
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
# To be compilant with Debian/Ubuntu container (and so with ezmaster-webdav)
RUN sed -i -e "s/daemon:x:2:2/daemon:x:1:1/" /etc/passwd && \
    sed -i -e "s/daemon:x:2:/daemon:x:1:/" /etc/group && \
    sed -i -e "s/bin:x:1:1/bin:x:2:2/" /etc/passwd && \
    sed -i -e "s/bin:x:1:/bin:x:2:/" /etc/group
RUN mkdir -p /sbin/.npm /sbin/.config
RUN chown -R daemon:daemon /app /sbin/.npm /sbin/.config
ENTRYPOINT [ "/app/docker-entrypoint.sh" ]
CMD [ "npm", "start" ]
