"use client"

import * as React from "react"
import { Button } from "./button"
import { cn } from "./utils"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-8 space-y-4",
      className
    )}>
      {icon && (
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-2">
          {icon}
        </div>
      )}
      
      <div className="space-y-2">
        <h3 className="heading-3 text-gray-900">{title}</h3>
        <p className="body-normal text-gray-600 max-w-sm">{description}</p>
      </div>
      
      {action && (
        <Button 
          onClick={action.onClick}
          className="button-primary tap-feedback mt-4"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}

// Predefined empty states for common scenarios
export function NoCommunitiesFound() {
  return (
    <EmptyState
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      }
      title="No Communities Found"
      description="We couldn't find any communities matching your criteria. Try adjusting your filters or search terms."
      action={{
        label: "Clear Filters",
        onClick: () => console.log("Clear filters")
      }}
    />
  )
}

export function NoEventsFound() {
  return (
    <EmptyState
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      }
      title="No Events Available"
      description="There are no events scheduled at the moment. Check back later or create your own event!"
      action={{
        label: "Create Event",
        onClick: () => console.log("Create event")
      }}
    />
  )
}

export function NoMatchesFound() {
  return (
    <EmptyState
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      }
      title="No More Profiles"
      description="You've seen all available roommate profiles! We'll notify you when new people join."
      action={{
        label: "Invite Friends",
        onClick: () => console.log("Invite friends")
      }}
    />
  )
}

export function ChatWelcome() {
  return (
    <EmptyState
      icon={
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
          AI
        </div>
      }
      title="Welcome to VYBR AI!"
      description="I'm here to help you find the perfect housing, connect with roommates, and discover campus events. What can I help you with today?"
      className="py-12"
    />
  )
}