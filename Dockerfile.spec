FROM node:12-alpine

WORKDIR /app
COPY ./package.json /app
COPY ./package-lock.json /app
COPY ./packages /app/packages

RUN npm install
# see .dockerignore to know all copied files
COPY . /app/

ARG node_env="production"
ENV NODE_ENV=$node_env

RUN mkdir /app/upload && \
    cp -n ./config/production-dist.js ./config/production.js && \
    npm run build

EXPOSE 3000
CMD ["npm", "run", "production:api"]

