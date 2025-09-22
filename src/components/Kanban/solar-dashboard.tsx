import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { KanbanBoard } from "../Kanban/kanban-board"
import {
  ChevronDown,
  ChevronUp,
  Plus,
  BarChart3,
  DollarSign,
  Percent,
  TrendingUp,
  ExternalLink,
  FileText,
  Wrench,
  Settings,
} from "lucide-react"
import { useState } from "react"

export function SolarDashboard() {
  const [productSpecsExpanded, setProductSpecsExpanded] = useState(true)
  const [productAssetsExpanded, setProductAssetsExpanded] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      {/* <div className="w-64 bg-gray-800 text-white flex flex-col"> */}
        {/* Logo */}
        {/* <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="font-semibold text-lg">SunTech Solutions</span>
          </div>
        </div> */}

        {/* App Selector */}
        {/* <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div>
              <div className="text-xs">App</div>
              <div className="text-white font-medium">INTERNAL</div>
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-white">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div> */}

        {/* Search */}
        {/* <div className="px-6 py-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-gray-700 text-white placeholder-gray-400 px-3 py-2 rounded-md text-sm border-0 focus:ring-2 focus:ring-green-500"
          />
        </div> */}

        {/* Navigation */}
        {/* <nav className="flex-1 px-6">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center gap-3 px-3 py-2 rounded-md w-full text-left ${
                  activeTab === "dashboard"
                    ? "text-green-400 bg-gray-700"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("products")}
                className={`flex items-center gap-3 px-3 py-2 rounded-md w-full text-left ${
                  activeTab === "products"
                    ? "text-green-400 bg-gray-700"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                <Settings className="h-4 w-4" />
                Products
              </button>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
              >
                <DollarSign className="h-4 w-4" />
                Sales
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
              >
                <TrendingUp className="h-4 w-4" />
                Inventory
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
              >
                <Wrench className="h-4 w-4" />
                Installation Partners
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
              >
                <FileText className="h-4 w-4" />
                Financials
              </a>
            </li>
          </ul>
        </nav> */}

        {/* User Profile */}
        {/* <div className="p-6 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/professional-woman-diverse.png" />
              <AvatarFallback>JP</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white">Julia Peterson</div>
              <div className="text-xs text-gray-400 truncate">julia@blackstone.com</div>
            </div>
          </div>
        </div> */}
      {/* </div> */}

      {/* Main Content */}
      <div className="flex-1 flex">
        <div className="flex-1 overflow-auto">
          {activeTab === "dashboard" ? (
            <div className="h-full">
              <div className="p-6 border-b border-gray-200 bg-white">
                <h1 className="text-2xl font-bold text-gray-900">Project Dashboard</h1>
                <p className="text-gray-600 mt-1">Track and manage your solar panel projects</p>
              </div>
              <KanbanBoard />
            </div>
          ) : (
            <>
              {/* Hero Section */}
              <div className="relative h-48 bg-gradient-to-r from-blue-900 to-blue-700">
                <img src="/placeholder-gbfre.png" alt="Solar Panel Nova" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="absolute inset-0 flex items-center justify-between px-8">
                  <div className="text-white">
                    <div className="text-sm opacity-80 mb-2">ISO 9001:2015</div>
                    <h1 className="text-3xl font-bold mb-2">Solar Panel Nova</h1>
                    <p className="text-lg opacity-90">
                      High-efficiency solar panels designed for residential and commercial use
                    </p>
                  </div>
                  <Button className="bg-white text-gray-900 hover:bg-gray-100">
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Order
                  </Button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="border-b border-gray-200 bg-white">
                <nav className="flex px-8">
                  <button className="px-4 py-4 text-sm font-medium text-green-600 border-b-2 border-green-600">
                    Overview
                  </button>
                  <button className="px-4 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">Sales</button>
                  <button className="px-4 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                    Installation
                  </button>
                  <button className="px-4 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                    Certification
                  </button>
                  <button className="px-4 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                    Financials
                  </button>
                </nav>
              </div>

              {/* Metrics Cards */}
              <div className="p-8">
                <div className="grid grid-cols-4 gap-6 mb-8">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <BarChart3 className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">Production price</span>
                      </div>
                      <div className="text-2xl font-bold">$300</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">Selling Price</span>
                      </div>
                      <div className="text-2xl font-bold">$600</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Percent className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">Margin</span>
                      </div>
                      <div className="text-2xl font-bold">100%</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">Gross Profit</span>
                      </div>
                      <div className="text-2xl font-bold">$300</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sales Overview */}
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-6">Sales overview</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Sales</span>
                        <span className="font-semibold">$10,000,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Average Monthly Sales</span>
                        <span className="font-semibold">$500,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Top Markets</span>
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            CALIFORNIA
                          </Badge>
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            TEXAS
                          </Badge>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            NEW YORK
                          </Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Customer Satisfaction</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full">
                            <div className="w-[93%] h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <span className="font-semibold">93%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Installation Overview */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-6">Installation overview</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Avg. Installation Price</span>
                        <span className="font-semibold">$15,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Avg. Installation Time</span>
                        <span className="font-semibold">2-3 days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Installation Partners</span>
                        <div className="flex gap-2">
                          <Badge variant="outline">SOLARWORKS LLC</Badge>
                          <Badge variant="outline">ECOSOLAR SOLUTIONS</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>

        {/* Right Sidebar - only show for products tab */}
        {activeTab === "products" && (
          <div className="w-80 bg-white border-l border-gray-200 p-6">
            {/* Product Specs */}
            <div className="mb-6">
              <button
                onClick={() => setProductSpecsExpanded(!productSpecsExpanded)}
                className="flex items-center justify-between w-full text-left mb-4"
              >
                <h3 className="text-lg font-semibold">Product specs</h3>
                {productSpecsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {productSpecsExpanded && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Type</span>
                    <Badge className="bg-orange-100 text-orange-800">PV SOLAR PANEL</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Efficiency</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div className="w-[22%] h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="font-semibold">22%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Power Output</span>
                    <span className="font-semibold">400 Watts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Dimensions</span>
                    <span className="font-semibold">78.5 × 39.5 × 1.4 inches</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Weight</span>
                    <span className="font-semibold">49.6 lbs</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Warranty</span>
                    <span className="font-semibold">25 years</span>
                  </div>
                </div>
              )}
            </div>

            {/* Product Assets */}
            <div>
              <button
                onClick={() => setProductAssetsExpanded(!productAssetsExpanded)}
                className="flex items-center justify-between w-full text-left mb-4"
              >
                <h3 className="text-lg font-semibold">Product assets</h3>
                {productAssetsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {productAssetsExpanded && (
                <div className="space-y-3">
                  <a href="#" className="flex items-center gap-3 text-green-600 hover:text-green-700">
                    <div className="w-5 h-5 border border-green-600 rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-600 rounded-sm"></div>
                    </div>
                    <span className="text-sm">Product Images</span>
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                  <a href="#" className="flex items-center gap-3 text-green-600 hover:text-green-700">
                    <FileText className="h-5 w-5" />
                    <span className="text-sm">Brochure</span>
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                  <a href="#" className="flex items-center gap-3 text-green-600 hover:text-green-700">
                    <Wrench className="h-5 w-5" />
                    <span className="text-sm">Installation Guide</span>
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                  <a href="#" className="flex items-center gap-3 text-green-600 hover:text-green-700">
                    <Settings className="h-5 w-5" />
                    <span className="text-sm">Technical Specifications</span>
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
