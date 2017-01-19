FROM node:7.4

RUN npm install pm2 -g

WORKDIR /app

EXPOSE 3000

CMD ["pm2-docker", "process.yml"]
