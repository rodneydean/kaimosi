# Modular Monorepo Architecture Guide

## Overview

This document outlines the structure and best practices for managing a Next.js monorepo with multiple microservices. The architecture supports scalability, maintainability, and independent service deployment while sharing common utilities.

## Directory Structure

```
kaimosi-monorepo/
├── services/                        # Individual microservices
│   ├── web/                         # Main web application
│   │   ├── app/
│   │   ├── components/
│   │   ├── public/
│   │   ├── package.json
│   │   └── next.config.mjs
│   ├── api-gateway/                 # API gateway service
│   │   ├── app/
│   │   ├── middleware/
│   │   ├── package.json
│   │   └── next.config.mjs
│   ├── admin/                       # Admin dashboard
│   │   ├── app/
│   │   ├── components/
│   │   ├── package.json
│   │   └── next.config.mjs
│   └── mobile-api/                  # Mobile backend service
│       ├── app/
│       ├── routes/
│       ├── package.json
│       └── next.config.mjs
├── shared/                          # Shared utilities & libraries
│   ├── ui-components/               # Reusable UI components
│   │   ├── src/components/
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── utilities/                   # Helper functions
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── types/                       # Shared TypeScript types
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── auth/                        # Authentication library
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── database/                    # Database clients & schemas
│       ├── prisma/
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── config/                          # Shared configurations
│   ├── tsconfig.base.json           # Base TypeScript config
│   ├── eslint.config.js             # Shared ESLint config
│   ├── tailwind.config.js           # Shared Tailwind config
│   └── prettier.config.js           # Shared Prettier config
├── packages/                        # Tool packages
│   ├── cli/                         # CLI tools for monorepo
│   ├── build-tools/                 # Custom build tools
│   └── testing/                     # Shared testing utilities
├── scripts/                         # Monorepo management scripts
│   ├── setup.js
│   ├── build-all.js
│   ├── deploy.js
│   └── db-migrations.js
├── docker/                          # Docker configurations
│   ├── Dockerfile.web
│   ├── Dockerfile.api-gateway
│   ├── Dockerfile.admin
│   └── docker-compose.yml
├── .github/                         # GitHub workflows
│   └── workflows/
├── pnpm-workspace.yaml              # Monorepo workspace config
├── package.json                     # Root package.json
├── tsconfig.json                    # Root TypeScript config
├── eslintrc.config.js               # Root ESLint config
└── README.md                        # Monorepo documentation
```

## Folder Naming Conventions

### Services Directory (`/services`)
- **Naming**: `{service-name}/` - lowercase, kebab-case
- **Examples**: `web`, `api-gateway`, `admin`, `mobile-api`
- **Rule**: Each service is independently deployable

### Shared Directory (`/shared`)
- **Naming**: `{library-name}/` - lowercase, kebab-case
- **Examples**: `ui-components`, `utilities`, `types`, `database`
- **Rule**: No circular dependencies between shared libraries

### Internal Structure per Service/Library
```
service-name/
├── src/                             # Source code
│   ├── app/                         # Next.js app directory
│   ├── components/                  # React components
│   ├── hooks/                       # Custom hooks
│   ├── lib/                         # Utility libraries
│   ├── types/                       # Local TypeScript types
│   └── middleware/                  # Server middleware
├── tests/                           # Test files (mirror src structure)
├── public/                          # Static assets
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Configuration Management

### Root `pnpm-workspace.yaml`
```yaml
packages:
  - 'services/*'
  - 'shared/*'
  - 'packages/*'
```

### Root `tsconfig.json`
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@kaimosi/ui/*": ["shared/ui-components/src/*"],
      "@kaimosi/utils/*": ["shared/utilities/src/*"],
      "@kaimosi/types/*": ["shared/types/src/*"],
      "@kaimosi/auth/*": ["shared/auth/src/*"],
      "@kaimosi/db/*": ["shared/database/src/*"]
    }
  }
}
```

### Per-Service `tsconfig.json`
```json
{
  "extends": "../../config/tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],
      "@kaimosi/ui/*": ["../../../shared/ui-components/src/*"],
      "@kaimosi/types/*": ["../../../shared/types/src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "dist", "build"]
}
```

### Environment Variables

Structure per service:
```
services/web/.env.local              # Web service config
services/api-gateway/.env.local      # API Gateway config
services/admin/.env.local            # Admin service config
config/.env.shared                   # Shared across services
```

**Shared `.env.shared` template:**
```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
LOG_LEVEL=info
NODE_ENV=development
```

## Best Practices

### 1. Import Paths

✅ **Correct:**
```typescript
// From shared library
import { Button } from '@kaimosi/ui/components/button';
import { formatDate } from '@kaimosi/utils';
import type { User } from '@kaimosi/types';
import { withAuth } from '@kaimosi/auth';

// Local imports (relative)
import { useUser } from '@/hooks/useUser';
import { config } from '@/lib/config';
```

❌ **Avoid:**
```typescript
// Cross-service imports
import { Button } from '../../../services/web/components/Button';
import { formatDate } from '../../utilities/src/index';
```

