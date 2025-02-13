# Use an official Node.js runtime to build the React app
FROM node:20-alpine as build

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the app
COPY . .

ARG REACT_APP_API_BASE

# Build the React app
RUN REACT_APP_API_BASE=${REACT_APP_API_BASE} npm run build

# Use an Nginx image to serve the React app
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose port 80 for the React app
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]