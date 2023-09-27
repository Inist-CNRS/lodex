FROM node:16.20-alpine

WORKDIR /app
COPY ./package.json /app
COPY ./package-lock.json /app
COPY ./packages /app/packages

RUN npm install
# see .dockerignore to know all copied files
COPY . /app/

ARG node_env="production"
ENV NODE_ENV=$node_env
ENV CYPRESS_CACHE_FOLDER=/app/.cache
ENV npm_config_cache=/app/.npm

RUN mkdir /app/upload && \
    cp -n ./config/production-dist.js ./config/production.js && \
    npm run build

EXPOSE 3000
CMD ["npm", "run", "production:api"]

