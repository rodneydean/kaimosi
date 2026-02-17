"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const attractions = [
  { id: 1, name: "Maple Grove Park", category: "Parks", featured: true, status: "published" },
  { id: 2, name: "Historic Downtown", category: "Cultural", featured: true, status: "published" },
  { id: 3, name: "Heritage Museum", category: "Museums", featured: false, status: "published" },
  { id: 4, name: "Riverside Amphitheater", category: "Entertainment", featured: false, status: "draft" },
  { id: 5, name: "Botanical Gardens", category: "Parks", featured: true, status: "published" },
]

export function StudioAttractions() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search attractions..." className="pl-10" />
        </div>
        <Button className="gap-2 whitespace-nowrap">
          <Plus className="h-4 w-4" />
          New Attraction
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attractions</CardTitle>
          <CardDescription>Manage town attractions and landmarks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attractions.map((attraction) => (
                  <TableRow key={attraction.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{attraction.name}</TableCell>
                    <TableCell>{attraction.category}</TableCell>
                    <TableCell>
                      <Badge variant={attraction.featured ? "default" : "secondary"}>
                        {attraction.featured ? "Featured" : "Regular"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={attraction.status === "published" ? "default" : "secondary"}>
                        {attraction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
