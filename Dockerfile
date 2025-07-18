FROM node:22.16.0-alpine3.22 AS base

# All deps stage
FROM base AS deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci

# Production only deps stage
FROM base AS production-deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci --omit=dev

# Build stage
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD . .
RUN \
  export PORT=8080 && \
  export APP_KEY=dummydummykey123456789012345678901234 && \
  export HOST=0.0.0.0 && \
  export LOG_LEVEL=info && \
  export DB_HOST=localhost && \
  export DB_PORT=5432 && \
  export DB_USER=postgres && \
  export DB_DATABASE=mydb && \
  export DRIVE_DISK=local && \
  export AWS_ACCESS_KEY_ID=dummy && \
  export AWS_SECRET_ACCESS_KEY=dummy && \
  export AWS_REGION=us-east-1 && \
  export S3_BUCKET=dummybucket && \
  node ace docs:generate
RUN node ace build
RUN cp swagger.yml build/swagger.yml

# Production stage
FROM base
ENV NODE_ENV=production
WORKDIR /app
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app
EXPOSE 8080
CMD ["node", "./bin/server.js"]