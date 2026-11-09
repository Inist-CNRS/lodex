FROM node:24.13-alpine AS build
RUN apk add --no-cache make gcc g++ python3 bash git openssh jq
WORKDIR /app
COPY ./package.json ./package-lock.json /app/
# Only manifests before install, so source changes don't invalidate the npm install layer
# Keep in sync with the packages installed by the root package.json postinstall
COPY ./packages/@recuperateur/async-busboy/package.json /app/packages/@recuperateur/async-busboy/
COPY ./packages/@recuperateur/resumablejs/package.json /app/packages/@recuperateur/resumablejs/
COPY ./packages/admin-app/package*.json /app/packages/admin-app/
COPY ./packages/api/package*.json /app/packages/api/
COPY ./packages/common/package*.json /app/packages/common/
COPY ./packages/ezsLodex/package*.json /app/packages/ezsLodex/
COPY ./packages/frontend-common/package*.json /app/packages/frontend-common/
COPY ./packages/public-app/package*.json /app/packages/public-app/
COPY ./packages/root-admin-app/package*.json /app/packages/root-admin-app/
# transformers builds itself on install (prepublish), it needs its sources
COPY ./packages/transformers /app/packages/transformers/
COPY ./packages/workers/package*.json /app/packages/workers/

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

FROM node:24.13-alpine AS release
RUN apk add --no-cache su-exec redis

# ezmasterizing of lodex
# See https://github.com/Inist-CNRS/ezmaster#ezmasterizing-an-application
# change uid/gid to be compilant with Debian/Ubuntu container (and so with ezmaster-webdav)
RUN echo '{ \
    "httpPort": 3000, \
    "configPath": "/app/config/local-production.json", \
    "configType": "json", \
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
ENV NODE_USE_ENV_PROXY=1
ENV PM2_HOME=/app/.pm2
ENV npm_config_cache=/app/.npm
ENV DEBUG_COLORS="0"
EXPOSE 3000
ENTRYPOINT [ "/app/docker-entrypoint.sh" ]
CMD ["npx", "pm2-runtime", "ecosystem.config.js"]
