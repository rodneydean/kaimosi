# Monorepo Management Scripts

Common scripts and commands for managing the monorepo.

## Setup Scripts

### Initial Setup

```bash
#!/bin/bash
# scripts/setup.sh

echo "🚀 Setting up monorepo..."

# Install dependencies
pnpm install

# Build shared libraries
echo "📦 Building shared libraries..."
pnpm -r --filter "@kaimosi/*" build

# Create .env files
if [ ! -f "services/web/.env.local" ]; then
  cp services/web/.env.example services/web/.env.local
  echo "✅ Created services/web/.env.local"
fi

echo "✨ Setup complete!"
```

### Clean Build

```bash
#!/bin/bash
# scripts/clean-build.sh

echo "🧹 Cleaning build artifacts..."

# Remove all build output
find . -name "dist" -type d -exec rm -rf {} + 2>/dev/null
find . -name ".next" -type d -exec rm -rf {} + 2>/dev/null

# Clear pnpm cache
pnpm store prune

echo "🔨 Building all packages..."
pnpm install
pnpm -r --filter "@kaimosi/*" build

echo "✨ Clean build complete!"
```

## Development Scripts

### Run Specific Service

```bash
#!/bin/bash
# scripts/dev-service.sh

SERVICE=$1

if [ -z "$SERVICE" ]; then
  echo "Usage: ./scripts/dev-service.sh <service-name>"
  echo "Available services: web, admin, api-gateway"
  exit 1
fi

pnpm -F @kaimosi/$SERVICE dev
```

### Development with Watch Mode

```bash
#!/bin/bash
# scripts/dev-watch.sh

echo "👀 Starting development with watch mode..."

# Terminal multiplexing (if using tmux)
tmux new-session -d -s "kaimosi"
tmux send-keys -t "kaimosi" "pnpm -F @kaimosi/web dev" Enter
tmux send-keys -t "kaimosi" "pnpm -F @kaimosi/utils dev" Enter

# Alternative: Run all in parallel
pnpm dev
```

## Build Scripts

### Build Matrix

```bash
#!/bin/bash
# scripts/build-matrix.sh

echo "🔨 Building monorepo services..."

services=("web" "admin" "api-gateway")

for service in "${services[@]}"; do
  echo "📦 Building @kaimosi/$service..."
  pnpm -F @kaimosi/$service build
  
  if [ $? -eq 0 ]; then
    echo "✅ @kaimosi/$service built successfully"
  else
    echo "❌ @kaimosi/$service build failed"
    exit 1
  fi
done

echo "✨ All services built successfully!"
```

### Incremental Build

```bash
#!/bin/bash
# scripts/build-incremental.sh

echo "⚡ Incremental build..."

# Detect changed files
CHANGED=$(git diff --name-only HEAD~1 HEAD)

# Determine which packages are affected
AFFECTED_PACKAGES=()

if echo "$CHANGED" | grep -q "shared/"; then
  AFFECTED_PACKAGES+=("@kaimosi/*")
fi

if echo "$CHANGED" | grep -q "services/web"; then
  AFFECTED_PACKAGES+=("@kaimosi/web")
fi

if echo "$CHANGED" | grep -q "services/admin"; then
  AFFECTED_PACKAGES+=("@kaimosi/admin")
fi

# Build only affected packages
for pkg in "${AFFECTED_PACKAGES[@]}"; do
  pnpm -F "$pkg" build
done

echo "✨ Incremental build complete!"
```

## Testing Scripts

### Test All

```bash
#!/bin/bash
# scripts/test-all.sh

echo "🧪 Running tests for all packages..."

pnpm -r test

echo "✨ All tests complete!"
```

### Test Specific Service

```bash
#!/bin/bash
# scripts/test-service.sh

SERVICE=$1

if [ -z "$SERVICE" ]; then
  echo "Usage: ./scripts/test-service.sh <service-name>"
  exit 1
fi

pnpm -F @kaimosi/$SERVICE test
```

### Coverage Report

```bash
#!/bin/bash
# scripts/coverage.sh

echo "📊 Generating coverage report..."

pnpm -r test -- --coverage

echo "✨ Coverage report generated in ./coverage"
```

## Deployment Scripts

### Deploy Service

