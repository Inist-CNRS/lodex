FROM node:12

RUN mkdir /app
COPY ./package.json /app
COPY ./package-lock.json /app

WORKDIR /app

RUN npm install --production && \
    npm cache clean --force

COPY ./src /app/src
COPY ./config /app/config
COPY ./config.json ./babel.config.js ./jest.config.js ./jsconfig.json ./typings.json /app/
RUN mkdir /tmp/upload
WORKDIR /app

ARG node_env="production"
ENV NODE_ENV=$node_env

RUN cp -n ./config/production-dist.js ./config/production.js

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
