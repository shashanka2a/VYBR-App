import { NextRequest, NextResponse } from 'next/server'
import { verifyOtpSchema } from '@/lib/validations/auth'
import { prisma } from '@/lib/prisma'
import { signJWT, getJWTCookieOptions } from '@/lib/auth/jwt'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = verifyOtpSchema.parse(body)
    const { email, code } = validatedData

    // Find valid OTP
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        email,
        code,
        verified: false,
        expiresAt: {
          gt: new Date()
        }
      }
    })

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP code' },
        { status: 400 }
      )
    }

    // Mark OTP as verified
    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { verified: true }
    })

    // Update user as verified
    const user = await prisma.user.update({
      where: { email },
      data: { isVerified: true }
    })

    // Generate JWT token
    const token = await signJWT({
      userId: user.id,
      email: user.email,
      isVerified: true
    })

    // Create response with httpOnly cookie
    const response = NextResponse.json({
      message: 'Email verified successfully',
      user: {
        id: user.id,
        email: user.email,
        isVerified: true
      }
    })

    response.cookies.set('auth-token', token, getJWTCookieOptions())

    return response

  } catch (error: any) {
    console.error('OTP verification error:', error)
    
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