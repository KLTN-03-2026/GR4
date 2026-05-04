FROM nginx:stable-alpine

# Copy the custom Nginx configuration
COPY default.conf /etc/nginx/conf.d/default.conf

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
