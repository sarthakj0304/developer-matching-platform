# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.19.0
FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the source files
COPY . .

# Run as non-root user
USER node

EXPOSE 5001

CMD ["node", "index.js"]
