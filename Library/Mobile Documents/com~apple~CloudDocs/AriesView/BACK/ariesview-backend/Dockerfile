# Use official Node.js 20 image as the base
FROM node:20.11.1

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 8080

# Set environment variables (optional, can be overridden at runtime)
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]