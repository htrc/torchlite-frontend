FROM node:18-alpine

WORKDIR /app

#ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN apk add --no-cache dumb-init bash gawk

COPY public ./public
COPY env.sh ./
COPY --chown=node:node build/.next/standalone ./
COPY --chown=node:node build/.next/static ./.next/static

RUN install -o node -g node -m 644 /dev/null public/__appenv.js

USER node

EXPOSE 3000

ENV PORT 3000

ENTRYPOINT ["./env.sh", "/usr/bin/dumb-init", "--"]
CMD ["node", "server.js"]
