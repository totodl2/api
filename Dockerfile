FROM node:10.11

ENV NODE_ENV production
ENV PORT 3000

COPY --chown=node:node "." "/home/node/server"

USER node
WORKDIR /home/node/server

RUN touch .env && \
    npm i

ENTRYPOINT [ "node", "./run.js" ]

CMD [ "server" ]
