FROM node:22.16.0-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
COPY .env.production .env

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
