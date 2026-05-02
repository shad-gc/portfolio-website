# pin node to a digest, not a tag. tags move. digests don't.
# bump the digest deliberately when you want a new node patch.
FROM node:20-alpine@sha256:afdf98210b07b586eb71fa22ba2e432e058e4cd1304d31ed60888755b8c865fb AS deps

WORKDIR /app

# copy package files first so this layer caches across rebuilds.
COPY package*.json ./

# npm ci, not npm install. fail loud if lockfile is out of sync.
# --omit=dev keeps the image lean.
RUN npm ci --omit=dev

# ── runtime image ─────────────────────────────────────────────
FROM node:20-alpine@sha256:afdf98210b07b586eb71fa22ba2e432e058e4cd1304d31ed60888755b8c865fb

WORKDIR /app

# non-root user. set this up before the COPYs so --chown works.
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# copy node_modules from the deps stage, owned by the runtime user.
COPY --from=deps --chown=appuser:appgroup /app/node_modules ./node_modules

# copy the rest of the app, also owned by the runtime user.
COPY --chown=appuser:appgroup . .

# documentation only. cloud run injects PORT and we read it from env.
EXPOSE 8080

USER appuser

CMD ["node", "server.js"]
