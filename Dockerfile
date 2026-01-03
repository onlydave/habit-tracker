# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build the app
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files and install production dependencies for the server
COPY package*.json ./
RUN npm install --omit=dev

# Copy built frontend assets
COPY --from=build /app/dist ./dist

# Copy server code
COPY server ./server

# Create data directory
RUN mkdir -p /app/data

ENV NODE_ENV=production
ENV PORT=80

EXPOSE 80

CMD ["node", "server/index.js"]
