# ─── Stage 1: Build Frontend ──────────────────────────────────────────────────
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy frontend source
COPY frontend/src ./src
COPY frontend/public ./public
COPY frontend/index.html ./
COPY frontend/vite.config.js ./
COPY frontend/eslint.config.js ./

# Build frontend
RUN npm run build

# ─── Stage 2: Build Backend with Frontend ─────────────────────────────────────
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy backend package files
COPY backend/package*.json ./

# Install production dependencies
RUN npm install --production

# Copy backend source
COPY backend/src ./src

# Copy built frontend from stage 1 to backend's public folder
COPY --from=frontend-builder /app/frontend/dist ./public

# Make port 3000 available
EXPOSE 3000

# Run backend
CMD [ "npm", "start" ]
