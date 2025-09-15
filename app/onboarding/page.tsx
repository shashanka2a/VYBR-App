'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { OnboardingChat } from '@/components/onboarding/OnboardingChat'
import { Loader2 } from 'lucide-react'

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    checkOnboardingStatus()
  }, [])

  const checkOnboardingStatus = async () => {
    try {
      const response = await fetch('/api/onboarding/status')
      if (response.ok) {
        const data = await response.json()
        if (data.onboardingCompleted) {
          router.push('/dashboard')
        } else {
          setShouldShowOnboarding(true)
        }
      } else {
        // If not authenticated, redirect to login
        router.push('/auth/login')
      }
    } catch (error) {
      console.error('Failed to check onboarding status:', error)
      router.push('/auth/login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOnboardingComplete = () => {
    router.push('/dashboard')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!shouldShowOnboarding) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <OnboardingChat onComplete={handleOnboardingComplete} />
    </div>
  )
}