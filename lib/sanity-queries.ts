import { client } from "./sanity"

export interface Attraction {
  _id: string
  name: string
  slug: { current: string }
  category: string
  shortDescription: string
  fullDescription: string
  image?: string
  gallery?: string[]
  hours: string
  admission: string
  address: string
  phone: string
  coordinates: {
    lat: number
    lng: number
  }
  amenities: string[]
  featured: boolean
  order?: number
}

export async function getAllAttractions(): Promise<Attraction[]> {
  const query = `*[_type == "attraction"] | order(order asc, name asc) {
    _id,
    name,
    slug,
    category,
    shortDescription,
    fullDescription,
    "image": image.asset->url,
    "gallery": gallery[].asset->url,
    hours,
    admission,
    address,
    phone,
    coordinates,
    amenities,
    featured,
    order
  }`

  return await client.fetch(query)
}

export async function getAttractionBySlug(slug: string): Promise<Attraction | null> {
  const query = `*[_type == "attraction" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    category,
    shortDescription,
    fullDescription,
    "image": image.asset->url,
    "gallery": gallery[].asset->url,
    hours,
    admission,
    address,
    phone,
    coordinates,
    amenities,
    featured,
    order
  }`

  return await client.fetch(query, { slug })
}

export async function getAttractionsByCategory(category: string): Promise<Attraction[]> {
  if (category === "All") {
    return getAllAttractions()
  }

  const query = `*[_type == "attraction" && category == $category] | order(order asc, name asc) {
    _id,
    name,
    slug,
    category,
    shortDescription,
    fullDescription,
    "image": image.asset->url,
    "gallery": gallery[].asset->url,
    hours,
    admission,
    address,
    phone,
    coordinates,
    amenities,
    featured,
    order
  }`

  return await client.fetch(query, { category })
}

export async function getFeaturedAttractions(): Promise<Attraction[]> {
  const query = `*[_type == "attraction" && featured == true] | order(order asc) [0...3] {
    _id,
    name,
    slug,
    category,
    shortDescription,
    "image": image.asset->url,
    featured
  }`

  return await client.fetch(query)
}

export async function getAttractionCategories(): Promise<string[]> {
  const query = `array::unique(*[_type == "attraction"].category)`
  const categories = await client.fetch<string[]>(query)
  return ["All", ...categories]
}

export async function searchAttractions(searchTerm: string): Promise<Attraction[]> {
  const query = `*[_type == "attraction" && (
    name match $searchTerm + "*" ||
    shortDescription match $searchTerm + "*" ||
    category match $searchTerm + "*"
  )] | order(order asc, name asc) {
    _id,
    name,
    slug,
    category,
    shortDescription,
    "image": image.asset->url,
    featured
  }`

  return await client.fetch(query, { searchTerm })
}
