FROM nginx:latest
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the React app
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]