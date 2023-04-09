FROM node:alpine

WORKDIR /app

COPY package.json .

RUN npm install\
        && npm install typescript -g

COPY . .

RUN npm run build

EXPOSE 5555

CMD ["npm","start"]