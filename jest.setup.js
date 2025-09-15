import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    }
  },
  usePathname() {
    return ''
  },
}))

// Mock environment variables
process.env.OPENAI_API_KEY = 'test-openai-key'
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing'
process.env.GMAIL_USER = 'test@example.com'
process.env.GMAIL_APP_PASSWORD = 'test-password'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'