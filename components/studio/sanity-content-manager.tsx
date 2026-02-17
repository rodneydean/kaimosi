'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Database,
  Upload,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Search,
  Filter,
  Eye,
  EyeOff,
  Trash2,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface SanityDocument {
  _id: string
  _type: string
  name?: string
  title?: string
  status: 'published' | 'draft' | 'scheduled'
  updatedAt: string
  createdAt: string
}

export function SanityContentManager() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('documents')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [documents, setDocuments] = useState<SanityDocument[]>([
    {
      _id: 'attraction-1',
      _type: 'attraction',
      name: 'Maple Grove Park',
      status: 'published',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'attraction-2',
      _type: 'attraction',
      name: 'Historic Downtown District',
      status: 'draft',
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      _id: 'product-1',
      _type: 'product',
      title: 'Premium Coffee Blend',
      status: 'published',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  ])

  const handlePublish = async (id: string) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setDocuments(
        documents.map((doc) =>
          doc._id === id ? { ...doc, status: 'published' as const } : doc
        )
      )
      toast({
        title: 'Success',
        description: 'Document published successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to publish document',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUnpublish = async (id: string) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setDocuments(
        documents.map((doc) =>
          doc._id === id ? { ...doc, status: 'draft' as const } : doc
        )
      )
      toast({
        title: 'Success',
        description: 'Document unpublished successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to unpublish document',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: 'Success',
        description: 'Content synced successfully',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const data = JSON.stringify(documents, null, 2)
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sanity-backup-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast({
        title: 'Success',
        description: 'Content exported successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export content',
        variant: 'destructive',
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'draft':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      published: 'default',
      draft: 'secondary',
      scheduled: 'outline',
    }
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>
  }

  const filteredDocuments = documents.filter(
    (doc) =>
      (doc.name?.toLowerCase() || doc.title?.toLowerCase()).includes(
        searchQuery.toLowerCase()
      ) || doc._type.includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Database className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Sanity CMS Management</h1>
        </div>
        <p className="text-muted-foreground">
          Manage, publish, and sync your Sanity CMS content directly from the admin dashboard
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
            <p className="text-3xl font-bold">{documents.length}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Published</p>
            <p className="text-3xl font-bold text-green-600">
              {documents.filter((d) => d.status === 'published').length}
            </p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Drafts</p>
            <p className="text-3xl font-bold text-yellow-600">
              {documents.filter((d) => d.status === 'draft').length}
            </p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Document Types</p>
            <p className="text-3xl font-bold">
              {new Set(documents.map((d) => d._type)).size}
            </p>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="publishing">Publishing</TabsTrigger>
          <TabsTrigger value="sync">Sync & Export</TabsTrigger>
          <TabsTrigger value="info">Info</TabsTrigger>
        </TabsList>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card className="p-4">
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Updated</th>
                    <th className="text-right py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc) => (
                    <tr key={doc._id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">{doc.name || doc.title}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{doc._type}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(doc.status)}
                          {getStatusBadge(doc.status)}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(doc.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          {doc.status === 'draft' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handlePublish(doc._id)}
                              disabled={loading}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          {doc.status === 'published' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleUnpublish(doc._id)}
                              disabled={loading}
                            >
                              <EyeOff className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Publishing Tab */}
        <TabsContent value="publishing" className="space-y-4">
          <Card className="p-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-4">Batch Publishing</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Manage publishing status for multiple documents at once.
              </p>
              <div className="space-y-2">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Publish All Drafts ({documents.filter((d) => d.status === 'draft').length})
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <EyeOff className="h-4 w-4 mr-2" />
                  Unpublish All Documents
                </Button>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Publishing History</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Maple Grove Park</p>
                    <p className="text-xs text-muted-foreground">Published 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Premium Coffee Blend</p>
                    <p className="text-xs text-muted-foreground">Saved as draft 1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Sync & Export Tab */}
        <TabsContent value="sync" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Sync Content
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Synchronize content from Sanity with your application cache.
                </p>
                <Button
                  onClick={handleSync}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Syncing...' : 'Sync Now'}
                </Button>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Content
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Download all content as JSON for backup or migration.
                </p>
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  Export JSON
                </Button>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Import Content
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Import content from a JSON backup file.
                </p>
                <Button variant="outline" className="w-full bg-transparent">
                  Choose File
                </Button>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Last Sync</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your content was last synced:
                </p>
                <p className="text-sm font-medium">
                  {new Date().toLocaleString()}
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-4">
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold">Project Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Project ID</p>
                <p className="font-mono bg-muted p-2 rounded text-xs break-all">
                  i8clm8fg
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Dataset</p>
                <p className="font-mono bg-muted p-2 rounded">production</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">API Version</p>
                <p className="font-mono bg-muted p-2 rounded">2024-12</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Environment</p>
                <p className="font-mono bg-muted p-2 rounded">Production</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="font-semibold">Content Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Attractions</span>
                <Badge>{documents.filter((d) => d._type === 'attraction').length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Products</span>
                <Badge>{documents.filter((d) => d._type === 'product').length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Size</span>
                <Badge variant="outline">~2.4 MB</Badge>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
