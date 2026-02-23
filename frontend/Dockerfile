FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build the application
COPY . .
RUN npm run build

# Use Nginx to serve the static files
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Replace default Nginx configuration
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
