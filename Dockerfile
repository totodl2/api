FROM node:10.11 as build-stage

ARG VERSION
ENV NODE_ENV development
ENV VERSION=$VERSION
ENV PORT 3000

COPY --chown=node:node "." "/home/node/server"

USER node
WORKDIR /home/node/server
RUN npm i && npm run build && ls -lah

FROM node:10.11 as prod-stage

ARG VERSION
ENV NODE_ENV production
ENV VERSION=$VERSION
ENV PORT 3000

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

RUN apt-get update && \
    apt-get install -y --force-yes python3-pip && \
    pip3 install guessit locales

RUN mkdir -p "/home/node/server" && chown -R node. "/home/node/server"
USER node
WORKDIR /home/node/server

COPY --chown=node:node --from=build-stage "/home/node/server/dist" "./dist"
COPY --chown=node:node --from=build-stage "/home/node/server/package*" "./"

RUN ls -lah && touch .env && npm i

ENTRYPOINT [ "node", "./dist/run.js" ]

CMD [ "server" ]
