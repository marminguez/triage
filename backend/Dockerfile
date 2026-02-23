FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY src ./src

EXPOSE 3001

# Start the server
CMD ["node", "src/index.js"]
