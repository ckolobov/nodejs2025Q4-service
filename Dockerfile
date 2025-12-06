# Development stage
FROM node:24-alpine AS development

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci --legacy-peer-deps

# Copy the rest of the application files
COPY . .

# Expose port
EXPOSE 4000

# Set Node environment to development
ENV NODE_ENV=development

# Start the application in watch mode
CMD ["npm", "run", "start:dev"]

# Production stage
FROM node:24-alpine AS production

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps --only=production

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 4000

# Set Node environment to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/main"]
