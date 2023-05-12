FROM node:16-alpine

WORKDIR /app

#ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY public ./

COPY --chown=nextjs:nodejs build/.next/standalone ./
COPY --chown=nextjs:nodejs build/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