### 2. Dependency Management

**Service Dependencies:**
```
Web Service
├── Depends on: @kaimosi/ui, @kaimosi/auth, @kaimosi/types
└── Does NOT depend on: Admin, API Gateway, Mobile API

API Gateway
├── Depends on: @kaimosi/types, @kaimosi/db, @kaimosi/auth
└── Does NOT depend on: Web, Admin UI components

Admin
├── Depends on: @kaimosi/ui, @kaimosi/types, @kaimosi/auth
└── Does NOT depend on: Web, API Gateway internals
```

### 3. Code Sharing Strategy

**Shared (cross-service):**
- UI components library
- Authentication logic
- TypeScript type definitions
- Utility functions
- Database schemas and clients
- Common configurations

**Not Shared (service-specific):**
- Feature business logic
- Service-specific hooks
- Service-specific middleware
- Page layouts

### 4. Package.json Structure

**Root `package.json`:**
- Contains workspace configuration
- Common dev dependencies (TypeScript, ESLint, prettier)
- Monorepo management scripts

**Service `package.json`:**
- Service-specific dependencies
- Service scripts (dev, build, test)
- Service metadata

### 5. Build & Deployment

Each service has its own:
- Build output directory: `dist/` or `.next/`
- Docker container
- Deployment configuration
- Environment variables

**Build order (respecting dependencies):**
1. Build shared libraries first
2. Build services in parallel
3. Services wait for shared library builds

## Deployment Considerations

### Docker Strategy

**Per-service Dockerfile:**
```dockerfile
# Dockerfile.{service-name}
FROM node:20-alpine

WORKDIR /app

# Copy monorepo and install
COPY . .
RUN pnpm install

# Build shared libraries
RUN pnpm run -r --filter "@kaimosi/*" build

# Build specific service
RUN pnpm run -F @{service-name} build

# Start service
CMD ["pnpm", "-F", "@{service-name}", "start"]
```

### CI/CD Pipeline

**GitHub Actions workflow:**
1. Detect changed services
2. Build only affected services and their dependents
3. Run tests for changed services
4. Deploy only affected services
5. Update service status

### Versioning Strategy

- **Semantic Versioning** for shared libraries (0.1.0)
- **Service versions** independent (web: 2.1.0, admin: 1.3.5)
- **Workspace dependencies** use workspace protocol: `workspace:*`

```json
{
  "dependencies": {
    "@kaimosi/ui": "workspace:*",
    "@kaimosi/types": "workspace:*"
  }
}
```

## Scaling Guidelines

### Adding a New Microservice

1. Create service folder: `services/{service-name}/`
2. Copy template structure from existing service
3. Update root `pnpm-workspace.yaml` if not auto-detected
4. Add path mapping in root `tsconfig.json`
5. Add build step in CI/CD pipeline
6. Add Docker configuration
7. Update deployment scripts

### Adding a New Shared Library

1. Create library folder: `shared/{library-name}/`
2. Structure as standalone npm package (with package.json)
3. Add path alias in root `tsconfig.json`
4. Export public API in `src/index.ts`
5. Add to CI/CD build pipeline
6. Document in shared library README

## Performance Optimization

### Build Optimization

1. **Incremental builds**: Only rebuild changed packages
2. **Parallel builds**: Build independent services simultaneously
3. **Cache management**: Use pnpm's built-in cache
4. **Tree-shaking**: Ensure proper exports in shared libraries

### Import Optimization

1. **Path aliases**: Use `@kaimosi/*` instead of relative imports
2. **Barrel exports**: Use `index.ts` for public APIs
3. **Lazy loading**: Lazy load service-specific dependencies
4. **Code splitting**: Each service builds independently

## Monitoring & Debugging

### Service Logs

```bash
# Logs for specific service
pnpm -F @kaimosi/web dev

# Logs for all services
pnpm dev
```

### Dependency Visualization

```bash
# View monorepo structure
pnpm ls -r --depth=0

# Check dependencies
pnpm list @kaimosi/ui
```

## Migration Path

### Phase 1: Setup Monorepo (Week 1)
- Initialize pnpm workspace
- Move current app to `services/web/`
- Extract shared utilities to `shared/utilities/`
- Setup root configuration files

### Phase 2: Extract Shared Libraries (Week 2)
- Move UI components to `shared/ui-components/`
- Create `shared/types/` for TypeScript definitions
- Create `shared/auth/` for authentication logic
- Create `shared/database/` for database utilities

### Phase 3: Build Services (Week 3-4)
- Create `services/api-gateway/`
- Create `services/admin/`
- Setup service-specific deployments
- Configure CI/CD pipeline

### Phase 4: Optimize (Week 5+)
- Implement incremental builds
- Add monorepo scripts
- Performance profiling
- Documentation refinement

## References

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turborepo](https://turbo.build/)
- [Nx](https://nx.dev/)
- [Next.js Monorepo Examples](https://github.com/vercel/next.js/tree/canary/examples/monorepos)
