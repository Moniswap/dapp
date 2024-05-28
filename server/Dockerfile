FROM node:20-alpine
WORKDIR /app
COPY src /src/
COPY *.json /
RUN yarn
EXPOSE 7750
EXPOSE 8811
ENTRYPOINT yarn start
