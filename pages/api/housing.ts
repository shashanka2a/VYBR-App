import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Proxy request to backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000'
    const queryString = new URLSearchParams(req.query as Record<string, string>).toString()
    const url = `${backendUrl}/api/housing${queryString ? `?${queryString}` : ''}`
    
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
    })

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`)
    }

    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    console.error('API proxy error:', error)
    res.status(500).json({ error: 'Failed to fetch housing data' })
  }
}