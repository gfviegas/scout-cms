FROM node:alpine

RUN apk add --no-cache git make gcc g++ python

WORKDIR /tmp
COPY package.json /tmp/
RUN yarn install --pure-lockfile

WORKDIR /var/www/scout-cms
RUN cp -a /tmp/node_modules /var/www/scout-cms/

EXPOSE 8888
CMD ["yarn", "run", "dev"]
