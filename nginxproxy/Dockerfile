# Use a stable nginx alpine image
FROM nginx:alpine3.18

# Copy the configuration file
COPY default.conf /etc/nginx/nginx.conf

# Expose the listening port, https will be done via AWS ACM
EXPOSE 80/tcp

# Enable nginx when the container starts
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
