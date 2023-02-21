# Base image
FROM node:latest

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the app
RUN npm run build

# Serve the app
CMD serve -s build

# Expose the port
EXPOSE 5000