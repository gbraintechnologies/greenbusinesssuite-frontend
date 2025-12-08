# Stage 1: Build the Next.js application
FROM node:18-alpine AS builder

# Run as non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if it exists)
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source
COPY --chown=nextjs:nodejs . .

# Copy the rest of the application files
COPY . .

# Build the application for production (static export)
RUN yarn build

# Stage 2: Serve the application with a lightweight server
FROM node:18-alpine AS runner

# Security: Run as non-root
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Set the working directory in the container
WORKDIR /app

# Copy only necessary files
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/yarn.lock ./

# Install only production dependencies
RUN yarn install --production --frozen-lockfile


# Copy only the necessary build artifacts from the builder stage
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/public ./public
# COPY --from=builder --chown=nextjs:nodejs /app/yarn.lock ./

# Switch to non-root user
USER nextjs

# Expose port 3000
EXPOSE 3000

# Start Nginx in the foreground
CMD ["yarn", "start"]