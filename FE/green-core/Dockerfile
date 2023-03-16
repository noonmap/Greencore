# Specify the base image
FROM node:18.12.1

# Set the working directory inside the container
WORKDIR /FE/green-core 

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the app on port 3000
EXPOSE 3000

# Start the app
CMD ["npm", "start"]