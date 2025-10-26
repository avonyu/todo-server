# Runtime-only image for already compiled dist
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# Copy compiled output
COPY dist/ ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]