# Kaimosi Monorepo

A scalable, modular monorepo architecture for managing multiple Next.js microservices and shared libraries.

## 🏗️ Architecture Overview

This monorepo uses **pnpm workspaces** to manage multiple services and shared libraries with clear separation of concerns. Each service is independently deployable while sharing common utilities, components, and types.

```
kaimosi-monorepo/
├── services/              # Independently deployable services
│   ├── web/              # Main public website
│   ├── admin/            # Admin dashboard
│   └── api-gateway/      # API gateway service
├── shared/               # Cross-service shared code
│   ├── ui-components/    # Reusable UI components
│   ├── utilities/        # Helper functions
│   ├── types/            # TypeScript definitions
│   ├── auth/             # Authentication logic
│   └── database/         # Database clients
├── config/               # Shared configurations
├── docker/               # Docker files
└── scripts/              # Monorepo management scripts
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+
- **pnpm** 9+ ([Install pnpm](https://pnpm.io/installation))
- **Git**

### Setup

```bash
# Clone repository
git clone https://github.com/larrybwosi/kaimosi.git
cd kaimosi

# Install dependencies for entire monorepo
pnpm install

# Build all shared libraries
pnpm -r --filter "@kaimosi/*" build

# Start development server
pnpm dev

# Run specific service
pnpm -F @kaimosi/web dev
```

## 📋 Project Structure

### Services

| Service | Port | Purpose |
|---------|------|---------|
| **Web** | 3000 | Public-facing website |
| **Admin** | 3001 | Admin dashboard |
| **API Gateway** | 3002 | API gateway & microservices |

### Shared Libraries

| Library | Purpose |
|---------|---------|
| **@kaimosi/ui** | Reusable React components |
| **@kaimosi/utils** | Utility functions |
| **@kaimosi/types** | TypeScript type definitions |
| **@kaimosi/auth** | Authentication logic |
| **@kaimosi/db** | Database clients & schemas |

## 🔧 Development Workflow

### Running Services

```bash
# Run all services in parallel
pnpm dev

# Run specific service
pnpm -F @kaimosi/web dev

# Run with output filter
pnpm -F @kaimosi/api-gateway dev --verbose
```

### Building

```bash
# Build everything
pnpm build

# Build shared libraries only
pnpm -r --filter "@kaimosi/*" build

# Build specific service
pnpm -F @kaimosi/web build

# Incremental build (changed packages only)
pnpm -r --filter="[HEAD~1]" build
```

### Testing

```bash
# Test all packages
pnpm test

# Test specific service
pnpm -F @kaimosi/web test

# Watch mode
pnpm -F @kaimosi/web test --watch

# Coverage report
pnpm -F @kaimosi/web test --coverage
```

### Linting & Formatting

```bash
# Lint all packages
pnpm lint

# Format code
pnpm format

# Check specific package
pnpm -F @kaimosi/web lint
```

## 📦 Managing Dependencies

### Add Dependency to Service

```bash
# Add to web service
pnpm -F @kaimosi/web add react-query

# Add dev dependency
pnpm -F @kaimosi/web add -D @types/react

# Add to shared library
pnpm -F @kaimosi/ui add tailwindcss
```

### Add Workspace Dependency

Services can depend on shared libraries using workspace protocol:

```json
{
  "dependencies": {
    "@kaimosi/ui": "workspace:*",
    "@kaimosi/types": "workspace:*",
    "@kaimosi/auth": "workspace:*"
  }
}
```

### Remove Dependency

```bash
pnpm -F @kaimosi/web remove react-query
```

## 📝 Common Tasks

### Create New Service

1. Create directory: `services/{service-name}/`
2. Copy template from `services/web/`
3. Update `package.json` with service name
4. Update `tsconfig.json` paths
5. Add service to CI/CD pipeline

```bash
# Template
cp -r services/web services/my-service
cd services/my-service
# Edit package.json and tsconfig.json
```

### Create New Shared Library

1. Create directory: `shared/{library-name}/`
2. Create `package.json` with proper exports
3. Create `tsconfig.json`
4. Add path alias in root `tsconfig.json`

```bash
# Template
mkdir -p shared/my-library/src
cd shared/my-library
pnpm init
# Configure package.json
```

### Update All Shared Libraries

```bash
# Rebuild all shared libraries
pnpm -r --filter "@kaimosi/*" build

# Test all shared libraries
pnpm -r --filter "@kaimosi/*" test
```

## 🐳 Docker & Deployment

### Build Docker Image

```bash
# Build web service image
docker build -f docker/Dockerfile.web -t kaimosi-web:latest .

