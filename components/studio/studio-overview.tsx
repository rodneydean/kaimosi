"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Package,
  MapPin,
  Users,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", visitors: 400, revenue: 2400, orders: 24 },
  { month: "Feb", visitors: 500, revenue: 2210, orders: 22 },
  { month: "Mar", visitors: 600, revenue: 2290, orders: 29 },
  { month: "Apr", visitors: 800, revenue: 2000, orders: 20 },
  { month: "May", visitors: 1000, revenue: 2181, orders: 31 },
  { month: "Jun", visitors: 900, revenue: 2500, orders: 35 },
]

const stats = [
  { label: "Total Products", value: "248", change: "+12%", icon: Package, color: "bg-blue-500/10" },
  { label: "Active Attractions", value: "42", change: "+5%", icon: MapPin, color: "bg-green-500/10" },
  { label: "Total Users", value: "1,234", change: "+23%", icon: Users, color: "bg-purple-500/10" },
  { label: "Monthly Revenue", value: "$12,450", change: "+18%", icon: TrendingUp, color: "bg-amber-500/10" },
]

export function StudioOverview() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
                    <div className="mt-2 flex items-center gap-1">
                      <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-700">
                        <ArrowUpRight className="mr-1 h-3 w-3" />
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Visitors Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Visitor Trends</CardTitle>
                <CardDescription>Last 6 months</CardDescription>
              </div>
              <Badge variant="secondary">Last 30 days</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2d5f3f" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2d5f3f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="#2d5f3f"
                  fillOpacity={1}
                  fill="url(#colorVisitors)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Last 6 months</CardDescription>
              </div>
              <Badge variant="secondary">Last 30 days</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2d5f3f"
                  strokeWidth={2}
                  dot={{ fill: "#2d5f3f" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New product added: "Artisan Coffee"</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <Badge>New</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
