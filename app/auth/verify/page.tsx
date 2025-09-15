'use client'

import { VerifyOTPForm } from '@/components/auth/VerifyOTPForm'

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <VerifyOTPForm />
    </div>
  )
}