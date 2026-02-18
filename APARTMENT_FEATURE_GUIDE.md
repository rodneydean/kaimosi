# Comprehensive Apartment Hunting Feature Guide

## Overview

This document outlines the complete apartment hunting feature for the Kaimosi platform, including detailed listings, advanced search, personalization, and analytics.

## Architecture

### Database Models (Prisma)

**Core Models:**
- `Property` - Main property listing with price, type, location, and status
- `Location` - Hierarchical location data (country → city → district → subarea)
- `PropertyImage` - Carousel gallery images with ordering and types (photo/floorplan)
- `FloorPlan` - Floor plan details with dimensions and areas
- `Amenity` - Reusable amenity definitions (gym, pool, parking, etc.)
- `PropertyAmenity` - Junction table linking amenities to properties
- `PropertyComplex` - Grouping of multiple units in same building/complex
- `ComplexProperty` - Junction table for units in complexes

**User Engagement:**
- `UserFavorite` - User wishlist/favorites tracking
- `UserPreference` - Saved search preferences and personalization
- `SearchQuery` - User search history for ML recommendations
- `PropertyView` - View analytics for each property
- `PropertyShare` - Social share tracking with unique tokens
- `PropertyAnalytics` - Aggregated engagement metrics

**Business Intelligence:**
- `PriceHistory` - Track price changes over time
- `Recommendation` - ML-generated property recommendations

### API Routes Structure

```
/api/apartments/
├── listings/          # GET - Search with filters, facets
├── [id]              # GET - Property details, POST - Track views
├── favorites/        # GET/POST/DELETE - Wishlist management
├── preferences/      # GET/PATCH - User preference management
├── recommendations/  # GET - Personalized recommendations
├── search/           # POST - Track search queries
├── shares/           # POST - Create share links
├── analytics/        # GET - Analytics dashboard
└── trends/           # GET - Market trends and insights
```

### Frontend Components

**Gallery & Display:**
- `PropertyGallery` - Image carousel with fullscreen, thumbnails, zoom
- `PropertyCard` - Listing card with quick info (price, beds, baths, amenities)
- `PropertyDetail` - Full property page with gallery, specs, amenities

**Search & Filtering:**
- `SearchFilters` - Advanced filters (price, type, bedrooms, amenities, features)
- `FacetedSearch` - Dynamic filter counts and faceted navigation
- `LocationHierarchy` - Country → City → District → SubArea search

**Personalization:**
- `PreferenceManager` - Save and update search preferences
- `RecommendationCarousel` - ML-based property recommendations
- `SavedSearches` - Manage saved filter combinations
- `WishlistManager` - Organize favorites into lists

**Social & Sharing:**
- `ShareablePropertyCard` - Beautiful preview cards for social sharing
- `ShareModal` - Share via WhatsApp, Facebook, Twitter, Email, Link
- `FeedbackForm` - Collect user feedback on shared properties

**Analytics:**
- `AnalyticsDashboard` - View engagement metrics
- `MarketTrendsChart` - Price trends by location
- `DemandHeatmap` - Visual demand distribution
- `PropertyComparison` - Compare multiple properties

## Feature Breakdown

### 1. Property Listings

**Components:**
- Property carousel gallery with zoom and fullscreen
- Multiple viewing angles (photos and floor plans)
- Quick property details (price, bedrooms, bathrooms, area)
- Amenities preview with expandable list
- Featured image and thumbnail gallery

**Key Features:**
- Sort by price, newest, popularity, views
- Filter by type, location, price range
- Responsive image loading with Next.js Image optimization
- SEO meta tags for each property

### 2. Advanced Search & Filtering

**Filter Options:**
- Price range (min/max with currency support)
- Property type (apartment, house, villa, commercial, land, studio)
- Bedroom/bathroom count
- Area size range
- Furnished status (furnished/unfurnished/semi-furnished)
- Pet-friendly properties
- Location (hierarchical: country → city → district → subarea)
- Amenities (gym, pool, parking, etc.)
- Move-in date

**Search Features:**
- Faceted search with live result counts
- Saved searches with notifications
- Search history tracking
- Popular/quick filters
- Real-time filter updates (<500ms)

### 3. User Preferences & Personalization

**User Preference Profile:**
- Saved budget range
- Preferred locations
- Bedroom/bathroom requirements
- Property type preferences
- Amenity preferences
- Pet-friendly and furnished preferences
- Lease type (long-term/short-term)
- Move-in date

**ML-Based Recommendations:**
- Score properties based on user profile (0-100)
- Factor in: price match, bedroom match, location, amenities, furniture, pets, novelty
- 30-day expiration for recommendations
- Track recommendation engagement (viewed/not viewed)
- Learn from browsing history and favorites

**Search History:**
- Track all user searches with filters
- Store selected properties from search results
- Use for recommendation training
- Clear expired history automatically

### 4. Property Grouping & Organization

**Hierarchical Organization:**
```
Country
├── City (Nairobi)
│   ├── District (Westlands)
│   │   ├── Subarea (CBD)
│   │   └── Subarea (Upper Hill)
│   └── District (Karen)
└── City (Mombasa)
```

**Property Type Grouping:**
- Apartments - Single units in buildings
- Houses - Standalone residential
- Villas - Luxury residential
- Commercial - Office/retail spaces
- Land - Vacant land plots
- Studio - Single room units

**Complex Grouping:**
- Multiple units grouped by building/complex
- Building amenities shared by units
- Unit-specific customizations

### 5. SEO & Discoverability

**SEO Optimization:**
- Dynamic meta tags (title, description, OG image)
- JSON-LD structured data for properties
- Canonical URLs for all listings
- XML sitemap generation
- Location-based SEO keywords
- Long-tail keyword optimization

