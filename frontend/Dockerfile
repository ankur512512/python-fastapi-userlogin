# Use official Node.js image
FROM node:lts-bookworm

# Fixing vulnerability identified by trivy
# https://avd.aquasec.com/nvd/cve-2024-36899
RUN apt update && \
    apt install linux-libc-dev -y

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Expose frontend port
EXPOSE 3000

# Start the React app
CMD ["npm", "run", "dev"]
