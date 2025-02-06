FROM node:22.12-alpine

WORKDIR /app
COPY ./package.json /app
COPY ./package-lock.json /app
COPY ./packages /app/packages

RUN npm install --legacy-peer-deps
# see .dockerignore to know all copied files
COPY . /app/

ARG node_env="production"
ENV NODE_ENV=$node_env
ENV CYPRESS_CACHE_FOLDER=/app/.cache
ENV npm_config_cache=/app/.npm

COPY ./config/production-dist.js ./config/production.js
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "production:api"]
