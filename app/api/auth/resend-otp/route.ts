import { NextRequest, NextResponse } from 'next/server'
import { requestOtpSchema } from '@/lib/validations/auth'
import { prisma } from '@/lib/prisma'
import { sendOTPEmail } from '@/lib/auth/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = requestOtpSchema.parse(body)
    const { email } = validatedData

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.isVerified) {
      return NextResponse.json(
        { error: 'User is already verified' },
        { status: 400 }
      )
    }

    // Generate new 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Delete any existing OTP codes for this email
    await prisma.otpCode.deleteMany({
      where: {
        email,
        type: 'EMAIL_VERIFICATION'
      }
    })

    // Create new OTP record
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
      message: 'Verification code sent successfully'
    })

  } catch (error: any) {
    console.error('Resend OTP error:', error)
    
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