# Build all services
docker-compose -f docker/docker-compose.yml build
```

### Run with Docker Compose

```bash
# Start all services
docker-compose -f docker/docker-compose.yml up -d

# Stop all services
docker-compose -f docker/docker-compose.yml down

# View logs
docker-compose -f docker/docker-compose.yml logs -f web
```

### Deploy to Vercel

```bash
# Login
vercel login

# Deploy web service
cd services/web
vercel deploy --prod

# Deploy admin service
cd ../admin
vercel deploy --prod
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🔄 Import Paths

### ✅ Correct Imports

```typescript
// From shared libraries (using path aliases)
import { Button } from '@kaimosi/ui/components/button';
import { formatDate } from '@kaimosi/utils';
import type { User } from '@kaimosi/types';
import { useAuth } from '@kaimosi/auth';

// Local imports (relative paths)
import { useUser } from '@/hooks/useUser';
import { config } from '@/lib/config';
```

### ❌ Avoid

```typescript
// Don't use relative imports across services
import { Button } from '../../../shared/ui-components/src/components/button';

// Don't cross-import between services
import { useFoo } from '@kaimosi/web/hooks/useFoo';
```

## 🔍 Workspace Commands Reference

### List Commands

```bash
# List all workspace packages
pnpm ls -r --depth=0

# List specific package's dependencies
pnpm list @kaimosi/ui

# Check for duplicate dependencies
pnpm list --recursive
```

### Filter Commands

```bash
# Filter by pattern
pnpm -r --filter "@kaimosi/*" build

# Filter by directory
pnpm -r --filter="./services/*" build

# Filter changed packages
pnpm -r --filter="[HEAD~1]" test
```

### Monorepo Scripts

```bash
# View available scripts
pnpm scripts

# Run script across all packages
pnpm -r run build

# Run script for specific package
pnpm -F @kaimosi/web run dev
```

## 🧹 Maintenance

### Update Dependencies

```bash
# Check for outdated packages
pnpm outdated

# Update packages interactively
pnpm update --interactive

# Update specific package
pnpm update @kaimosi/ui@latest
```

### Clean Build

```bash
# Remove build artifacts
rm -rf node_modules dist .next

# Reinstall from scratch
pnpm install

# Rebuild everything
pnpm build
```

### Clear Cache

```bash
# Prune pnpm store
pnpm store prune

# Clear specific package cache
pnpm -F @kaimosi/web rebuild
```

## 📊 Monorepo Health

### Check Status

```bash
# Verify workspace structure
pnpm ls -r --depth=0

# Check for issues
pnpm install --dry-run

# View monorepo info
pnpm info
```

### Performance Monitoring

```bash
# Build time analysis
time pnpm build

# Service startup time
time pnpm -F @kaimosi/web dev

# Dependency analysis
pnpm list --recursive
```

## 🤝 Contributing

### Before Committing

1. **Install pre-commit hooks**
   ```bash
   pnpm prepare  # Setup husky
   ```

2. **Lint your changes**
   ```bash
   pnpm lint
   ```

3. **Format code**
   ```bash
   pnpm format
   ```

4. **Run tests**
   ```bash
   pnpm test
   ```

5. **Build shared libraries**
   ```bash
   pnpm -r --filter "@kaimosi/*" build
   ```

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
- `feat(web): add user authentication page`
- `fix(ui): resolve button styling issue`
- `docs(monorepo): update architecture guide`

## 📚 Documentation

- [MONOREPO_ARCHITECTURE.md](./MONOREPO_ARCHITECTURE.md) - Detailed architecture guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment strategies
- [scripts/monorepo-setup.md](./scripts/monorepo-setup.md) - Management scripts

## 🆘 Troubleshooting

### Dependency Issues

```bash
# Verify workspace setup
pnpm ls -r

# Check for circular dependencies
pnpm why @kaimosi/ui

# Resolve conflicts
pnpm install --force
```

### Build Failures

```bash
# Clean and rebuild
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build

# Check specific service
pnpm -F @kaimosi/web build --verbose
```

### Port Conflicts

If services fail to start on default ports:

```bash
# Change port for service
PORT=4000 pnpm -F @kaimosi/web dev

# Check port usage
lsof -i :3000
```

## 🔗 Related Resources

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👥 Team

- **Repository**: [larrybwosi/kaimosi](https://github.com/larrybwosi/kaimosi)
- **Issues**: [GitHub Issues](https://github.com/larrybwosi/kaimosi/issues)
- **Discussions**: [GitHub Discussions](https://github.com/larrybwosi/kaimosi/discussions)

---

**Last Updated**: February 2026
