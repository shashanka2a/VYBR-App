/**
 * End-to-End Integration Tests
 * Tests the complete flow from registration to AI onboarding completion
 */

import { NextRequest } from 'next/server'

// Mock all external dependencies
const mockUser = {
  id: 'test-user-id',
  email: 'student@university.edu',
  password: '$2a$12$hashed.password',
  isVerified: false,
  onboardingCompleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockVerifiedUser = {
  ...mockUser,
  isVerified: true,
}

const mockCompletedUser = {
  ...mockVerifiedUser,
  onboardingCompleted: true,
}

const mockOtpCode = {
  id: 'test-otp-id',
  code: '123456',
  email: 'student@university.edu',
  expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  verified: false,
  type: 'EMAIL_VERIFICATION',
  createdAt: new Date(),
}

const mockPreferences = {
  id: 'test-preferences-id',
  userId: 'test-user-id',
  nationality: 'India',
  age: 21,
  lifestyle: ['social', 'studious'],
  budgetMin: 600,
  budgetMax: 1000,
  housingType: ['off_campus'],
  amenities: ['gym', 'furnished', 'wifi'],
  petFriendly: false,
  smokingAllowed: false,
  internationalFriendly: true,
  chatHistory: [],
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    upsert: jest.fn(),
  },
  otpCode: {
    create: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    deleteMany: jest.fn(),
  },
  userPreferences: {
    upsert: jest.fn(),
  },
}

jest.mock('@/lib/prisma', () => ({
  prisma: mockPrisma
}))

jest.mock('@/lib/auth/email', () => ({
  sendOTPEmail: jest.fn().mockResolvedValue({ success: true })
}))

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('$2a$12$hashed.password'),
  compare: jest.fn().mockResolvedValue(true),
}))

jest.mock('openai', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn(),
        },
      },
    })),
  }
})

