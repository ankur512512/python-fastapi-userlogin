# Use official Node.js image
FROM node:lts-bookworm

# Fixing vulnerability identified by trivy
# https://avd.aquasec.com/nvd/cve-2024-36899
RUN apt update && \
    apt install linux-libc-dev libxslt1-dev -y

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Expose frontend port
EXPOSE 5173

# Start the React app
CMD ["npm", "run", "dev"]
