FROM node:lts-alpine
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
#RUN mkdir -p /app/.next && chown -R nextjs:nodejs /app

COPY --chown=nextjs:nodejs next.config.mjs .
COPY --chown=nextjs:nodejs public ./public
COPY --chown=nextjs:nodejs package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --chown=nextjs:nodejs ./.next/standalone ./
COPY --chown=nextjs:nodejs ./.next/static ./.next/static
RUN sed -i 's/"compress":false/"compress":true/g' ./server.js

USER nextjs


EXPOSE 3000

ENV PORT 3000
ENV NEXT_TELEMETRY_DISABLED 1

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

CMD ["node", "server.js"]
