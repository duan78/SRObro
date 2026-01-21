# Dockerfile for SRObro Server
# Multi-stage build for optimal image size
# Build from project root to access shared folder

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy shared package files and source
COPY shared/package*.json ./shared/
COPY shared/tsconfig.json ./shared/
COPY shared/src ./shared/src
COPY tsconfig.json ./tsconfig.json

# Build shared
WORKDIR /app/shared
RUN npm install && npm run build

# Copy server package files
WORKDIR /app
COPY server/package*.json ./server/
COPY server/prisma ./server/prisma/
COPY server/src ./server/src
COPY server/tsconfig.json ./server/
COPY server/core ./server/core
COPY server/data ./server/data
COPY server/game ./server/game
COPY server/network ./server/network

# Install server dependencies
WORKDIR /app/server
# Install shared first
RUN cd /app && npm install ./shared
RUN mkdir -p /app/server/node_modules/@srobro && cp -r /app/node_modules/@srobro /app/server/node_modules/
RUN npm install --legacy-peer-deps

# Generate Prisma Client
RUN rm -rf node_modules/.prisma node_modules/@prisma/client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Install runtime dependencies only
RUN apk add --no-cache openssl

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/server/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/server/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/server/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /app/server/prisma ./prisma

# Copy shared dist
COPY --from=builder --chown=nodejs:nodejs /app/shared/dist ./shared/dist
COPY --from=builder --chown=nodejs:nodejs /app/shared/package*.json ./shared/

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "dist/index.js"]
