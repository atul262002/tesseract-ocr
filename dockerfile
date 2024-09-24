# Use an official Node.js runtime based on Alpine as a parent image
FROM node:18-alpine

# Install necessary dependencies for Tesseract.js
RUN apk add --no-cache \
    tesseract-ocr \
    tesseract-ocr-data-eng \
    leptonica-dev

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the required dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Start the Node.js application
CMD ["npm", "start"]
