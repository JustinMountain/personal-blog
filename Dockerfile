# Use a stable node alpine image
FROM node:alpine3.18

# Set working directory
WORKDIR /usr/app

# Install PM2 globally
RUN npm install --global pm2

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY ./package*.json ./

# Install dependencies
RUN npm ci

# Copy all files
COPY ./ ./

# Build app
RUN npm run build

# Expose the listening port
EXPOSE 3000

# Change ownership of the /usr/app directory to the node user
RUN chown -R node:node /usr/app

# Run container as non-root (unprivileged) user to follow principle of least privilege
USER node

# Run npm start script when container starts
CMD [ "pm2-runtime", "npm", "--", "start" ]
