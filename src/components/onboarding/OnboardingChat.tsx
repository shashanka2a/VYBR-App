'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Loader2, Send, Bot, User } from 'lucide-react'

interface ChatMessage {
  role: 'assistant' | 'user'
  content: string
  timestamp: Date
}

interface OnboardingChatProps {
  onComplete: () => void
}

export function OnboardingChat({ onComplete }: OnboardingChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Load existing chat history
    loadChatHistory()
  }, [])

  const loadChatHistory = async () => {
    try {
      const response = await fetch('/api/onboarding/status')
      if (response.ok) {
        const data = await response.json()
        if (data.chatHistory && data.chatHistory.length > 0) {
          setMessages(data.chatHistory.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })))
          setIsComplete(data.onboardingCompleted)
        } else {
          // Start conversation
          startConversation()
        }
      }
    } catch (error) {
      console.error('Failed to load chat history:', error)
      startConversation()
    }
  }

  const startConversation = () => {
    const welcomeMessage: ChatMessage = {
      role: 'assistant',
      content: "Hi there! 👋 I'm VYBR's AI assistant, and I'm excited to help you find the perfect housing match! Let's start by learning about your background. What country are you from? 🌍",
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/onboarding/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsComplete(data.isComplete)

      if (data.isComplete) {
        setTimeout(() => {
          onComplete()
        }, 2000)
      }

    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again!",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to VYBR! 🎉</h2>
        <p className="text-gray-600">Let's personalize your housing experience with a quick chat</p>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col p-4">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 bg-blue-500">
                    <AvatarFallback>
                      <Bot className="h-4 w-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>

                {message.role === 'user' && (
                  <Avatar className="h-8 w-8 bg-green-500">
                    <AvatarFallback>
                      <User className="h-4 w-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 bg-blue-500">
                  <AvatarFallback>
                    <Bot className="h-4 w-4 text-white" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          {!isComplete && (
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={sendMessage} 
                disabled={!input.trim() || isLoading}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}

          {isComplete && (
            <div className="text-center">
              <p className="text-green-600 font-medium mb-2">✅ Onboarding Complete!</p>
              <Button onClick={onComplete} className="w-full">
                Continue to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}