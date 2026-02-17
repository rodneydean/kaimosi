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

const products = [
  { id: 1, name: "Maple Syrup Bundle", price: "$24.99", stock: 145, status: "published" },
  { id: 2, name: "Heritage Collection", price: "$89.99", stock: 32, status: "published" },
  { id: 3, name: "Artisan Coffee", price: "$12.99", stock: 8, status: "draft" },
  { id: 4, name: "Local Honey", price: "$18.99", stock: 56, status: "published" },
  { id: 5, name: "Craft Merchandise", price: "$34.99", stock: 0, status: "out_of_stock" },
]

export function StudioProducts() {
  return (
    <div className="space-y-6">
      {/* Header with Search and Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-10" />
        </div>
        <Button className="gap-2 whitespace-nowrap">
          <Plus className="h-4 w-4" />
          New Product
        </Button>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>Manage your marketplace products and inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>
                      <Badge variant={product.stock === 0 ? "destructive" : "secondary"}>
                        {product.stock} units
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.status === "published"
                            ? "default"
                            : product.status === "draft"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {product.status}
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
