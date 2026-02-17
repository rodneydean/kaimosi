# Content Management Guide for Sanity CMS

## For Content Editors

### Getting Started

1. Access Sanity Studio: http://localhost:3000/studio (local) or https://manage.sanity.io (production)
2. Log in with your Sanity account
3. Select "Attractions" from the left sidebar

### Creating a New Attraction

#### Step 1: Basic Information

1. Click "Create" → "Attraction"
2. Enter **Attraction Name** (required, 3-100 characters)
3. The **URL Slug** will auto-generate; you can customize it
4. Click "Create & Edit" to continue

#### Step 2: Description

1. **Short Description** (required, max 200 chars):
   - Use for preview cards and lists
   - Be concise and engaging
   - Example: "A 200-acre natural sanctuary featuring hiking trails and scenic waterfalls"

2. **Full Description** (required, block content):
   - Use the rich text editor
   - Add paragraphs, headings, bold, italics
   - Include key information and visitor details
   - Format with line breaks for readability

#### Step 3: Images

1. **Hero Image** (required):
   - Click upload or drag-and-drop
   - Recommended size: 1200x600px
   - Formats: JPG, PNG, WebP
   - Use high-quality, well-lit photos
   - Adjust crop/focal point if needed

2. **Gallery Images** (optional, max 12):
   - Add multiple photos showing different aspects
   - Organize in desired order
   - Can reorder by drag-and-drop
   - All images should have good quality and focal points

#### Step 4: Category & Details

1. **Category** (required):
   - Select from: Parks & Recreation, Cultural & Historic, Museums, Entertainment, Food & Drink
   - Choose the most appropriate category

2. **Highlights** (optional, max 5):
   - Key selling points or features
   - Examples: "Scenic Waterfall", "Hiking Trails", "Picnic Area"
   - Appears as badges on detail page

3. **Best Time to Visit**:
   - Seasonal recommendations
   - Examples: "Spring for wildflowers", "Fall for foliage"

#### Step 5: Location & Contact

1. **Location** (required):
   - Enter street address
   - City defaults to "Maplewood"
   - Add ZIP code
   - **GPS Coordinates** (required):
     - Use Google Maps to find: right-click → coordinates
     - Latitude: -90 to +90 (North/South)
     - Longitude: -180 to +180 (East/West)
   - Custom map embed (optional)

2. **Contact Information**:
   - Phone: "(555) 234-5678" format
   - Email: "info@attraction.com"
   - Website: "https://..."
   - Reservations: Phone or URL

3. **Social Media**:
   - Facebook, Instagram, Twitter/X, YouTube, TikTok
   - Full URLs required

#### Step 6: Hours & Pricing

1. **Hours of Operation**:
   - Add a schedule for each day of the week
   - Mark as "Closed" if applicable
   - Use 24-hour format: "09:00" to "17:00"
   - Add seasonal notes if hours vary
   - Examples:
     - Regular hours: 9AM-5PM
     - Summer hours: 6AM-9PM
     - Winter hours: 10AM-4PM

2. **Admission & Pricing**:
   - Select admission type: Free / Paid / Donation / Membership
   - If paid, enter base price (USD assumed)
   - Add detailed pricing:
     - Example: "Adults $15, Seniors $12, Children $8"

#### Step 7: Amenities

1. Click "Add Amenity"
2. Choose from existing amenities or create new ones:
   - Parking, WiFi, Wheelchair Accessible, Restrooms, Restaurant, Gift Shop, etc.
3. Each amenity has an icon and category (Accessibility, Dining, Facilities, etc.)

#### Step 8: SEO & Social

1. **Meta Description** (max 160 chars):
   - Appears in Google search results
   - Write compelling summary
   - Include key terms

2. **Keywords**:
   - Add 5-10 relevant keywords
   - Examples: "hiking", "waterfall", "nature trail"

3. **OG Image**:
   - Social media sharing image
   - Recommended: 1200x630px
   - Use engaging photos

4. **OG Description**:
   - Text when shared on social media
   - Different from meta description is OK

#### Step 9: Publishing

1. **Featured**:
   - Toggle ON to show on homepage
   - Only featured attractions appear in main carousel

2. **Display Order**:
   - Lower numbers appear first
   - Set to 1 for homepage featured attractions

3. **Publish**:
   - Click "Publish" to make live immediately
   - Or save as draft to publish later
   - Published content appears in the app after cache refresh (max 60 seconds)

