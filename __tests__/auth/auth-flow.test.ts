/**
 * Authentication Flow Integration Tests
 * Tests the complete auth flow: register -> verify OTP -> login -> logout
 */

import { NextRequest, NextResponse } from 'next/server'

// Mock Prisma client
const mockUser = {
  id: 'test-user-id',
  email: 'student@university.edu',
  password: '$2a$12$hashed.password',
  isVerified: false,
  onboardingCompleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
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
}

jest.mock('@/lib/prisma', () => ({
  prisma: mockPrisma
}))

// Mock email sending
jest.mock('@/lib/auth/email', () => ({
  sendOTPEmail: jest.fn().mockResolvedValue({ success: true })
}))

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('$2a$12$hashed.password'),
  compare: jest.fn().mockResolvedValue(true),
}))

describe('Authentication Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Registration', () => {
    it('should register a new user with .edu email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)
      mockPrisma.user.upsert.mockResolvedValue(mockUser)
      mockPrisma.otpCode.create.mockResolvedValue(mockOtpCode)

      const { POST } = await import('@/app/api/auth/register/route')
      
      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: 'student@university.edu',
          password: 'StrongPassword123'
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toContain('Registration successful')
      expect(mockPrisma.user.upsert).toHaveBeenCalledWith({
        where: { email: 'student@university.edu' },
        update: expect.any(Object),
        create: expect.any(Object),
      })
      expect(mockPrisma.otpCode.create).toHaveBeenCalled()
    })

    it('should reject non-.edu emails', async () => {
      const { POST } = await import('@/app/api/auth/register/route')
      
      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: 'student@gmail.com',
          password: 'StrongPassword123'
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid input data')
    })

    it('should reject weak passwords', async () => {
      const { POST } = await import('@/app/api/auth/register/route')
      
      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: 'student@university.edu',
          password: 'weak'
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid input data')
    })
  })

  describe('OTP Verification', () => {
    it('should verify valid OTP code', async () => {
      mockPrisma.otpCode.findFirst.mockResolvedValue(mockOtpCode)
      mockPrisma.otpCode.update.mockResolvedValue({ ...mockOtpCode, verified: true })
      mockPrisma.user.update.mockResolvedValue({ ...mockUser, isVerified: true })

      const { POST } = await import('@/app/api/auth/verify-otp/route')
      
      const request = new NextRequest('http://localhost:3000/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({
          email: 'student@university.edu',
          code: '123456'
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toContain('verified successfully')
      expect(data.user.isVerified).toBe(true)
      expect(response.cookies.get('auth-token')).toBeDefined()
    })

    it('should reject invalid OTP code', async () => {
      mockPrisma.otpCode.findFirst.mockResolvedValue(null)

      const { POST } = await import('@/app/api/auth/verify-otp/route')
      
      const request = new NextRequest('http://localhost:3000/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({
          email: 'student@university.edu',
          code: '000000'
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Invalid or expired OTP')
    })
  })

  describe('Login', () => {
    it('should login verified user with correct credentials', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, isVerified: true })

      const { POST } = await import('@/app/api/auth/login/route')
      
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'student@university.edu',
          password: 'StrongPassword123'
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toContain('Login successful')
      expect(response.cookies.get('auth-token')).toBeDefined()
    })

    it('should reject unverified user login', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser)

      const { POST } = await import('@/app/api/auth/login/route')
      
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'student@university.edu',
          password: 'StrongPassword123'
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toContain('verify your email')
    })
  })

  describe('Logout', () => {
    it('should successfully logout user', async () => {
      const { POST } = await import('@/app/api/auth/logout/route')
      
      const request = new NextRequest('http://localhost:3000/api/auth/logout', {
        method: 'POST',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Logout successful')
      
      const authCookie = response.cookies.get('auth-token')
      expect(authCookie?.value).toBe('')
      expect(authCookie?.maxAge).toBe(0)
    })
  })
})