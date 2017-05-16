FROM node:alpine
RUN mkdir -p /var/www/scout-cms
RUN apk add --no-cache git make gcc g++ python
COPY package.json /var/www/scout-cms
WORKDIR /var/www/scout-cms
RUN npm i --silent --no-progress
COPY . /var/www/scout-cms
EXPOSE 8888
CMD ["npm", "run", "dev"]
