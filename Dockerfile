FROM public.ecr.aws/i4n1u1e7/ent_core_node:18.19.1-alpine AS base 

RUN apk add --no-cache libc6-compat
# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package.json ./

# Install the dependencies
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm install sharp

ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}

ENV NEXT_PUBLIC_APP_ID=1
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Copy the entire application code to the container
COPY . .

# Build the Next.js application
RUN NEXT_PUBLIC_BACKEND_URL=NEXT_PUBLIC_BACKEND_URL NEXT_PUBLIC_APP_ID=NEXT_PUBLIC_APP_ID npm run build

# # Expose the port that the application will run on
EXPOSE 3000

RUN ["chmod", "+x", "./entrypoint.sh"]
ENTRYPOINT ["./entrypoint.sh"]

# # Define the command to start the application
CMD ["npm", "start"]