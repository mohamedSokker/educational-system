# Multi-stage build for better optimization
FROM node:20-alpine AS base

WORKDIR /app

# Copy package files first
COPY package*.json ./
# Copy Prisma schema and generate client
COPY prisma ./prisma

# Install all dependencies
RUN npm ci


RUN npx prisma generate

# Copy the rest of the application
COPY . .

ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
# Copy built files and generated Prisma client
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/node_modules/.prisma ./node_modules/.prisma

RUN npm ci --only=production



# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
