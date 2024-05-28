FROM node:20-alpine
WORKDIR /app
COPY src /src/
COPY public /public/
COPY .env /
COPY *.json /
COPY *.mjs /
COPY next-env.d.ts /
COPY .graphclientrc.yml /
RUN yarn
RUN yarn graph:build && yarn build
EXPOSE 5447
ENTRYPOINT yarn start -p 5447
