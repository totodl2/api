FROM node:10.11

ARG VERSION
ENV NODE_ENV production
ENV VERSION=$VERSION
ENV PORT 3000

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

RUN apt-get update && \
    apt-get install -y --force-yes python3-pip && \
    pip3 install guessit locales

COPY --chown=node:node "." "/home/node/server"

USER node
WORKDIR /home/node/server

RUN touch .env && \
    npm i

ENTRYPOINT [ "node", "./run.js" ]

CMD [ "server" ]
