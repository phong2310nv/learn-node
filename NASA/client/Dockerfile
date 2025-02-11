# Use an official Node.js runtime to build the React app
FROM node:20-alpine as build

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the React app
RUN npm run build

# Use an Nginx image to serve the React app
FROM nginx:stable-alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose port 80 for the React app
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]