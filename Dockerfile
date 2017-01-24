FROM node:7.4

WORKDIR /app
# Install the node modules only
COPY package.json /app
RUN rm -rf ./node_modules && \
    npm install --production && \
    npm cache clean
# Copy the local code source
COPY . /app

# ezmasterizing of lodex
# See https://github.com/Inist-CNRS/ezmaster#ezmasterizing-an-application
RUN echo '{ \
  "httpPort": 3000, \
  "configPath": "/app/config/production.js", \
}' > /etc/ezmaster.json

EXPOSE 3000
