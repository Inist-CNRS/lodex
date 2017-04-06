FROM node:7.8.0

ARG http_proxy
ARG https_proxy
ARG no_proxy

RUN npm install pm2 -g

WORKDIR /app

EXPOSE 3000

CMD ["pm2-docker", "process.yml"]
