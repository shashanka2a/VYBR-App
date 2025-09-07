"use client"

import * as React from "react"
import { useState } from "react"
import { Home, Building2, Users, Calendar, MapPin, Menu, X } from "lucide-react"
import { Button } from "./button"
import { cn } from "./utils"

interface DesktopNavbarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  className?: string
}

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "housing", label: "Housing", icon: Building2 },
  { id: "roomies", label: "Roomies", icon: Users },
  { id: "events", label: "Events", icon: Calendar },
  { id: "communities", label: "Communities", icon: MapPin },
]

export function DesktopNavbar({ activeTab, onTabChange, className }: DesktopNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className={cn(
      "bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm",
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="text-xl font-bold gradient-text">VYBR</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id || 
                (item.id === "home" && activeTab === "home") ||
                (item.id === "housing" && activeTab === "chat") ||
                (item.id === "communities" && activeTab === "home")
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => {
                    // Map desktop nav to existing tabs
                    if (item.id === "housing") onTabChange("chat")
                    else if (item.id === "communities") onTabChange("home")
                    else onTabChange(item.id)
                  }}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200",
                    isActive 
                      ? "bg-indigo-50 text-indigo-600 font-medium" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              )
            })}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" className="text-gray-600">
              Sign In
            </Button>
            <Button 
              variant="gradient" 
              size="sm"
              className="tap-feedback"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id || 
                (item.id === "home" && activeTab === "home") ||
                (item.id === "housing" && activeTab === "chat") ||
                (item.id === "communities" && activeTab === "home")
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => {
                    if (item.id === "housing") onTabChange("chat")
                    else if (item.id === "communities") onTabChange("home")
                    else onTabChange(item.id)
                    setIsMobileMenuOpen(false)
                  }}
                  className={cn(
                    "w-full justify-start space-x-3 px-4 py-3 rounded-lg",
                    isActive 
                      ? "bg-indigo-50 text-indigo-600 font-medium" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Button>
              )
            })}
            
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
              <Button variant="gradient" className="w-full">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}