describe('Complete Authentication + Onboarding Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.OPENAI_API_KEY = 'test-key'
    process.env.JWT_SECRET = 'test-secret'
  })

  it('should complete entire user journey from registration to onboarding', async () => {
    // Step 1: User Registration
    mockPrisma.user.findUnique.mockResolvedValueOnce(null) // User doesn't exist
    mockPrisma.user.upsert.mockResolvedValueOnce(mockUser)
    mockPrisma.otpCode.create.mockResolvedValueOnce(mockOtpCode)

    const { POST: registerPost } = await import('@/app/api/auth/register/route')
    
    const registerRequest = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'student@university.edu',
        password: 'StrongPassword123'
      }),
    })

    const registerResponse = await registerPost(registerRequest)
    const registerData = await registerResponse.json()

    expect(registerResponse.status).toBe(200)
    expect(registerData.message).toContain('Registration successful')

    // Step 2: OTP Verification
    mockPrisma.otpCode.findFirst.mockResolvedValueOnce(mockOtpCode)
    mockPrisma.otpCode.update.mockResolvedValueOnce({ ...mockOtpCode, verified: true })
    mockPrisma.user.update.mockResolvedValueOnce(mockVerifiedUser)

    const { POST: verifyPost } = await import('@/app/api/auth/verify-otp/route')
    
    const verifyRequest = new NextRequest('http://localhost:3000/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({
        email: 'student@university.edu',
        code: '123456'
      }),
    })

    const verifyResponse = await verifyPost(verifyRequest)
    const verifyData = await verifyResponse.json()

    expect(verifyResponse.status).toBe(200)
    expect(verifyData.user.isVerified).toBe(true)
    expect(verifyResponse.cookies.get('auth-token')).toBeDefined()

    // Step 3: Check Onboarding Status (should redirect to onboarding)
    const authToken = 'valid-jwt-token' // Would be real JWT in practice
    mockPrisma.user.findUnique.mockResolvedValueOnce({
      ...mockVerifiedUser,
      preferences: null
    })

    const { GET: statusGet } = await import('@/app/api/onboarding/status/route')
    
    const statusRequest = new NextRequest('http://localhost:3000/api/onboarding/status', {
      headers: {
        Cookie: `auth-token=${authToken}`
      }
    })

    const statusResponse = await statusGet(statusRequest)
    const statusData = await statusResponse.json()

    expect(statusData.onboardingCompleted).toBe(false)
    expect(statusData.hasPreferences).toBe(false)

    // Step 4: AI Chat Onboarding - First Message
    mockPrisma.user.findUnique.mockResolvedValueOnce({
      ...mockVerifiedUser,
      preferences: null
    })
    mockPrisma.userPreferences.upsert.mockResolvedValueOnce(mockPreferences)

    const mockOpenAI = require('openai').default
    const mockCreate = mockOpenAI.mock.results[0].value.chat.completions.create
    mockCreate.mockResolvedValueOnce({
      choices: [{
        message: {
          content: JSON.stringify({
            message: "Nice to meet you! What's your age range?",
            isComplete: false,
            extractedPreferences: { nationality: 'India' }
          })
        }
      }]
    })

    const { POST: chatPost } = await import('@/app/api/onboarding/chat/route')
    
    const chatRequest1 = new NextRequest('http://localhost:3000/api/onboarding/chat', {
      method: 'POST',
      headers: {
        Cookie: `auth-token=${authToken}`
      },
      body: JSON.stringify({
        message: "I'm from India"
      }),
    })

    const chatResponse1 = await chatPost(chatRequest1)
    const chatData1 = await chatResponse1.json()

    expect(chatResponse1.status).toBe(200)
    expect(chatData1.message).toContain('age range')
    expect(chatData1.isComplete).toBe(false)

    // Step 5: AI Chat Onboarding - Complete Conversation
    const userWithPartialPrefs = {
      ...mockVerifiedUser,
      preferences: { ...mockPreferences, nationality: 'India' }
    }
    mockPrisma.user.findUnique.mockResolvedValueOnce(userWithPartialPrefs)
    mockPrisma.userPreferences.upsert.mockResolvedValueOnce(mockPreferences)
    mockPrisma.user.update.mockResolvedValueOnce(mockCompletedUser)

    mockCreate.mockResolvedValueOnce({
      choices: [{
        message: {
          content: JSON.stringify({
            message: "Perfect! I have all your preferences now. You're all set! 🎉",
            isComplete: true,
            extractedPreferences: {
              nationality: 'India',
              age: 21,
              lifestyle: ['social', 'studious'],
              budgetMin: 600,
              budgetMax: 1000,
              housingType: ['off_campus'],
              amenities: ['gym', 'furnished', 'wifi'],
              internationalFriendly: true
            }
          })
        }
      }]
    })

    const chatRequest2 = new NextRequest('http://localhost:3000/api/onboarding/chat', {
      method: 'POST',
      headers: {
        Cookie: `auth-token=${authToken}`
      },
      body: JSON.stringify({
        message: "I'm 21, looking for social but studious environment, budget 600-1000, prefer off-campus with gym and furnished"
      }),
    })

    const chatResponse2 = await chatPost(chatRequest2)
    const chatData2 = await chatResponse2.json()

    expect(chatResponse2.status).toBe(200)
    expect(chatData2.isComplete).toBe(true)
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'test-user-id' },
      data: { onboardingCompleted: true }
    })

    // Step 6: Final Status Check (should show completed)
    mockPrisma.user.findUnique.mockResolvedValueOnce({
      ...mockCompletedUser,
      preferences: mockPreferences
    })

    const finalStatusRequest = new NextRequest('http://localhost:3000/api/onboarding/status', {
      headers: {
        Cookie: `auth-token=${authToken}`
      }
    })

    const finalStatusResponse = await statusGet(finalStatusRequest)
    const finalStatusData = await finalStatusResponse.json()

    expect(finalStatusData.onboardingCompleted).toBe(true)
    expect(finalStatusData.hasPreferences).toBe(true)
    expect(finalStatusData.preferences.nationality).toBe('India')
    expect(finalStatusData.preferences.budgetMin).toBe(600)
    expect(finalStatusData.preferences.internationalFriendly).toBe(true)

    // Verify all steps were completed properly
    expect(mockPrisma.user.upsert).toHaveBeenCalled() // Registration
    expect(mockPrisma.otpCode.create).toHaveBeenCalled() // OTP creation
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'test-user-id' },
      data: { isVerified: true }
    }) // Email verification
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'test-user-id' },
      data: { onboardingCompleted: true }
    }) // Onboarding completion
    expect(mockPrisma.userPreferences.upsert).toHaveBeenCalled() // Preferences saved
  })

  it('should handle authentication failures at each step', async () => {
    // Test unauthenticated onboarding access
    const { POST: chatPost } = await import('@/app/api/onboarding/chat/route')
    
    const unauthenticatedRequest = new NextRequest('http://localhost:3000/api/onboarding/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: "Hello"
      }),
    })

    const response = await chatPost(unauthenticatedRequest)
    expect(response.status).toBe(401)

    // Test invalid OTP
    mockPrisma.otpCode.findFirst.mockResolvedValueOnce(null)

    const { POST: verifyPost } = await import('@/app/api/auth/verify-otp/route')
    
    const invalidOtpRequest = new NextRequest('http://localhost:3000/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({
        email: 'student@university.edu',
        code: '000000'
      }),
    })

    const invalidResponse = await verifyPost(invalidOtpRequest)
    expect(invalidResponse.status).toBe(400)
  })

  it('should handle OpenAI API failures gracefully', async () => {
    const authToken = 'valid-jwt-token'
    mockPrisma.user.findUnique.mockResolvedValueOnce({
      ...mockVerifiedUser,
      preferences: null
    })

    // Mock OpenAI failure
    const mockOpenAI = require('openai').default
    const mockCreate = mockOpenAI.mock.results[0].value.chat.completions.create
    mockCreate.mockRejectedValueOnce(new Error('OpenAI API Error'))

    const { POST: chatPost } = await import('@/app/api/onboarding/chat/route')
    
    const chatRequest = new NextRequest('http://localhost:3000/api/onboarding/chat', {
      method: 'POST',
      headers: {
        Cookie: `auth-token=${authToken}`
      },
      body: JSON.stringify({
        message: "Hello"
      }),
    })

    const response = await chatPost(chatRequest)
    expect(response.status).toBe(500)
  })
})