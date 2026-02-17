"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const trafficData = [
  { date: "Mon", visits: 400, users: 240, bounceRate: 24 },
  { date: "Tue", visits: 520, users: 320, bounceRate: 18 },
  { date: "Wed", visits: 780, users: 520, bounceRate: 16 },
  { date: "Thu", visits: 620, users: 380, bounceRate: 22 },
  { date: "Fri", visits: 890, users: 650, bounceRate: 14 },
  { date: "Sat", visits: 650, users: 420, bounceRate: 20 },
  { date: "Sun", visits: 420, users: 280, bounceRate: 26 },
]

const pageViews = [
  { name: "Homepage", views: 2400 },
  { name: "Attractions", views: 1800 },
  { name: "Marketplace", views: 1200 },
  { name: "Directory", views: 980 },
  { name: "Contact", views: 420 },
]

const COLORS = ["#2d5f3f", "#4a9d6f", "#7ab88a", "#a8d5ba", "#d4e8df"]

export function StudioAnalytics() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Page Views</p>
            <p className="mt-2 text-3xl font-bold">8,892</p>
            <p className="mt-1 text-xs text-green-600">+12% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Avg. Session Duration</p>
            <p className="mt-2 text-3xl font-bold">3m 24s</p>
            <p className="mt-1 text-xs text-green-600">+8% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Bounce Rate</p>
            <p className="mt-2 text-3xl font-bold">32.4%</p>
            <p className="mt-1 text-xs text-red-600">+3% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Overview</CardTitle>
          <CardDescription>Visits and unique users this week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
              <Legend />
              <Bar dataKey="visits" fill="#2d5f3f" radius={[8, 8, 0, 0]} />
              <Bar dataKey="users" fill="#7ab88a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Page Views and Pie Chart */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most viewed pages this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={pageViews}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#2d5f3f"
                  strokeWidth={2}
                  dot={{ fill: "#2d5f3f" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Page Distribution</CardTitle>
            <CardDescription>Traffic distribution across pages</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pageViews} cx="50%" cy="50%" labelLine={false} label dataKey="views">
                  {pageViews.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
