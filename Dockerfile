# Stage 1: Build the Next.js application
FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if it exists)
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application files
COPY . .

# Build the application for production (static export)
RUN yarn build

# Stage 2: Serve the application with a lightweight server
FROM node:18-alpine AS runner

# Set the working directory in the container
WORKDIR /app

# Copy only the necessary build artifacts from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Expose port 3000
EXPOSE 3000

# Start Nginx in the foreground
CMD ["yarn", "start"]