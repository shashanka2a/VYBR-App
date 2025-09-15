'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { User, Mail, Shield } from 'lucide-react'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check if onboarding is complete
    checkOnboardingStatus()
  }, [])

  const checkOnboardingStatus = async () => {
    try {
      const response = await fetch('/api/onboarding/status')
      if (response.ok) {
        const data = await response.json()
        if (!data.onboardingCompleted) {
          router.push('/onboarding')
        }
      }
    } catch (error) {
      console.error('Failed to check onboarding status:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="font-medium">{user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user?.isVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user?.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Welcome to VYBR!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Your authentication system is now working! You&apos;ve successfully:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>✅ Registered with your .edu email</li>
                <li>✅ Verified your email with OTP</li>
                <li>✅ Logged in securely</li>
                <li>✅ Received httpOnly JWT cookies</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}