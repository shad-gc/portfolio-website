# ── Stage 1: Install dependencies ────────────────────────────
# Use a lightweight Node.js image as the base.
# "alpine" variants are small (~50MB) — ideal for Cloud Run cold starts.
FROM node:20-alpine AS deps

WORKDIR /app

# Copy only package files first so Docker can cache this layer.
# If you don't change package.json, this layer is reused on rebuilds.
COPY package*.json ./
RUN npm install --omit=dev

# ── Stage 2: Final image ──────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Copy installed node_modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the application source
COPY . .

# Cloud Run injects PORT at runtime — we expose 8080 as the default.
# This is documentation only; the actual port is controlled by server.js.
EXPOSE 8080

# Run as a non-root user for security best practices
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Start the server
CMD ["node", "server.js"]
