FROM node:14.16 as build-stage

ENV NODE_ENV development

COPY --chown=node:node "." "/home/node/server"

USER node
WORKDIR /home/node/server
RUN npm i && npm run build

FROM node:14.16 as final-stage

ENV NODE_ENV production
ENV PORT 3000

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

RUN apt-get update && \
    apt-get install -y --force-yes python3-pip && \
    pip3 install guessit locales

ARG VERSION
ENV VERSION=$VERSION

RUN mkdir -p "/home/node/server" && chown -R node. "/home/node/server"
USER node
WORKDIR /home/node/server

COPY --chown=node:node --from=build-stage "/home/node/server/dist" "./dist"
COPY --chown=node:node --from=build-stage "/home/node/server/package*" "./"

RUN touch .env && npm i --only=prod

ENTRYPOINT [ "node", "./dist/run.js" ]

CMD [ "server" ]