### Editing an Existing Attraction

1. Click on attraction name in list
2. Make changes in the editor
3. Changes save automatically (look for green checkmark)
4. Click "Publish" to update live version
5. Previous versions are automatically saved

### Deleting an Attraction

1. Open the attraction
2. Click three-dot menu → "Delete"
3. Confirm deletion
4. Document is moved to trash
5. Can be recovered for 24 hours

### Best Practices

#### Photography

✅ **Good**:
- Well-lit, high-resolution photos
- Clear, interesting subjects
- Consistent style
- Include people for scale

❌ **Avoid**:
- Blurry or dark images
- Extremely wide angles
- Irrelevant background clutter

#### Descriptions

✅ **Good**:
- Clear, concise language
- Highlight unique features
- Include practical details (hours, admission)
- Use formatting (bold, headings)

❌ **Avoid**:
- Overly long paragraphs
- Marketing hype without substance
- Missing important details
- Plain walls of text

#### SEO

✅ **Do**:
- Include location in description
- Use natural keywords
- Write compelling meta descriptions
- Update OG images for social sharing

❌ **Don't**:
- Keyword stuff
- Copy descriptions from other sites
- Leave SEO fields blank
- Use tiny or irrelevant OG images

### Keyboard Shortcuts

- **Cmd/Ctrl + S**: Save (auto-save is on)
- **Cmd/Ctrl + Enter**: Publish
- **Tab**: Navigate to next field
- **Shift + Tab**: Navigate to previous field

### Bulk Operations

#### Importing Multiple Attractions

Contact your developer for bulk import:
1. Prepare CSV or JSON with attraction data
2. Developer runs import script
3. Documents appear in studio
4. Review and publish from studio

#### Exporting Data

Export all attractions via Sanity CLI:
```bash
sanity dataset export production > attractions-backup.ndjson
```

## For Developers

### TypeScript Types

```typescript
// types/attraction.ts
export interface Attraction {
  _id: string
  _type: 'attraction'
  name: string
  slug: {current: string}
  category: {_ref: string}
  shortDescription: string
  fullDescription: Block[]
  heroImage: SanityImage
  gallery: SanityImage[]
  location: Location
  operatingHours: OperatingHours
  contact: ContactInfo
  socialMedia: SocialLinks
  pricing: Pricing
  amenities: {_ref: string}[]
  highlights: string[]
  featured: boolean
  seo: SEOSettings
}
```

### Common GROQ Queries

**Get all attractions**:
```groq
*[_type == "attraction"] | order(displayOrder asc)
```

**Get featured attractions**:
```groq
*[_type == "attraction" && featured == true] | order(displayOrder asc) | [0...6]
```

**Get by category**:
```groq
*[_type == "attraction" && category->slug.current == "parks-recreation"]
```

**Get single by slug**:
```groq
*[_type == "attraction" && slug.current == "maple-grove-park"][0]
```

### Content Webhooks

Set up webhooks to auto-deploy:
1. Go to Sanity project settings
2. Navigate to Webhooks
3. Add webhook URL from your deployment platform
4. Trigger on: "Create", "Update", "Delete"
5. Redeploy app on content changes

## Troubleshooting

### Content not appearing in app

1. **Wait for cache**: ISR revalidates every 60 seconds
2. **Check publication**: Is document published? (not just drafted)
3. **Verify slug**: Check URL slug matches query
4. **Clear browser cache**: Hard refresh (Cmd/Ctrl + Shift + R)
5. **Check app logs**: Look for GROQ query errors

### Image not uploading

1. **Check file size**: Keep under 10MB
2. **Verify format**: JPG, PNG, or WebP
3. **Check permissions**: Ensure API token has editor role
4. **Try PNG**: Sometimes JPG has upload issues

### Slug already exists

1. **Unique slugs required**: Each slug must be unique
2. **Solution**: Modify the slug slightly (add -2, -updated, etc.)
3. **Check conflicts**: Search studio for similar names

### Field validation errors

1. **Check required fields**: Red asterisks indicate required
2. **Field limits**: Check character counts
3. **Format errors**: Verify phone, email, URL formats
4. **Coordinate ranges**: Latitude -90 to 90, Longitude -180 to 180

## Support

- Sanity Docs: https://www.sanity.io/docs
- Studio Keyboard Shortcuts: Press ? in studio
- API Documentation: https://www.sanity.io/docs/api
- GROQ Reference: https://www.sanity.io/docs/groq
```
