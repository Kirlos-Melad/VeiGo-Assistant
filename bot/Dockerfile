FROM node:20.11.1

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

CMD npm run migrate && npm run start:watch
