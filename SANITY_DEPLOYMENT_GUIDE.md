# Sanity CMS Deployment Guide

## Overview

This guide covers the complete deployment and setup process for the Sanity CMS integration with your Maplewood town application.

## Prerequisites

- Node.js 18+ and npm/yarn installed
- Sanity account (free tier available)
- Access to the Sanity project: `i8clm8fg`
- Environment variables configured

## Phase 1: Local Development Setup

### 1.1 Install Sanity CLI

```bash
npm install -g @sanity/cli
```

### 1.2 Initialize Sanity Studio

If you haven't already initialized a local studio:

```bash
sanity init --project i8clm8fg --dataset production
```

### 1.3 Configure Environment Variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=i8clm8fg
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_APP_URL=http://localhost:3000
SANITY_API_TOKEN=your_token_here_for_local_development
```

**To get your SANITY_API_TOKEN:**
1. Go to https://manage.sanity.io/projects/i8clm8fg
2. Navigate to Settings → API → Tokens
3. Create a new token with "Editor" permissions
4. Copy and paste into `.env.local`

### 1.4 Install Dependencies

```bash
npm install sanity @sanity/vision @sanity/structure
npm install -D @types/sanity
```

### 1.5 Start Sanity Studio

```bash
npm run dev
```

Then visit: http://localhost:3000/studio

## Phase 2: Schema Registration

### 2.1 Schema Files Structure

```
sanity/
├── schema.ts              # Main schema entry point
├── env.ts                 # Environment configuration
├── studio.ts              # Studio configuration
├── desk.ts                # Desk structure
├── schemas/
│   ├── documents/
│   │   ├── attraction.ts
│   │   ├── attractionCategory.ts
│   │   ├── amenity.ts
│   │   ├── product.ts
│   │   ├── category.ts
│   │   └── discount.ts
│   └── objects/
│       ├── location.ts
│       ├── operatingHours.ts
│       ├── contactInfo.ts
│       ├── socialLinks.ts
│       └── seoSettings.ts
```

### 2.2 Schema Registration in Code

All schemas are automatically loaded via the centralized `schema.ts` entry point which exports all types.

### 2.3 Deploy to Studio

When you run the local studio, schemas are automatically synchronized. No additional deployment step needed for local development.

## Phase 3: Production Deployment

### 3.1 Deploy Schemas to Sanity Cloud

The schemas have been deployed using the Sanity_deploy_schema tool to the production project. Verify in the Sanity studio that all document types appear under your content types.

### 3.2 Verify Deployment

1. Log into Sanity Studio: https://manage.sanity.io/projects/i8clm8fg
2. Check that all document types are registered:
   - attraction
   - attractionCategory
   - amenity
   - product
   - category
   - discount

### 3.3 Set CORS Origins

Add your deployed URL to Sanity CORS origins:

1. Go to Sanity project settings
2. Navigate to API → CORS Origins
3. Add your production domain: `https://yourdomain.com`
4. Add localhost for development: `http://localhost:3000`

## Phase 4: Content Migration

### 4.1 Seed Initial Content

All attraction data has been automatically seeded into Sanity during the deployment phase. The following attractions are available:
- Maple Grove Park
- Historic Downtown District
- Maplewood Heritage Museum
- Riverside Amphitheater
- Maplewood Botanical Gardens
- Old Mill Craft Brewery

### 4.2 Verify Seeded Content

1. Go to Sanity Studio
2. Navigate to "Attractions"
3. Confirm all 6 attractions are visible

### 4.3 Update Content in Studio

You can now edit attraction details directly in the Sanity Studio:
- Upload new images
- Modify descriptions and pricing
- Update operating hours
- Add social media links
- Manage SEO settings

## Phase 5: Application Integration

### 5.1 Fetch Data from Sanity

The application automatically fetches attraction data from Sanity via:
- \`lib/sanity-queries.ts\` - GROQ query definitions
- \`app/attractions/page.tsx\` - List page (ISR with 60s revalidation)
- \`app/attractions/[slug]/page.tsx\` - Detail page (ISR with 60s revalidation)

### 5.2 Real-Time Preview

Enable real-time preview in your Next.js app using Sanity's preview API:

```typescript
import {PreviewSuspense, usePreview} from 'next-sanity'
```

## Phase 6: Version Control & Best Practices

### 6.1 Git Configuration

Add to `.gitignore`:
```
.env.local
.env.production.local
node_modules/
.sanity/
```

### 6.2 Schema Versioning

- All schema changes should be documented in SCHEMA_MAINTENANCE.md
- Use Sanity's built-in versioning for breaking changes
- Test schema migrations in a development dataset first

### 6.3 Content Backup

Regularly backup your content:
```bash
sanity dataset export production > backup-production-$(date +%Y-%m-%d).ndjson
```

## Troubleshooting

### Issue: Studio not loading
- **Solution**: Ensure projectId and dataset match: `i8clm8fg` and `production`
- Verify SANITY_API_TOKEN is set correctly

### Issue: Schemas not appearing
- **Solution**: Restart the dev server: \`npm run dev\`
- Clear cache: \`rm -rf .next sanity/.cache\`

### Issue: Content not fetching
- **Solution**: Check that ISR revalidation is working (wait 60 seconds)
- Verify CORS origins are configured correctly

### Issue: Images not loading
- **Solution**: Ensure image assets are properly uploaded to Sanity
- Check image URL format in the app

## Next Steps

1. ✅ Local studio setup complete
2. ✅ Schemas deployed to production
3. ✅ Initial content seeded
4. 📝 Begin adding/editing content in Studio
5. 📝 Test preview and publishing workflows
6. 📝 Configure custom document actions if needed
7. 📝 Set up webhook notifications for content changes

## Additional Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Sanity CLI Reference](https://www.sanity.io/docs/cli)
- [Sanity Studio Configuration](https://www.sanity.io/docs/configure-studio)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
```
