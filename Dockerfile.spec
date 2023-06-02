FROM node:12-alpine

WORKDIR /app
COPY ./package.json /app
COPY ./package-lock.json /app
COPY ./packages /app/packages

RUN npm install
COPY ./src /app/src
COPY ./config /app/config
COPY ./config.json ./babel.config.js ./jest.config.js ./jsconfig.json ./typings.json /app/



ARG node_env="production"
ENV NODE_ENV=$node_env

RUN mkdir /app/upload && \
    cp -n ./config/production-dist.js ./config/production.js && \
    npm run build

EXPOSE 3000
CMD ["npm", "start"]
