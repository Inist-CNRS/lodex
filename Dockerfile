FROM node:22.12-alpine AS build
RUN apk add --no-cache make gcc g++ python3 bash git openssh jq
WORKDIR /app
COPY ./package.json /app
COPY ./package-lock.json /app
COPY ./packages /app/packages

RUN npm install --legacy-peer-deps
# see .dockerignore to know all copied files
COPY . /app/

ENV NODE_ENV="production"
ENV CYPRESS_CACHE_FOLDER=/app/.cache
ENV npm_config_cache=/app/.npm

RUN npm run build && \
    npm cache clean --force  && \
    npm run clean  && \
    npm prune --production --legacy-peer-deps

FROM node:22.12-alpine AS release
RUN apk add --no-cache su-exec redis

# ezmasterizing of lodex
# See https://github.com/Inist-CNRS/ezmaster#ezmasterizing-an-application
# change uid/gid to be compilant with Debian/Ubuntu container (and so with ezmaster-webdav)
RUN echo '{ \
    "httpPort": 3000, \
    "configPath": "/app/config.json", \
    "dataPath": "/app/src/app/custom" \
    }' > /etc/ezmaster.json  && \
    sed -i -e "s/daemon:x:2:2/daemon:x:1:1/" /etc/passwd && \
    sed -i -e "s/daemon:x:2:/daemon:x:1:/" /etc/group && \
    sed -i -e "s/bin:x:1:1/bin:x:2:2/" /etc/passwd && \
    sed -i -e "s/bin:x:1:/bin:x:2:/" /etc/group

COPY --chown=daemon:daemon --from=build /app /app
COPY --chown=daemon:daemon ./config/production-dist.js /app/config/production.js
WORKDIR /app
ENV NODE_ENV="production"
ENV PM2_HOME=/app/.pm2
ENV npm_config_cache=/app/.npm
ENV DEBUG="ezs:*,-ezs:debug,-ezs:trace"
ENV DEBUG_COLORS="0"
EXPOSE 3000
ENTRYPOINT [ "/app/docker-entrypoint.sh" ]
CMD ["npx", "pm2-runtime", "ecosystem.config.js"]
