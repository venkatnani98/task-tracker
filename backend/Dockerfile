# Use Alpine variant for a smaller image (~50MB vs ~300MB for full node)
FROM node:18-alpine

WORKDIR /app

# Copy dependency files first — Docker caches this layer.
# If only src files change, npm ci won't re-run (faster rebuilds).
COPY package*.json ./
RUN npm install --only=production

# Copy source code after installing deps
COPY src ./src

EXPOSE 4000

CMD ["node", "src/index.js"]