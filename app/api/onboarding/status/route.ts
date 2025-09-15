import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/auth/jwt'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payload = await verifyJWT(token)
    const userId = payload.userId

    // Get user onboarding status
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { preferences: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      onboardingCompleted: user.onboardingCompleted,
      hasPreferences: !!user.preferences,
      chatHistory: user.preferences?.chatHistory || [],
      preferences: user.preferences ? {
        nationality: user.preferences.nationality,
        age: user.preferences.age,
        lifestyle: user.preferences.lifestyle,
        budgetMin: user.preferences.budgetMin,
        budgetMax: user.preferences.budgetMax,
        housingType: user.preferences.housingType,
        amenities: user.preferences.amenities,
        petFriendly: user.preferences.petFriendly,
        smokingAllowed: user.preferences.smokingAllowed,
        internationalFriendly: user.preferences.internationalFriendly,
      } : null
    })

  } catch (error: any) {
    console.error('Get onboarding status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}