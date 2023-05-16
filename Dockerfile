FROM node:16-alpine

WORKDIR /app

#ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN apk add --no-cache dumb-init bash gawk

COPY public env.sh ./

RUN install -o node -g node -m 644 /dev/null public/__env.js

COPY --chown=node:node build/.next/standalone ./
COPY --chown=node:node build/.next/static ./.next/static

USER node

EXPOSE 3000

ENV PORT 3000

ENTRYPOINT ["./env.sh", "/usr/bin/dumb-init", "--"]
CMD ["node", "server.js"]
