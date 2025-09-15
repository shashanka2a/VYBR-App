/**
 * Onboarding Chat Component Tests
 * Tests the AI chat interface for preference collection
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OnboardingChat } from '@/components/onboarding/OnboardingChat'

// Mock fetch
global.fetch = jest.fn()

const mockOnComplete = jest.fn()

describe('OnboardingChat', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockClear()
  })

  it('should render welcome message on first load', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        onboardingCompleted: false,
        chatHistory: [],
      }),
    })

    render(<OnboardingChat onComplete={mockOnComplete} />)
    
    await waitFor(() => {
      expect(screen.getByText(/welcome to vybr/i)).toBeInTheDocument()
      expect(screen.getByText(/what country are you from/i)).toBeInTheDocument()
    })
  })

  it('should load existing chat history', async () => {
    const mockChatHistory = [
      {
        role: 'assistant',
        content: 'What country are you from?',
        timestamp: new Date().toISOString(),
      },
      {
        role: 'user',
        content: 'I am from India',
        timestamp: new Date().toISOString(),
      },
      {
        role: 'assistant',
        content: 'Great! What is your age?',
        timestamp: new Date().toISOString(),
      },
    ]

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        onboardingCompleted: false,
        chatHistory: mockChatHistory,
      }),
    })

    render(<OnboardingChat onComplete={mockOnComplete} />)
    
    await waitFor(() => {
      expect(screen.getByText(/what country are you from/i)).toBeInTheDocument()
      expect(screen.getByText(/i am from india/i)).toBeInTheDocument()
      expect(screen.getByText(/what is your age/i)).toBeInTheDocument()
    })
  })

  it('should send user message and receive AI response', async () => {
    const user = userEvent.setup()
    
    // Mock initial status call
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        onboardingCompleted: false,
        chatHistory: [],
      }),
    })
    
    // Mock chat API call
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        message: 'Nice to meet you! What is your age range?',
        isComplete: false,
      }),
    })

    render(<OnboardingChat onComplete={mockOnComplete} />)
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument()
    })
    
    const input = screen.getByPlaceholderText(/type your message/i)
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    await user.type(input, 'I am from United States')
    await user.click(sendButton)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/onboarding/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'I am from United States',
        }),
      })
    })
    
    await waitFor(() => {
      expect(screen.getByText(/nice to meet you/i)).toBeInTheDocument()
    })
  })

  it('should handle onboarding completion', async () => {
    const user = userEvent.setup()
    
    // Mock initial status call
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        onboardingCompleted: false,
        chatHistory: [],
      }),
    })
    
    // Mock chat API call that completes onboarding
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        message: 'Perfect! You are all set! 🎉',
        isComplete: true,
        preferences: {
          nationality: 'United States',
          budgetMin: 800,
          budgetMax: 1200,
        },
      }),
    })

    render(<OnboardingChat onComplete={mockOnComplete} />)
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument()
    })
    
    const input = screen.getByPlaceholderText(/type your message/i)
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    await user.type(input, 'That sounds perfect!')
    await user.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText(/onboarding complete/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /continue to dashboard/i })).toBeInTheDocument()
    })
    
    // Test that onComplete is called after delay
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled()
    }, { timeout: 3000 })
  })

  it('should handle API errors gracefully', async () => {
    const user = userEvent.setup()
    
    // Mock initial status call
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        onboardingCompleted: false,
        chatHistory: [],
      }),
    })
    
    // Mock failed chat API call
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<OnboardingChat onComplete={mockOnComplete} />)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument()
    })
    
    const input = screen.getByPlaceholderText(/type your message/i)
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    await user.type(input, 'Hello')
    await user.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText(/having trouble connecting/i)).toBeInTheDocument()
    })
  })

  it('should prevent empty messages', async () => {
    const user = userEvent.setup()
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        onboardingCompleted: false,
        chatHistory: [],
      }),
    })

    render(<OnboardingChat onComplete={mockOnComplete} />)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument()
    })
    
    const sendButton = screen.getByRole('button', { name: /send/i })
    expect(sendButton).toBeDisabled()
    
    const input = screen.getByPlaceholderText(/type your message/i)
    await user.type(input, '   ')  // Whitespace only
    
    expect(sendButton).toBeDisabled()
  })

  it('should handle Enter key to send message', async () => {
    const user = userEvent.setup()
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        onboardingCompleted: false,
        chatHistory: [],
      }),
    })
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        message: 'Thanks for sharing!',
        isComplete: false,
      }),
    })

    render(<OnboardingChat onComplete={mockOnComplete} />)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument()
    })
    
    const input = screen.getByPlaceholderText(/type your message/i)
    
    await user.type(input, 'Hello AI!')
    await user.keyboard('{Enter}')
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/onboarding/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Hello AI!',
        }),
      })
    })
  })
})