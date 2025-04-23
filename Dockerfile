# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other files
COPY . .

# Expose default port (optional - kama unatumia Express)
EXPOSE 3000

# Start the bot
CMD ["node", "index.js"]
