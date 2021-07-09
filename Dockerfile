FROM node:12-alpine AS build
RUN apk add --no-cache make gcc g++ python bash git openssh jq
WORKDIR /app
# see .dockerignore to know all copied files
COPY . /app/
ENV NODE_ENV="production"
RUN cp /app/config/production-dist.js /app/config/production.js && \
    npm install --production && \
    npm run build && \
    npm cache clean --force  && \
    npm prune --production && \
    npm run clean && \
    ./lodex-extended-sync

FROM node:12-alpine AS release
RUN apk add --no-cache su-exec
COPY --from=build /app /app

# ezmasterizing of lodex
# See https://github.com/Inist-CNRS/ezmaster#ezmasterizing-an-application
# cleanupScript disabled because of this commit https://github.com/Inist-CNRS/lodex/commit/4e7c542a8745f97fb21004c96489a21c5bea32a4
# change uid/gid to be compilant with Debian/Ubuntu container (and so with ezmaster-webdav)
RUN echo '{ \
    "httpPort": 3000, \
    "configPath": "/app/config.json", \
    "dataPath": "/app/src/app/custom", \
    "#cleanupScript": "/app/src/common/mongoCleanup.sh" \
    }' > /etc/ezmaster.json  && \
    sed -i -e "s/daemon:x:2:2/daemon:x:1:1/" /etc/passwd && \
    sed -i -e "s/daemon:x:2:/daemon:x:1:/" /etc/group && \
    sed -i -e "s/bin:x:1:1/bin:x:2:2/" /etc/passwd && \
    sed -i -e "s/bin:x:1:/bin:x:2:/" /etc/group

WORKDIR /app
ENV NODE_ENV="production"
EXPOSE 3000
ENTRYPOINT [ "/app/docker-entrypoint.sh" ]
CMD [ "npm", "start" ]
