# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set a build-time argument for the port
ARG PORT=3000

# Set an environment variable from the build argument
ENV PORT=${PORT}

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the backend port
EXPOSE ${PORT}

# Start the backend
CMD ["npm", "start"]