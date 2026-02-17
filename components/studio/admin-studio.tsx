"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Package,
  MapPin,
  UtensilsCrossed,
  Store,
  Bed,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudioOverview } from "./studio-overview"
import { StudioProducts } from "./studio-products"
import { StudioAttractions } from "./studio-attractions"
import { StudioDirectory } from "./studio-directory"
import { StudioUsers } from "./studio-users"
import { StudioAnalytics } from "./studio-analytics"
import { StudioSettings } from "./studio-settings"

const navigationItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "attractions", label: "Attractions", icon: MapPin },
  { id: "restaurants", label: "Restaurants", icon: UtensilsCrossed },
  { id: "stores", label: "Stores & Shops", icon: Store },
  { id: "accommodations", label: "Accommodations", icon: Bed },
  { id: "users", label: "Users", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
]

export function AdminStudio() {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <StudioOverview />
      case "products":
        return <StudioProducts />
      case "attractions":
        return <StudioAttractions />
      case "restaurants":
      case "stores":
      case "accommodations":
        return <StudioDirectory type={activeTab} />
      case "users":
        return <StudioUsers />
      case "analytics":
        return <StudioAnalytics />
      case "settings":
        return <StudioSettings />
      default:
        return <StudioOverview />
    }
  }

  const activeItem = navigationItems.find((item) => item.id === activeTab)
  const ActiveIcon = activeItem?.icon || LayoutDashboard

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex items-center justify-between px-4 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold">Maplewood</p>
                <p className="text-xs text-muted-foreground">Studio</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Admin Mode
            </Badge>
            <Button variant="ghost" size="icon" className="hover:bg-destructive/10">
              <LogOut className="h-5 w-5 text-destructive" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "block" : "hidden"
          } w-full border-r border-border/40 bg-card/50 backdrop-blur sm:max-w-sm lg:sticky lg:top-[73px] lg:block lg:h-[calc(100vh-73px)] lg:max-w-xs lg:overflow-y-auto`}
        >
          <nav className="space-y-1 p-4 lg:p-6">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`group relative w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {isActive && <ChevronRight className="h-4 w-4" />}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            {/* Breadcrumb & Title */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <span>Studio</span>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground font-medium">{activeItem?.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <ActiveIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{activeItem?.label}</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage {activeItem?.label?.toLowerCase()} content and settings
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="animate-in fade-in duration-300">{renderContent()}</div>
          </div>
        </main>
      </div>
    </div>
  )
}
