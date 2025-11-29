# Frontend Dockerfile (build React app -> serve with nginx)

# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
# Build the production bundle (assumes "build" script exists)
RUN npm run build

# Serve stage
FROM nginx:alpine AS serve
# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*
# Copy built assets
COPY --from=build /app/build /usr/share/nginx/html
# Optional: copy custom nginx config
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]