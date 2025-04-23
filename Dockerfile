# Use a Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Expose the port (if needed, modify according to your needs)
EXPOSE 3000

# Start the bot with the "start" script defined in package.json
CMD ["npm", "start"]
