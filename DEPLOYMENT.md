# Deployment Guide

Complete guide for building and deploying services in the monorepo.

## Overview

Each service in the monorepo can be deployed independently to different platforms (Vercel, Docker, AWS, etc.). This guide covers common deployment scenarios.

## Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for containerized deployments)
- Vercel CLI (for Vercel deployments)

## Local Development

### Build All Services

```bash
# Install dependencies
pnpm install

# Build shared libraries first
pnpm -r --filter "@kaimosi/*" build

# Build all services
pnpm build

# Or build specific service
pnpm -F @kaimosi/web build
```

### Run Development Server

```bash
# Run all services
pnpm dev

# Or run specific service
pnpm -F @kaimosi/web dev

# View logs for specific service
pnpm -F @kaimosi/web dev --verbose
```

## Vercel Deployment

### Single Service Deployment (Web)

#### Option 1: Using Vercel Dashboard

1. **Connect Repository**
   - Go to vercel.com
   - Select "New Project"
   - Import your repository

2. **Configure Project**
   - **Root Directory**: `services/web`
   - **Build Command**: `pnpm -F @kaimosi/web build`
   - **Start Command**: `pnpm -F @kaimosi/web start`

3. **Environment Variables**
   - Add all variables from `.env.local`
   - Example: `NEXT_PUBLIC_API_URL`, `DATABASE_URL`, `JWT_SECRET`

4. **Deploy**
   - Trigger deployment
   - Monitor build and deployment status

#### Option 2: Using Vercel CLI

```bash
# Login to Vercel
vercel login

# Navigate to web service
cd services/web

# Deploy
vercel deploy --prod

# View deployment
vercel logs --prod
```

### Multiple Services Deployment

Create separate Vercel projects for each service:

```bash
# Setup for web service
cd services/web
vercel link --project-name kaimosi-web

# Setup for admin service
cd ../admin
vercel link --project-name kaimosi-admin

# Deploy all
vercel deploy --prod
```

## Docker Deployment

### Build Docker Image

```bash
# Build image for web service
docker build -f docker/Dockerfile.web \
  --build-arg SERVICE=web \
  -t kaimosi-web:latest .

# Build image for api-gateway
docker build -f docker/Dockerfile.api-gateway \
  --build-arg SERVICE=api-gateway \
  -t kaimosi-api:latest .
```

### Docker Compose

```bash
# Start all services
docker-compose -f docker/docker-compose.yml up -d

# Stop all services
docker-compose -f docker/docker-compose.yml down

# View logs
docker-compose -f docker/docker-compose.yml logs -f
```

### Example `docker/Dockerfile.web`

```dockerfile
FROM node:20-alpine AS dependencies
WORKDIR /app
COPY pnpm-lock.yaml .
RUN npm install -g pnpm
RUN pnpm fetch

FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm

# Copy dependencies
COPY --from=dependencies /app /app

# Copy monorepo
COPY . .

# Build shared libraries
RUN pnpm install && \
    pnpm -r --filter "@kaimosi/*" build

# Build web service
RUN pnpm -F @kaimosi/web build

FROM node:20-alpine AS runtime
WORKDIR /app
RUN npm install -g pnpm

# Copy built files
COPY --from=builder /app/services/web/.next ./services/web/.next
COPY --from=builder /app/services/web/public ./services/web/public
COPY --from=builder /app/services/web/package.json ./services/web/package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Install production dependencies
RUN pnpm install --prod

EXPOSE 3000
CMD ["pnpm", "-F", "@kaimosi/web", "start"]
```

## CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]
    paths:
      - 'services/**'
      - 'shared/**'
      - 'config/**'
      - 'pnpm-lock.yaml'

