# ── Stage 1: Build ────────────────────────────────────────────────────────────
# We use a full Node image to compile the React app into static files.
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
# After this stage, /app/dist contains index.html + JS/CSS bundles.
# The Node image itself is NOT included in the final image.

# ── Stage 2: Serve ────────────────────────────────────────────────────────────
# We switch to a tiny nginx image (~23MB) to serve the static files.
# This is the multi-stage build pattern — keeps the final image small.
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]