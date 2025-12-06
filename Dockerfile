FROM node:24-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Expose port (adjust if needed)
EXPOSE 4000

# Set Node environment to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/main"]
