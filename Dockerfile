# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy only package.json and package-lock.json first for better caching
COPY package.json ./

# Install dependencies
RUN npm install --production

# Copy only the main app files (not subfolders)
COPY index.js ./
COPY README.md ./
# COPY data/users.json ./data/

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
