FROM node:18-slim

WORKDIR /app

# Install OpenSSL and clean up
RUN apt-get update -y && \
    apt-get install -y openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create directories and set permissions
RUN mkdir .next && \
    chown -R node:node /app && \
    mkdir -p node_modules && \
    chown -R node:node node_modules

# Copy package files with correct ownership
COPY --chown=node:node package*.json ./

# Switch to non-root user
USER node

# Set npm configurations for better network reliability
RUN npm config set registry https://registry.npmjs.org/ \
    && npm config set fetch-retry-maxtimeout 600000 \
    && npm config set fetch-retry-mintimeout 10000 \
    && npm config set fetch-retries 5

# Install dependencies with increased network timeout
RUN npm install --network-timeout=600000 --legacy-peer-deps

# Copy prisma files with correct ownership
COPY --chown=node:node prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the application with correct ownership
COPY --chown=node:node . .

EXPOSE 3000

CMD ["npm", "run", "dev"]