FROM node:10

WORKDIR /app

# Copy the local code source
COPY . /app

# Install the node modules only
RUN rm -rf ./node_modules && \
    npm install --production && \
    npm cache clean --force

ARG node_env="production"
ENV NODE_ENV=$node_env

RUN cp -n ./config/production-dist.js ./config/production.js

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
