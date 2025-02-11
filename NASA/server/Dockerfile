# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the backend port
EXPOSE 3000

# Start the backend
CMD ["npm", "start"]