**Example:**
```
URL: /apartments/nairobi/westlands/2-bedroom
Meta Title: 2 Bedroom Apartment in Westlands, Nairobi | Kaimosi
Meta Description: Modern 2 bedroom apartment with gym and parking in CBD area
OG Image: Property featured image
Schema: Property schema with price, location, bedrooms, etc.
```

### 6. Shareable Property Cards

**Share Features:**
- Generate beautiful preview cards with:
  - Property image
  - Title, price, bedrooms/bathrooms
  - Location
  - Key amenities
  - Call-to-action button
- Share via multiple platforms:
  - WhatsApp with formatted message
  - Facebook with preview
  - Twitter with link
  - Email with details
  - Direct link with tracking

**Share Tracking:**
- Unique share tokens for each share
- Track clicks from shared links
- Collect feedback on shared properties
- Analytics dashboard showing share performance

### 7. Analytics & Market Insights

**Property Performance Metrics:**
- Total views (unique + repeat)
- Favorites/wishlist adds
- Share count and click-through rate
- Contact request count
- Average time on page
- User engagement trend

**Market Analytics:**
- Average price by location/district
- Price trends (up/down/stable)
- Price history charts over time
- Demand heatmap (hot areas)
- Best-performing properties
- New listings tracking

**User Engagement:**
- Search query analytics
- Popular filters
- Conversion rates (views → favorites → contact)
- User retention metrics
- Recommendation performance

## Implementation Details

### Database Queries

**Get Properties with Filters:**
```typescript
const properties = await prisma.property.findMany({
  where: {
    price: { gte: minPrice, lte: maxPrice },
    bedrooms: { in: bedroomPrefs },
    type: { in: typePrefs },
    location: { district: selectedDistrict },
    status: 'AVAILABLE',
  },
  include: {
    images: { where: { imageType: 'photo' }, take: 3 },
    amenities: true,
    location: true,
    analytics: true,
  },
  orderBy: { [sortBy]: sortOrder },
})
```

**Generate Recommendations:**
```typescript
// Calculate match score based on:
// 1. Price range match
// 2. Bedroom/bathroom match
// 3. Amenity match
// 4. Location preference match
// 5. Furnishing preference
// 6. Pet-friendly requirement
// 7. Newness bonus
```

**Track Analytics:**
```typescript
// On property view
await prisma.propertyView.create({
  data: {
    propertyId,
    userId,
    source: 'search', // or 'recommendation', 'direct'
  },
})

// Update analytics aggregates
await prisma.propertyAnalytics.update({
  where: { propertyId },
  data: { totalViews: { increment: 1 } },
})
```

## API Response Examples

### List Properties Response
```json
{
  "properties": [
    {
      "id": "...",
      "title": "2 Bedroom Apartment in CBD",
      "price": 45000,
      "bedrooms": 2,
      "bathrooms": 1,
      "images": [...],
      "location": { "district": "Westlands" },
      "amenities": ["Gym", "Parking", "WiFi"]
    }
  ],
  "facets": {
    "types": [
      { "value": "APARTMENT", "count": 245 },
      { "value": "HOUSE", "count": 89 }
    ],
    "priceRanges": [
      { "min": 0, "max": 30000, "count": 156 },
      { "min": 30000, "max": 60000, "count": 234 }
    ]
  },
  "total": 450,
  "page": 1,
  "hasMore": true
}
```

### Recommendations Response
```json
{
  "recommendations": [
    {
      "id": "...",
      "property": { ... },
      "score": 92,
      "reason": "Matches your preference for 2-bed apartments in Westlands"
    }
  ]
}
```

## Service Classes

### ApartmentPreferencesService
- `getOrCreatePreferences(userId)` - Get or create user preferences
- `updatePreferences(userId, updates)` - Update user preferences
- `addPreferredLocation(userId, locationId)` - Add preferred location
- `generateRecommendations(userId, limit)` - Generate ML recommendations
- `trackSearchQuery(userId, query, filters, results)` - Track search for learning
- `clearExpiredRecommendations()` - Cleanup expired recommendations

## Performance Considerations

**Optimization Strategies:**
1. **Image Optimization:**
   - Use Next.js Image component for automatic optimization
   - Generate thumbnails automatically
   - Lazy load images in gallery
   - WebP format support

2. **Database:**
   - Index commonly filtered fields (price, type, location, status)
   - Aggregate analytics periodically (hourly/daily)
   - Cache popular searches
   - Pagination for large result sets

3. **Frontend:**
   - Virtual scrolling for long lists
   - Debounce filter changes
   - Cache search results
   - Lazy load property details

4. **Search:**
   - Fulltext search on title/description
   - Faceted search with precalculated counts
   - Elasticsearch for advanced search (optional)

## Next Steps

1. **Create API Routes:**
   - Implement `/api/apartments/listings` with filtering
   - Add `/api/apartments/[id]` for details
   - Create `/api/apartments/recommendations` for ML suggestions
   - Implement `/api/apartments/analytics` dashboard

2. **Build UI Pages:**
   - Listings page with filters and gallery
   - Property detail page with full gallery
   - User dashboard for preferences
   - Analytics dashboard

3. **Implement Services:**
   - Create apartment search service
   - Build recommendation engine
   - Analytics aggregation service
   - Notification service for saved searches

4. **Add Third-Party:**
   - Google Maps integration for location viewing
   - Google Schema.org for SEO
   - Analytics tracking (Google Analytics, Mixpanel)
   - Email notifications for saved searches

## Testing

**Key Test Cases:**
- Search with complex filter combinations
- Recommendation accuracy with various user profiles
- Image gallery carousel interactions
- Share link generation and tracking
- Analytics data accuracy
- Price history trending
- Location hierarchy navigation
