FROM node:24.22.3-alpine@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5

# Targeted Alpine security maintenance; no blanket package upgrade.
RUN apk add --no-cache --upgrade zlib=1.4-r0

WORKDIR /app

ENV NODE_ENV=production

COPY --chown=node:node package.json server.js ./

USER node

EXPOSE 3000

CMD ["node", "server.js"]
