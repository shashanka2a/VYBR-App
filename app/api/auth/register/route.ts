import { NextRequest, NextResponse } from 'next/server'
import { registerSchema } from '@/lib/validations/auth'
import { prisma } from '@/lib/prisma'
import { sendOTPEmail } from '@/lib/auth/email'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)
    const { email, password } = validatedData

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser && existingUser.isVerified) {
      return NextResponse.json(
        { error: 'User already exists and is verified' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Create or update user
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        isVerified: false,
      },
      create: {
        email,
        password: hashedPassword,
        isVerified: false,
      }
    })

    // Create OTP record
    await prisma.otpCode.create({
      data: {
        code: otpCode,
        email,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        type: 'EMAIL_VERIFICATION',
      }
    })

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otpCode, 'EMAIL_VERIFICATION' as any)
    
    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Registration successful. Please check your email for the verification code.',
      email
    })

  } catch (error: any) {
    console.error('Registration error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}