```bash
#!/bin/bash
# scripts/deploy.sh

SERVICE=$1
ENVIRONMENT=${2:-staging}

if [ -z "$SERVICE" ]; then
  echo "Usage: ./scripts/deploy.sh <service> [environment]"
  echo "Services: web, admin, api-gateway"
  echo "Environments: staging, production"
  exit 1
fi

echo "🚀 Deploying @kaimosi/$SERVICE to $ENVIRONMENT..."

if [ "$ENVIRONMENT" = "production" ]; then
  pnpm -F @kaimosi/$SERVICE build
  pnpm -F @kaimosi/$SERVICE deploy:prod
else
  pnpm -F @kaimosi/$SERVICE build
  pnpm -F @kaimosi/$SERVICE deploy:staging
fi

echo "✅ Deployment complete!"
```

### Docker Build & Push

```bash
#!/bin/bash
# scripts/docker-deploy.sh

SERVICE=$1
VERSION=$2

if [ -z "$SERVICE" ] || [ -z "$VERSION" ]; then
  echo "Usage: ./scripts/docker-deploy.sh <service> <version>"
  exit 1
fi

DOCKER_IMAGE="kaimosi-$SERVICE:$VERSION"

echo "🐳 Building Docker image: $DOCKER_IMAGE..."

docker build \
  -f docker/Dockerfile.$SERVICE \
  -t $DOCKER_IMAGE \
  .

if [ $? -eq 0 ]; then
  echo "📤 Pushing to registry..."
  docker push $DOCKER_IMAGE
  echo "✅ Docker deployment complete!"
else
  echo "❌ Docker build failed"
  exit 1
fi
```

## Utility Scripts

### Check Dependencies

```bash
#!/bin/bash
# scripts/check-deps.sh

echo "🔍 Checking monorepo dependencies..."

# List all packages
echo "📦 Workspace packages:"
pnpm ls -r --depth=0

# Check for circular dependencies
echo "🔄 Checking for circular dependencies..."
pnpm ls -r

echo "✨ Dependency check complete!"
```

### Workspace Health Check

```bash
#!/bin/bash
# scripts/health-check.sh

echo "💚 Running health check..."

# Check pnpm integrity
echo "Checking pnpm integrity..."
pnpm install --dry-run

# List workspace
echo "Workspace structure:"
pnpm ls -r --depth=0

# Check Node version
echo "Node version: $(node --version)"
echo "pnpm version: $(pnpm --version)"

echo "✅ Health check complete!"
```

### Generate Documentation

```bash
#!/bin/bash
# scripts/generate-docs.sh

echo "📝 Generating documentation..."

# Extract README files
for service in services/*/; do
  if [ -f "$service/README.md" ]; then
    echo "Found: $service/README.md"
  fi
done

# Generate API documentation
pnpm -r run docs

echo "✨ Documentation generated!"
```

## Usage

### Make scripts executable:

```bash
chmod +x scripts/*.sh
```

### Run scripts:

```bash
# Setup monorepo
./scripts/setup.sh

# Build all
./scripts/build-matrix.sh

# Test everything
./scripts/test-all.sh

# Deploy service
./scripts/deploy.sh web production

# Health check
./scripts/health-check.sh
```

## Package Manager Commands

### Common pnpm Commands

```bash
# Filter by package name
pnpm -F @kaimosi/web install

# Filter by package type
pnpm -r --filter "!@kaimosi/*" install

# Run script across packages
pnpm -r run build

# Run script for specific package
pnpm -F @kaimosi/web run build

# List all packages
pnpm ls -r --depth=0

# Check installed versions
pnpm list tailwindcss

# Prune unused packages
pnpm prune

# Store management
pnpm store status
pnpm store prune
```

## Troubleshooting

### Clear All Caches

```bash
#!/bin/bash
# scripts/clear-cache.sh

echo "🧹 Clearing all caches..."

rm -rf node_modules
rm -rf pnpm-lock.yaml
rm -rf .next
find . -name "dist" -type d -exec rm -rf {} + 2>/dev/null

pnpm install

echo "✨ Cache cleared!"
```

### Reset to Clean State

```bash
#!/bin/bash
# scripts/full-reset.sh

echo "⚠️  Full reset of monorepo..."

git clean -fdx
git reset --hard

pnpm install
pnpm -r --filter "@kaimosi/*" build

echo "✅ Reset complete!"
```
