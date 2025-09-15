/**
 * AI Chat Onboarding Tests
 * Tests the AI-powered preference collection system
 */

import { NextRequest } from 'next/server'
import { OnboardingAI } from '@/lib/openai'

// Mock OpenAI
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

// Mock JWT verification
jest.mock('@/lib/auth/jwt', () => ({
  verifyJWT: jest.fn().mockResolvedValue({
    userId: 'test-user-id',
    email: 'student@university.edu',
    isVerified: true,
  }),
}))

const mockUser = {
  id: 'test-user-id',
  email: 'student@university.edu',
  isVerified: true,
  onboardingCompleted: false,
  preferences: null,
}

const mockUserPreferences = {
  id: 'test-preferences-id',
  userId: 'test-user-id',
  nationality: 'United States',
  age: 20,
  lifestyle: ['social', 'studious'],
  budgetMin: 800,
  budgetMax: 1200,
  housingType: ['off_campus'],
  amenities: ['gym', 'pool'],
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
    update: jest.fn(),
  },
  userPreferences: {
    upsert: jest.fn(),
  },
}

jest.mock('@/lib/prisma', () => ({
  prisma: mockPrisma
}))

describe('AI Chat Onboarding', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.OPENAI_API_KEY = 'test-key'
  })

  describe('Chat API Endpoint', () => {
    it('should handle first message and start conversation', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser)
      mockPrisma.userPreferences.upsert.mockResolvedValue(mockUserPreferences)

      // Mock OpenAI response
      const mockOpenAI = require('openai').default
      const mockCreate = mockOpenAI.mock.results[0].value.chat.completions.create
      mockCreate.mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              message: "Nice to meet you! What's your age range, if you're comfortable sharing?",
              isComplete: false,
              extractedPreferences: { nationality: 'United States' }
            })
          }
        }]
      })

      const { POST } = await import('@/app/api/onboarding/chat/route')
      
      const request = new NextRequest('http://localhost:3000/api/onboarding/chat', {
        method: 'POST',
        headers: {
          Cookie: 'auth-token=valid-jwt-token'
        },
        body: JSON.stringify({
          message: "I'm from the United States"
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toContain('age range')
      expect(data.isComplete).toBe(false)
      expect(mockPrisma.userPreferences.upsert).toHaveBeenCalled()
    })

    it('should complete onboarding when conversation is done', async () => {
      const completedUser = { ...mockUser, preferences: mockUserPreferences }
      mockPrisma.user.findUnique.mockResolvedValue(completedUser)
      mockPrisma.userPreferences.upsert.mockResolvedValue(mockUserPreferences)
      mockPrisma.user.update.mockResolvedValue({ ...mockUser, onboardingCompleted: true })

      // Mock OpenAI response indicating completion
      const mockOpenAI = require('openai').default
      const mockCreate = mockOpenAI.mock.results[0].value.chat.completions.create
      mockCreate.mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              message: "Perfect! I have all your preferences. You're all set! 🎉",
              isComplete: true,
              extractedPreferences: {
                nationality: 'United States',
                age: 20,
                lifestyle: ['social', 'studious'],
                budgetMin: 800,
                budgetMax: 1200
              }
            })
          }
        }]
      })

      const { POST } = await import('@/app/api/onboarding/chat/route')
      
      const request = new NextRequest('http://localhost:3000/api/onboarding/chat', {
        method: 'POST',
        headers: {
          Cookie: 'auth-token=valid-jwt-token'
        },
        body: JSON.stringify({
          message: "That sounds perfect, thank you!"
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.isComplete).toBe(true)
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'test-user-id' },
        data: { onboardingCompleted: true }
      })
    })

    it('should require authentication', async () => {
      const { POST } = await import('@/app/api/onboarding/chat/route')
      
      const request = new NextRequest('http://localhost:3000/api/onboarding/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: "Hello"
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })

  describe('Status API Endpoint', () => {
    it('should return onboarding status for authenticated user', async () => {
      const userWithPreferences = {
        ...mockUser,
        preferences: mockUserPreferences
      }
      mockPrisma.user.findUnique.mockResolvedValue(userWithPreferences)

      const { GET } = await import('@/app/api/onboarding/status/route')
      
      const request = new NextRequest('http://localhost:3000/api/onboarding/status', {
        headers: {
          Cookie: 'auth-token=valid-jwt-token'
        },
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.onboardingCompleted).toBe(false)
      expect(data.hasPreferences).toBe(true)
      expect(data.preferences.nationality).toBe('United States')
    })
  })

  describe('OnboardingAI Class', () => {
    it('should generate appropriate responses', async () => {
      const mockOpenAI = require('openai').default
      const mockCreate = mockOpenAI.mock.results[0].value.chat.completions.create
      
      mockCreate.mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              message: "Great! What's your budget range for housing per month?",
              isComplete: false,
              extractedPreferences: { age: 20 }
            })
          }
        }]
      })

      const messages = [
        {
          role: 'assistant' as const,
          content: "What country are you from?",
          timestamp: new Date()
        },
        {
          role: 'user' as const,
          content: "I'm from India",
          timestamp: new Date()
        }
      ]

      const response = await OnboardingAI.generateResponse(messages)

      expect(response.message).toContain('budget')
      expect(response.isComplete).toBe(false)
    })

    it('should extract preferences from conversation', async () => {
      const mockOpenAI = require('openai').default
      const mockCreate = mockOpenAI.mock.results[0].value.chat.completions.create
      
      mockCreate.mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              nationality: 'India',
              age: 21,
              lifestyle: ['social', 'studious'],
              budgetMin: 600,
              budgetMax: 900,
              housingType: ['off_campus'],
              amenities: ['gym', 'furnished'],
              internationalFriendly: true
            })
          }
        }]
      })

      const conversation = [
        {
          role: 'user' as const,
          content: "I'm from India, 21 years old, looking for social but studious environment",
          timestamp: new Date()
        }
      ]

      const preferences = await OnboardingAI.extractPreferences(conversation)

      expect(preferences.nationality).toBe('India')
      expect(preferences.age).toBe(21)
      expect(preferences.internationalFriendly).toBe(true)
    })
  })
})