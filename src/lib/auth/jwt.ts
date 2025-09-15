import { SignJWT, jwtVerify } from 'jose'
import { nanoid } from 'nanoid'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'
)

export interface JWTPayload {
  userId: string
  email: string
  isVerified: boolean
  iat?: number
  exp?: number
  jti?: string
}

export async function signJWT(payload: Omit<JWTPayload, 'iat' | 'exp' | 'jti'>) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)

  return token
}

export async function verifyJWT(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as JWTPayload
  } catch (error) {
    throw new Error('Invalid token')
  }
}

export function getJWTCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  }
}