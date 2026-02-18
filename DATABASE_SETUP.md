# Database Setup Guide - Print-on-Demand Service

## Overview

This guide provides step-by-step instructions for setting up the Neon PostgreSQL database with Prisma for the print-on-demand service with M-Pesa integration.

## Prerequisites

- Neon account (https://neon.tech)
- Node.js 18+ installed
- pnpm installed
- Environment variables configured

## Step 1: Create Neon Database

### 1.1 Sign up for Neon

1. Go to https://neon.tech
2. Sign up with GitHub or email
3. Create a new project

### 1.2 Create Database Connection

1. In Neon dashboard, create a new database:
   - Database name: `kaimosi-pod` (or your preferred name)
   - Region: Choose closest to your location

2. Copy the connection string (looks like):
   ```
   postgresql://user:password@ep-xxx-xxx.neon.tech/kaimosi-pod?sslmode=require&connection_limit=1
   ```

### 1.3 Important: Connection Pooling for Serverless

For Neon with serverless functions, append connection limit:

```
postgresql://user:password@ep-xxx.neon.tech/kaimosi-pod?sslmode=require&connection_limit=1
```

The `connection_limit=1` prevents connection pool exhaustion in serverless environments.

## Step 2: Configure Environment Variables

### 2.1 Create .env.local

```bash
# .env.local

# Database Configuration
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/kaimosi-pod?sslmode=require&connection_limit=1"

# M-Pesa Configuration
MPESA_MODE=mock
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASS_KEY=your_pass_key
MPESA_SHORTCODE=your_shortcode
MPESA_CALLBACK_URL=https://yourdomain.com/api/print-on-demand/payments/mpesa/callback
MPESA_BASE_URL=https://sandbox.safaricom.co.ke
```

## Step 3: Install Dependencies

```bash
# Install all dependencies
pnpm install

# Generate Prisma client
pnpm exec prisma generate
```

## Step 4: Run Database Migrations

### 4.1 Create Initial Migration

```bash
pnpm exec prisma migrate dev --name "init_pod_tables"
```

This command will:
1. Create a migration file in `prisma/migrations/`
2. Apply the migration to your Neon database
3. Generate the Prisma client

### 4.2 Verify Migration

Check that tables were created:

```bash
pnpm exec prisma studio
```

This opens Prisma Studio (visual database manager) at http://localhost:5555

## Step 5: Seed Database (Optional)

Create a seed file to populate initial data:

### 5.1 Create prisma/seed.ts

```typescript
import { prisma } from '@/shared/db/client'

async function main() {
  // Create sample POD products
  const products = await prisma.podProduct.createMany({
    data: [
      {
        name: 'Classic T-Shirt',
        category: 'apparel',
        sku: 'TSHIRT-001',
        basePrice: 1500,
        materials: ['Cotton'],
        colors: ['Black', 'White', 'Red', 'Blue'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        dimensions: { width: 30, height: 40, depth: 0.5, unit: 'cm' },
        printAreas: { front: { width: 20, height: 25 } },
        isActive: true,
      },
      {
        name: 'Coffee Mug',
        category: 'drinkware',
        sku: 'MUG-001',
        basePrice: 800,
        materials: ['Ceramic'],
        colors: ['White'],
        sizes: ['11oz', '15oz'],
        dimensions: { width: 8, height: 10, depth: 8, unit: 'cm' },
        printAreas: { sides: { width: 15, height: 8 } },
        isActive: true,
      },
      {
        name: 'A4 Poster',
        category: 'home',
        sku: 'POSTER-A4',
        basePrice: 500,
        materials: ['Paper'],
        colors: ['Various'],
        sizes: ['A4'],
        dimensions: { width: 21, height: 29.7, depth: 0.1, unit: 'cm' },
        isActive: true,
      },
    ],
  })

  console.log(`Created ${products.count} POD products`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### 5.2 Add seed script to package.json

```json
{
  "scripts": {
    "db:seed": "node --loader ts-node/esm prisma/seed.ts"
  }
}
```

### 5.3 Run seed

```bash
pnpm db:seed
```

## Step 6: Verify Database Connection

### 6.1 Test Connection

Create a test file:

```typescript
// test-db.ts
import { prisma } from '@/shared/db/client'

async function test() {
  try {
    // Test connection
    const users = await prisma.user.findMany({ take: 1 })
    console.log('Database connected successfully')
    console.log('Users count:', users.length)
  } catch (error) {
    console.error('Database connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

test()
```

Run it:

```bash
pnpm tsx test-db.ts
```

## Step 7: Database Management Commands

### View Database Schema

```bash
pnpm exec prisma studio
```

### Create New Migration

After changing `prisma/schema.prisma`:

```bash
pnpm exec prisma migrate dev --name "description_of_change"
```

### Reset Database (Development Only)

```bash
pnpm exec prisma migrate reset
```

**Warning**: This deletes all data!

### Push Schema Without Migration

```bash
pnpm exec prisma db push
```

### View Migration History

```bash
ls prisma/migrations/
```

## Production Deployment

### Step 1: Create Production Database

1. Create separate Neon project for production
2. Copy production connection string

### Step 2: Set Production Environment

Deploy with environment variables:

```bash
# On Vercel or your hosting platform
DATABASE_URL=<production-connection-string>
MPESA_MODE=production
MPESA_CONSUMER_KEY=<production-key>
MPESA_CONSUMER_SECRET=<production-secret>
# ... other production variables
```

### Step 3: Run Migrations in Production

```bash
pnpm exec prisma migrate deploy
```

This applies pending migrations without creating new ones.

### Step 4: Verify Production Database

1. Check Neon dashboard
2. Verify tables exist
3. Monitor connection stats

## Troubleshooting

### Issue: Connection Refused

**Solution:**
- Verify DATABASE_URL is correct
- Check Neon dashboard for password
- Ensure IP is allowed (Neon allows all by default)
- Test connection: `psql <connection-string>`

### Issue: Migration Errors

**Solution:**
- Check schema syntax in `prisma/schema.prisma`
- Run `pnpm exec prisma format` to fix formatting
- Check Neon for conflicting tables
- Review migration file in `prisma/migrations/`

### Issue: Prisma Client Error

**Solution:**
- Regenerate client: `pnpm exec prisma generate`
- Clear node_modules: `rm -rf node_modules && pnpm install`
- Check schema validity: `pnpm exec prisma validate`

### Issue: Slow Queries

**Optimization tips:**
- Check indexes exist (migrations create them)
- Use `include` selectively for related data
- Implement pagination (limit + offset)
- Monitor slow query logs in Neon

## Database Backup

### Manual Backup

```bash
# Export database to SQL file
pg_dump postgresql://user:password@ep-xxx.neon.tech/kaimosi-pod > backup.sql

# Restore from backup
psql postgresql://user:password@ep-xxx.neon.tech/kaimosi-pod < backup.sql
```

### Automated Backup

Neon provides daily backups. Access via Neon dashboard under Database > Backups.

## Monitoring

### View Connection Stats

```bash
pnpm exec prisma studio
```

Monitor in "Query" tab for slow operations.

### Enable Query Logging

In development, Prisma logs queries. Set in client:

```typescript
new PrismaClient({
  log: ['query', 'error', 'warn'],
})
```

## Database Services API Reference

### PodOrderService

```typescript
await PodOrderService.createOrder(data)
await PodOrderService.getOrderById(orderId)
await PodOrderService.getOrdersByUserId(userId, status?, limit, offset)
await PodOrderService.updateOrderStatus(orderId, status, message?, trackingNumber?)
await PodOrderService.cancelOrder(orderId, reason?)
```

### PodPaymentService

```typescript
await PodPaymentService.createPayment(data)
await PodPaymentService.getPaymentByOrderId(orderId)
await PodPaymentService.updatePaymentStatus(paymentId, status, receipt?, failureReason?)
await PodPaymentService.createTransaction(data)
await PodPaymentService.getPaymentsByUserId(userId, limit, offset)
await PodPaymentService.getFailedPaymentsForRetry(limit)
```

### PodCartService

```typescript
await PodCartService.getOrCreateCart(userId)
await PodCartService.addItem(userId, itemData)
await PodCartService.updateItemQuantity(itemId, quantity)
await PodCartService.removeItem(itemId)
await PodCartService.clearCart(userId)
await PodCartService.getCartTotals(userId)
```

### PodDesignService

```typescript
await PodDesignService.createDesign(data)
await PodDesignService.getDesignById(designId)
await PodDesignService.saveVersion(designId, designData, label?)
await PodDesignService.getVersions(designId, limit)
await PodDesignService.revertToVersion(designId, versionNumber)
await PodDesignService.getUserDesigns(userId, filters?, limit, offset)
```

## Support

- Neon Documentation: https://neon.tech/docs
- Prisma Documentation: https://www.prisma.io/docs
- For issues: Check error logs and database state in Prisma Studio
