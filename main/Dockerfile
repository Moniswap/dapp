FROM node:20-alpine
WORKDIR /dapp
COPY src /src/
COPY public /public/
COPY .env /
COPY *.json /
COPY *.mjs /
COPY .graphclientrc.yml /
RUN yarn
RUN yarn graph:build && yarn build
EXPOSE 5447
ENTRYPOINT yarn start -p 5447
