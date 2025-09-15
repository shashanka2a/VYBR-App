/**
 * Authentication Form Components Tests
 * Tests the React forms for registration, login, and OTP verification
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RegisterForm } from '@/src/components/auth/RegisterForm'
import { LoginForm } from '@/src/components/auth/LoginForm'
import { VerifyOTPForm } from '@/src/components/auth/VerifyOTPForm'

// Mock fetch
global.fetch = jest.fn()

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
}))

// Mock useAuth hook
const mockSetUser = jest.fn()
const mockUseAuth = {
  user: null,
  setUser: mockSetUser,
  logout: jest.fn(),
}

jest.mock('@/src/lib/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth,
}))

describe('Authentication Forms', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockClear()
  })

  describe('RegisterForm', () => {
    it('should render registration form with all fields', () => {
      render(<RegisterForm />)
      
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
    })

    it('should validate .edu email requirement', async () => {
      const user = userEvent.setup()
      render(<RegisterForm />)
      
      const emailInput = screen.getByLabelText(/email/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })
      
      await user.type(emailInput, 'student@gmail.com')
      await user.click(submitButton)
      
      expect(screen.getByText(/please use your \.edu email/i)).toBeInTheDocument()
    })

    it('should validate password strength', async () => {
      const user = userEvent.setup()
      render(<RegisterForm />)
      
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })
      
      await user.type(emailInput, 'student@university.edu')
      await user.type(passwordInput, 'weak')
      await user.click(submitButton)
      
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
    })

    it('should submit valid registration form', async () => {
      const user = userEvent.setup()
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          message: 'Registration successful',
          email: 'student@university.edu'
        }),
      })

      render(<RegisterForm />)
      
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })
      
      await user.type(emailInput, 'student@university.edu')
      await user.type(passwordInput, 'StrongPassword123')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'student@university.edu',
            password: 'StrongPassword123',
          }),
        })
      })
      
      expect(screen.getByText(/registration successful/i)).toBeInTheDocument()
    })
  })

  describe('LoginForm', () => {
    it('should render login form', () => {
      render(<LoginForm />)
      
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    it('should handle successful login', async () => {
      const user = userEvent.setup()
      const mockUserData = {
        id: 'test-user-id',
        email: 'student@university.edu',
        isVerified: true,
      }
      
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          message: 'Login successful',
          user: mockUserData,
        }),
      })

      render(<LoginForm />)
      
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      
      await user.type(emailInput, 'student@university.edu')
      await user.type(passwordInput, 'StrongPassword123')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(mockSetUser).toHaveBeenCalledWith(mockUserData)
      })
    })

    it('should display error for failed login', async () => {
      const user = userEvent.setup()
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({
          error: 'Invalid credentials',
        }),
      })

      render(<LoginForm />)
      
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      
      await user.type(emailInput, 'student@university.edu')
      await user.type(passwordInput, 'WrongPassword')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
      })
    })
  })

  describe('VerifyOTPForm', () => {
    // Mock useSearchParams to return an email
    beforeEach(() => {
      const mockUseSearchParams = require('next/navigation').useSearchParams
      mockUseSearchParams.mockImplementation(() => ({
        get: jest.fn((param) => param === 'email' ? 'student@university.edu' : null),
      }))
    })

    it('should render OTP verification form', () => {
      render(<VerifyOTPForm />)
      
      expect(screen.getByText(/verify your email/i)).toBeInTheDocument()
      expect(screen.getByText(/student@university\.edu/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /verify email/i })).toBeInTheDocument()
    })

    it('should handle successful OTP verification', async () => {
      const user = userEvent.setup()
      const mockUserData = {
        id: 'test-user-id',
        email: 'student@university.edu',
        isVerified: true,
      }
      
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          message: 'Email verified successfully',
          user: mockUserData,
        }),
      })

      render(<VerifyOTPForm />)
      
      // OTP input would be more complex to test due to InputOTP component
      // This is a simplified version focusing on the logic
      const submitButton = screen.getByRole('button', { name: /verify email/i })
      
      // Mock that a 6-digit code was entered
      const form = screen.getByRole('form') || screen.getByTestId('otp-form')
      if (form) {
        fireEvent.submit(form, {
          target: {
            elements: {
              code: { value: '123456' },
              email: { value: 'student@university.edu' }
            }
          }
        })
      }
      
      await waitFor(() => {
        expect(screen.getByText(/email verified successfully/i)).toBeInTheDocument()
      })
    })

    it('should handle resend OTP functionality', async () => {
      const user = userEvent.setup()
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          message: 'Verification code sent successfully',
        }),
      })

      render(<VerifyOTPForm />)
      
      const resendButton = screen.getByRole('button', { name: /resend code/i })
      await user.click(resendButton)
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/auth/resend-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'student@university.edu',
          }),
        })
      })
    })
  })
})