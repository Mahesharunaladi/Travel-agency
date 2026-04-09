# Multi-stage Dockerfile for Next.js Frontend

# Stage 1: Dependencies
FROM node:18-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy source
COPY . .

# Build arguments for environment
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_PAYMENT_KEY
ARG NEXT_PUBLIC_APP_NAME=Airline Booking System

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_PAYMENT_KEY=${NEXT_PUBLIC_PAYMENT_KEY}
ENV NEXT_PUBLIC_APP_NAME=${NEXT_PUBLIC_APP_NAME}

# Build Next.js app
RUN npm run build

# Stage 3: Runtime - Production optimized
FROM node:18-alpine AS runtime
WORKDIR /app

# Install dumb-init
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copy built application and dependencies
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public

# Set permissions
RUN chown -R nodejs:nodejs /app

USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

EXPOSE 3000

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
