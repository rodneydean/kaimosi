import type { Metadata } from 'next'
import { SanityContentManager } from '@/components/studio/sanity-content-manager'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sanity CMS Management | Admin Studio',
  description: 'Manage Sanity CMS content, publish documents, and sync data',
}

export default function SanityAdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Studio
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <SanityContentManager />
      </div>
    </div>
  )
}
