# Use a Node.js base image
FROM node:18-alpine

# Set the work directory of the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN yarn install

# Copy the rest of the application code to the container
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Expose the port on which the app will run
EXPOSE 8080

# CMD ["yarn", "run", "start:dev"]
ENTRYPOINT [ "node" ]
CMD ["dist/main.js"]