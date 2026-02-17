import type { Metadata } from "next"
import { AdminStudio } from "@/components/studio/admin-studio"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Studio | Maplewood Admin",
  description: "Admin studio for managing content, products, attractions, and users.",
}

export default function StudioPage() {
  // In a real app, check if user is admin
  // For now, we'll allow access
  return <AdminStudio />
}
