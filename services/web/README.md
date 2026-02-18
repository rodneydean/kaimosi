# Web Service

Main Next.js web application for the Kaimosi platform.

## Features
- Server-side rendering (SSR) with Next.js App Router
- Responsive UI components from `@kaimosi/ui`
- Authentication with `@kaimosi/auth`
- Shared type definitions from `@kaimosi/types`
- Database integration with `@kaimosi/db`

## Getting Started

```bash
# Install dependencies (from monorepo root)
pnpm install

# Run development server
pnpm -F @kaimosi/web dev

# Build for production
pnpm -F @kaimosi/web build

# Start production server
pnpm -F @kaimosi/web start

# Run tests
pnpm -F @kaimosi/web test
```

## Structure

```
services/web/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── (auth)/          # Authentication routes
│   │   ├── (dashboard)/     # Dashboard routes
│   │   ├── api/             # Route handlers
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # React components
│   │   ├── auth/            # Auth components
│   │   ├── dashboard/       # Dashboard components
│   │   └── common/          # Shared components
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Utility libraries
│   ├── middleware.ts        # Next.js middleware
│   └── types/               # Local type definitions
├── public/                  # Static assets
├── package.json
├── next.config.mjs
└── tsconfig.json
```

## Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SANITY_PROJECT_ID=xxx
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
```

## Build & Deployment

The web service is deployed to Vercel using GitHub Actions. Each commit to `main` triggers:

1. Build shared libraries
2. Build web service
3. Run tests
4. Deploy to Vercel

## Dependencies

- `@kaimosi/ui` - UI components library
- `@kaimosi/auth` - Authentication utilities
- `@kaimosi/types` - Shared TypeScript types
- `next` - React framework
- `react` - UI library