jobs:
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      web: ${{ steps.changes.outputs.web }}
      admin: ${{ steps.changes.outputs.admin }}
      api-gateway: ${{ steps.changes.outputs.api-gateway }}
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Detect changed services
        id: changes
        run: |
          echo "web=$(git diff HEAD~1 HEAD --name-only | grep -q 'services/web' && echo 'true' || echo 'false')" >> $GITHUB_OUTPUT
          echo "admin=$(git diff HEAD~1 HEAD --name-only | grep -q 'services/admin' && echo 'true' || echo 'false')" >> $GITHUB_OUTPUT
          echo "api-gateway=$(git diff HEAD~1 HEAD --name-only | grep -q 'services/api-gateway' && echo 'true' || echo 'false')" >> $GITHUB_OUTPUT

  build:
    needs: detect-changes
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service: [web, admin, api-gateway]
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build shared libraries
        run: pnpm -r --filter "@kaimosi/*" build
      
      - name: Build ${{ matrix.service }}
        run: pnpm -F @kaimosi/${{ matrix.service }} build
      
      - name: Test ${{ matrix.service }}
        run: pnpm -F @kaimosi/${{ matrix.service }} test

  deploy-web:
    needs: [detect-changes, build]
    if: needs.detect-changes.outputs.web == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: vercel/action@v4
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_WEB }}
          working-directory: services/web

  deploy-admin:
    needs: [detect-changes, build]
    if: needs.detect-changes.outputs.admin == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: vercel/action@v4
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_ADMIN }}
          working-directory: services/admin
```

### Environment Variables for CI/CD

Add to GitHub repository secrets:
- `VERCEL_TOKEN` - Vercel authentication token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID_WEB` - Web service project ID
- `VERCEL_PROJECT_ID_ADMIN` - Admin service project ID

## Database Migrations

### Run Migrations

```bash
# Run all pending migrations
pnpm -F @kaimosi/db migrate:deploy

# Create new migration
pnpm -F @kaimosi/db migrate:create

# Rollback last migration
pnpm -F @kaimosi/db migrate:rollback

# View migration status
pnpm -F @kaimosi/db migrate:status
```

### Prisma Migrations

```bash
# Generate migrations
cd shared/database
npx prisma migrate dev --name add_users_table

# Deploy migrations to production
npx prisma migrate deploy

# View migration status
npx prisma migrate status
```

## Monitoring & Logging

### Vercel Analytics

- Monitor build times and performance
- Track deployments and rollbacks
- View real-time metrics

```bash
vercel analytics [project-name]
```

### Docker Logs

```bash
# View service logs
docker logs -f kaimosi-web

# View specific service logs from compose
docker-compose -f docker/docker-compose.yml logs -f web
```

## Rollback Procedures

### Vercel Rollback

```bash
# Rollback to previous deployment
vercel rollback

# Rollback to specific deployment
vercel rollback <deployment-url>
```

### Manual Rollback

1. Check deployment history
2. Deploy previous commit
3. Verify services are running correctly

## Performance Optimization

### Build Optimization

- Use incremental builds with `pnpm -r` filter
- Cache build artifacts in CI/CD
- Parallelize independent builds
- Remove unused dependencies

### Runtime Optimization

- Use Next.js image optimization
- Enable gzip compression
- Implement caching strategies
- Monitor Core Web Vitals

## Troubleshooting

### Common Issues

**Build Failure**
```bash
# Clear cache and rebuild
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

**Dependency Issues**
```bash
# Verify workspace setup
pnpm ls -r

# Check for circular dependencies
pnpm check
```

**Deployment Failure**
```bash
# View detailed build logs
vercel logs --follow

# Check environment variables
vercel env list
```

## Best Practices

1. **Test Before Deploy**: Run tests in CI before deploying
2. **Gradual Rollout**: Use canary deployments for critical services
3. **Monitor Services**: Set up alerts for deployment failures
4. **Document Changes**: Include migration scripts in commits
5. **Secure Secrets**: Use environment variables for sensitive data
6. **Version Control**: Tag releases with service versions
7. **Automate**: Use CI/CD to reduce manual errors

## References

- [Vercel Deployment Docs](https://vercel.com/docs)
- [Docker Deployment](https://docs.docker.com/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [pnpm Workspace Guide](https://pnpm.io/workspaces)
