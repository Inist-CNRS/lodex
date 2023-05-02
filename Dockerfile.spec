FROM node:12-alpine

RUN mkdir /app
COPY ./package.json /app
COPY ./package-lock.json /app
COPY ./packages /app/packages
WORKDIR /app

RUN npm install

COPY ./src /app/src
COPY ./config /app/config
COPY ./config.json ./babel.config.js ./jest.config.js ./jsconfig.json ./typings.json /app/
RUN mkdir /app/upload
WORKDIR /app

ARG node_env="production"
ENV NODE_ENV=$node_env

RUN cp -n ./config/production-dist.js ./config/production.js \
    && npm run build

EXPOSE 3000
CMD ["npm", "start"]
