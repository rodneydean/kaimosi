export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "i8clm8fg"
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"
export const apiVersion = "2024-01-01"
export const useCdn = process.env.NODE_ENV === "production"
export const token = process.env.SANITY_API_TOKEN
