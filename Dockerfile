FROM node:14-alpine AS build
RUN apk add --no-cache make gcc g++ python3 bash git openssh jq
WORKDIR /app
COPY ./package.json /app
COPY ./package-lock.json /app
COPY ./packages /app/packages

RUN npm install
# see .dockerignore to know all copied files
COPY . /app/

ENV NODE_ENV="production"

RUN mkdir /app/upload && \
    cp -n ./config/production-dist.js ./config/production.js && \
    npm run build && \
    npm cache clean --force  && \
    npm prune --production && \
    npm run clean

FROM node:14-alpine AS release
RUN apk add --no-cache su-exec redis
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
    sed -i -e "s/bin:x:1:/bin:x:2:/" /etc/group && \
    chown -R daemon:daemon /app


WORKDIR /app
ENV NODE_ENV="production"
EXPOSE 3000
ENTRYPOINT [ "/app/docker-entrypoint.sh" ]
CMD ["npm", "start"]
