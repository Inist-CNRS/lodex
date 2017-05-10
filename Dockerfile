FROM node:7.8.0

WORKDIR /app
# Install the node modules only
COPY package.json /app
RUN rm -rf ./node_modules && \
    npm install && \
    npm cache clean

ENV NODE_ENV production

# Copy the local code source
COPY . /app

RUN cp -n ./config/production-dist.js ./config/production.js

# ezmasterizing of lodex
# See https://github.com/Inist-CNRS/ezmaster#ezmasterizing-an-application
RUN echo '{ \
  "httpPort": 3000, \
  "configPath": "/app/config.json", \
  "dataPath": "/app/src/app/custom/" \
  "cleanup": "/app/src/common/mongoCleanup.sh" \
}' > /etc/ezmaster.json

EXPOSE 3000

ENTRYPOINT ["node", "--harmony-async-await", "--require" ,"babel-register"]
CMD ["src/api/index.js"]
