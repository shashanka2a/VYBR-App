import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/auth/jwt'
import { prisma } from '@/lib/prisma'
import { OnboardingAI, type OnboardingMessage } from '@/lib/openai'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { message } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Get user and preferences
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

    // Get existing chat history
    const existingHistory: OnboardingMessage[] = (user.preferences?.chatHistory as unknown as OnboardingMessage[]) || []

    // Add user message to history
    const userMessage: OnboardingMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    }

    const updatedHistory = [...existingHistory, userMessage]

    // Generate AI response
    const aiResponse = await OnboardingAI.generateResponse(
      updatedHistory,
      user.preferences ? {
        nationality: user.preferences.nationality || undefined,
        age: user.preferences.age || undefined,
        lifestyle: user.preferences.lifestyle || undefined,
        budgetMin: user.preferences.budgetMin || undefined,
        budgetMax: user.preferences.budgetMax || undefined,
        housingType: user.preferences.housingType || undefined,
        amenities: user.preferences.amenities || undefined,
        petFriendly: user.preferences.petFriendly,
        smokingAllowed: user.preferences.smokingAllowed,
        internationalFriendly: user.preferences.internationalFriendly
      } : undefined
    )

    // Add AI response to history
    const assistantMessage: OnboardingMessage = {
      role: 'assistant', 
      content: aiResponse.message,
      timestamp: new Date()
    }

    const finalHistory = [...updatedHistory, assistantMessage]

    // Extract preferences from conversation if AI indicates completion
    let extractedPreferences = aiResponse.preferences
    if (aiResponse.isComplete && finalHistory.length > 4) {
      extractedPreferences = await OnboardingAI.extractPreferences(finalHistory)
    }

    // Update or create user preferences
    await prisma.userPreferences.upsert({
      where: { userId },
      update: {
        chatHistory: finalHistory as any,
        nationality: extractedPreferences.nationality || user.preferences?.nationality || null,
        age: extractedPreferences.age || user.preferences?.age || null,
        lifestyle: extractedPreferences.lifestyle || user.preferences?.lifestyle || [],
        budgetMin: extractedPreferences.budgetMin || user.preferences?.budgetMin || null,
        budgetMax: extractedPreferences.budgetMax || user.preferences?.budgetMax || null,
        housingType: extractedPreferences.housingType || user.preferences?.housingType || [],
        amenities: extractedPreferences.amenities || user.preferences?.amenities || [],
        petFriendly: extractedPreferences.petFriendly ?? user.preferences?.petFriendly ?? false,
        smokingAllowed: extractedPreferences.smokingAllowed ?? user.preferences?.smokingAllowed ?? false,
        internationalFriendly: extractedPreferences.internationalFriendly ?? user.preferences?.internationalFriendly ?? false,
      },
      create: {
        userId,
        chatHistory: finalHistory as any,
        nationality: extractedPreferences.nationality || null,
        age: extractedPreferences.age || null,
        lifestyle: extractedPreferences.lifestyle || [],
        budgetMin: extractedPreferences.budgetMin || null,
        budgetMax: extractedPreferences.budgetMax || null,
        housingType: extractedPreferences.housingType || [],
        amenities: extractedPreferences.amenities || [],
        petFriendly: extractedPreferences.petFriendly || false,
        smokingAllowed: extractedPreferences.smokingAllowed || false,
        internationalFriendly: extractedPreferences.internationalFriendly || false,
      }
    })

    // If onboarding is complete, update user
    if (aiResponse.isComplete) {
      await prisma.user.update({
        where: { id: userId },
        data: { onboardingCompleted: true }
      })
    }

    return NextResponse.json({
      message: aiResponse.message,
      isComplete: aiResponse.isComplete,
      preferences: extractedPreferences
    })

  } catch (error: any) {
    console.error('Onboarding chat error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}