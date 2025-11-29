# Backend Dockerfile (Node + Express + Mongoose)

FROM node:18-alpine AS deps
WORKDIR /app
# Install CA certificates for TLS if needed by Mongo drivers
RUN apk add --no-cache ca-certificates

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --production

# Copy source
FROM node:18-alpine AS runner
WORKDIR /app
# Copy installed deps from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Use non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

# Start the server
CMD ["node", "src/server.js"]