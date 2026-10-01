# Start from an official Node.js runtime.
FROM node:22-alpine

# Keep app files together in /app inside the container.
WORKDIR /app

# Install exact dependency versions from the lockfile for repeatable builds.
COPY package*.json ./
RUN npm ci

# Copy application code and Prisma schema into the image.
COPY . .

# Generate Prisma's client for the schema included in this image.
# Prisma's config requires DATABASE_URL while it loads, but generation does
# not connect to the database. The real URL is supplied by Compose at runtime.
RUN DATABASE_URL="postgresql://hartmart:hartmart@localhost:5432/hartmart?schema=public" npx prisma generate

ENV NODE_ENV=production
EXPOSE 5001

CMD ["sh", "-c", "npm run db:deploy && npm start"]
