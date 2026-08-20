FROM node:18-alpine

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install

# Copy all frontend files
COPY . .

# Build the React/Vite app for production
RUN npm run build

# Use a lightweight web server to serve the static files
RUN npm install -g serve

# Expose port 5173
EXPOSE 5173

# Start the server
CMD ["serve", "-s", "dist", "-l", "5173"]
