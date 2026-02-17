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

interface StudioDirectoryProps {
  type: "restaurants" | "stores" | "accommodations"
}

const items = {
  restaurants: [
    { id: 1, name: "The Maple Kitchen", rating: 4.8, reviews: 234, status: "published" },
    { id: 2, name: "Heritage Bistro", rating: 4.6, reviews: 189, status: "published" },
    { id: 3, name: "Downtown Cafe", rating: 4.5, reviews: 156, status: "draft" },
  ],
  stores: [
    { id: 1, name: "Artisan Boutique", type: "Fashion", status: "published" },
    { id: 2, name: "Vintage Books", type: "Books", status: "published" },
    { id: 3, name: "Local Crafts", type: "Crafts", status: "draft" },
  ],
  accommodations: [
    { id: 1, name: "Maple Inn & Suites", rooms: 45, status: "published" },
    { id: 2, name: "Historic Manor B&B", rooms: 8, status: "published" },
    { id: 3, name: "Downtown Hostel", rooms: 20, status: "draft" },
  ],
}

export function StudioDirectory({ type }: StudioDirectoryProps) {
  const typeLabel = type === "restaurants" ? "Restaurants" : type === "stores" ? "Stores" : "Accommodations"
  const data = items[type]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={`Search ${typeLabel}...`} className="pl-10" />
        </div>
        <Button className="gap-2 whitespace-nowrap">
          <Plus className="h-4 w-4" />
          Add {typeLabel}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{typeLabel}</CardTitle>
          <CardDescription>Manage {typeLabel.toLowerCase()} listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>{type === "restaurants" ? "Rating" : type === "stores" ? "Type" : "Rooms"}</TableHead>
                  <TableHead>{type === "restaurants" ? "Reviews" : "Status"}</TableHead>
                  {type === "restaurants" && <TableHead>Status</TableHead>}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item: any) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      {type === "restaurants" ? (
                        <Badge variant="secondary">{item.rating} ⭐</Badge>
                      ) : type === "stores" ? (
                        item.type
                      ) : (
                        <Badge variant="secondary">{item.rooms} rooms</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {type === "restaurants" ? (
                        <span className="text-sm">{item.reviews} reviews</span>
                      ) : (
                        <Badge variant={item.status === "published" ? "default" : "secondary"}>
                          {item.status}
                        </Badge>
                      )}
                    </TableCell>
                    {type === "restaurants" && (
                      <TableCell>
                        <Badge variant={item.status === "published" ? "default" : "secondary"}>
                          {item.status}
                        </Badge>
                      </TableCell>
                    )}
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
