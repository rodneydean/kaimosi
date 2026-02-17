"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Save, AlertCircle } from "lucide-react"

export function StudioSettings() {
  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Configure basic site settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="site-name">Site Name</Label>
            <Input id="site-name" defaultValue="Maplewood" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-desc">Site Description</Label>
            <Textarea id="site-desc" defaultValue="Welcome to Maplewood - a charming town with rich heritage" rows={4} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-email">Contact Email</Label>
            <Input id="contact-email" type="email" defaultValue="admin@maplewood.town" />
          </div>
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Controls</CardTitle>
          <CardDescription>Enable or disable features on your site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Marketplace", description: "Show product marketplace" },
            { label: "WhatsApp Sharing", description: "Enable share card functionality" },
            { label: "User Submissions", description: "Allow community to submit content" },
            { label: "Comments", description: "Enable comments on attractions" },
          ].map((feature) => (
            <div key={feature.label} className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">{feature.label}</p>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <CardTitle>Security Settings</CardTitle>
          </div>
          <CardDescription>Manage security and backup options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            Generate API Keys
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            Backup Data
          </Button>
          <Button variant="destructive" className="w-full justify-start">
            Clear Cache
          </Button>
        </CardContent>
      </Card>

      {/* Version Info */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Maplewood Version</span>
            <Badge>v1.0.0</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Database Status</span>
            <Badge variant="default" className="bg-green-600">
              Connected
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">API Status</span>
            <Badge variant="default" className="bg-green-600">
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
