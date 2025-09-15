import { z } from 'zod'

// Email validation schema - requires .edu domain
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .refine(
    (email) => email.endsWith('.edu'),
    'Please use your .edu email address'
  )

// Registration schema
export const registerSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
})

// OTP verification schema
export const verifyOtpSchema = z.object({
  email: emailSchema,
  code: z
    .string()
    .length(6, 'OTP code must be 6 digits')
    .regex(/^\d{6}$/, 'OTP code must contain only numbers'),
})

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

// Request OTP schema
export const requestOtpSchema = z.object({
  email: emailSchema,
})

// Types
export type RegisterInput = z.infer<typeof registerSchema>
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RequestOtpInput = z.infer<typeof requestOtpSchema>