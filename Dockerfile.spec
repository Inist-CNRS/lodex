FROM node:12-alpine AS build
RUN apk add --no-cache make gcc g++ python3 bash git openssh jq
WORKDIR /app
# see .dockerignore to know all copied files
COPY . /app/
ENV NODE_ENV="production"
RUN mkdir /app/upload && \
    cp /app/config/production-dist.js /app/config/production.js && \
    npm install --production && \
    npm run build && \
    npm cache clean --force  && \
    npm prune --production && \
    npm run clean && \
    ./lodex-extended-sync

FROM node:12-alpine AS release
COPY --from=build /app /app

# no ezmasterizion

WORKDIR /app
ENV NODE_ENV="production"
EXPOSE 3000
CMD ["npm", "start"]
