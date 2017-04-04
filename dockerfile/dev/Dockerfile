FROM node:7.8.0

RUN npm install pm2 -g

WORKDIR /app

EXPOSE 3000

CMD ["pm2-docker", "process.yml"]
