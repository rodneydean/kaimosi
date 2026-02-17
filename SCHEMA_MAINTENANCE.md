# Schema Maintenance & Evolution Guide

## Schema Versioning Strategy

### Version Numbers

Schemas follow semantic versioning:
- **MAJOR.MINOR.PATCH** (e.g., 1.0.0)
- MAJOR: Breaking changes (data migration required)
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (no data changes)

### Current Schema Version: 1.0.0

## Document Types

### 1. Attraction (attraction)
**Purpose**: Main attractions in the town
**Status**: ✅ Stable (v1.0.0)
**Last Updated**: 2024

**Key Fields**:
- name: string (required)
- slug: slug (required, auto-generated)
- category: reference to attractionCategory (required)
- shortDescription: text (max 200 chars)
- fullDescription: block content
- heroImage: image (required)
- gallery: array of images (max 12)
- location: nested object with coordinates
- operatingHours: flexible schedule object
- contact: phone, email, website
- pricing: admission and pricing details
- amenities: array of references to amenity docs
- featured: boolean (for homepage)
- seo: SEO metadata

**Future Considerations**:
- Add ticketing integration
- Add user reviews/ratings
- Add accessibility scores
- Add virtual tours support

### 2. Attraction Category (attractionCategory)
**Purpose**: Categorize attractions by type
**Status**: ✅ Stable (v1.0.0)

**Key Fields**:
- name: string (required)
- slug: slug (required)
- description: text
- icon: string (Lucide icon name)
- color: string (brand color)
- order: number (display priority)

### 3. Amenity (amenity)
**Purpose**: Reusable amenities library
**Status**: ✅ Stable (v1.0.0)

**Key Fields**:
- name: string (required)
- icon: string (Lucide icon name)
- description: text
- category: string enum (accessibility, dining, facilities, technology, services)

## Making Schema Changes

### Adding a New Field (Minor Version)

**Example**: Add "visitDuration" field to attraction

```typescript
// In sanity/schemas/documents/attraction.ts
{
  name: 'visitDuration',
  type: 'object',
  title: 'Recommended Visit Duration',
  fields: [
    {name: 'min', type: 'number', title: 'Minimum (hours)'},
    {name: 'max', type: 'number', title: 'Maximum (hours)'}
  ]
}
```

**Steps**:
1. Add field to schema (data is optional by default)
2. Bump version to 1.1.0 in this document
3. Test in local studio
4. Deploy schema (old documents continue to work)
5. Update queries to include new field
6. No data migration needed

### Removing a Field (Major Version)

**Example**: Remove "bestTimeToVisit" field

```typescript
// Remove from attraction.ts schema
// DO NOT delete: field remains in existing documents
```

**Steps**:
1. Remove field from schema definition
2. Remove field from all queries
3. Bump version to 2.0.0
4. Update application code
5. Optional: Run migration to delete field from existing docs
6. Communicate breaking change

### Renaming a Field (Major Version)

**Example**: Rename "operatingHours" to "hours"

```typescript
// Step 1: Add new field
{name: 'hours', type: 'operatingHours', ...}

// Step 2: Deploy and migrate data

// Step 3: Remove old field
// Old field name removed from schema

// Step 4: Deploy again
```

### Changing Field Type (Major Version)

**Example**: Change "admission" from string to object with pricing

Not recommended. Create new field instead, migrate data, then remove old field.

## Data Migration Checklist

- [ ] Create backup: \`sanity dataset export\`
- [ ] Test in development dataset first
- [ ] Document migration steps
- [ ] Notify team of downtime (if any)
- [ ] Execute migration
- [ ] Verify data integrity
- [ ] Update application code
- [ ] Deploy updates
- [ ] Monitor for issues

## Backward Compatibility

### Rules

1. **Adding fields**: Always backward compatible
2. **Removing fields**: Breaking change (MAJOR version bump)
3. **Renaming fields**: Breaking change (create new, deprecate old)
4. **Field validation changes**: Backward compatible if only stricter
5. **Type changes**: Breaking change

### Deprecation Process

1. Mark field as deprecated in schema
2. Add migration note
3. Support both old and new fields for 1-2 releases
4. Remove old field in next major version

## Schema Validation Rules

### Current Validations

**attraction**:
- name: required, 3-100 chars
- slug: required, auto-generated
- shortDescription: max 200 chars
- fullDescription: required, block content
- heroImage: required
- gallery: max 12 images
- location: required with valid coordinates
- pricing: must specify admission type

**location**:
- latitude: required, -90 to 90
- longitude: required, -180 to 180

**operatingHours**:
- At least 1 day schedule required
- Opens/closes times required if not closed

### Adding New Validation

When adding stricter validation:
1. First deploy with warning-only validation
2. Allow content managers time to fix data
3. Then deploy with strict validation

## Performance Considerations

### Current Optimizations

1. **Image optimization**:
   - Hero image required (1 per attraction)
   - Gallery limited to 12 images
   - Automatic optimization via Sanity CDN

2. **Query optimization**:
   - GROQ queries select only needed fields
   - References used instead of nested data
   - ISR revalidation: 60 seconds

3. **Field organization**:
   - Frequently accessed fields at top
   - Grouped related fields in objects
   - Lazy-loaded gallery images

### Future Optimizations

- Consider pagination for very large galleries
- Add search indexing for full-text search
- Consider caching common queries

## Testing Schema Changes

### Local Testing

1. Make schema changes in local studio
2. Test CRUD operations
3. Run queries in Vision tool
4. Check API responses

### Staging Deployment

1. Deploy to staging dataset
2. Test data fetching
3. Test UI rendering
4. Verify no breaking changes

### Production Deployment

1. Backup production
2. Deploy to production
3. Monitor application
4. Check error logs

## Documentation Updates

When changing schemas:
- [ ] Update this file (SCHEMA_MAINTENANCE.md)
- [ ] Update CONTENT_MANAGEMENT_GUIDE.md if user-facing
- [ ] Update type definitions in app
- [ ] Update queries in lib/sanity-queries.ts
- [ ] Update components that use the data
- [ ] Add changelog entry

## Contact & Support

For schema questions or changes:
- Review Sanity docs: https://www.sanity.io/docs
- Check existing schema patterns in this codebase
- Test thoroughly in local studio before deployment
```
