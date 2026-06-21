import { NextResponse } from 'next/server'
import { signToken } from '@/lib/session'

// Simple in-memory rate limiting map: IP -> { count, resetTime }
const rateLimit = new Map<string, { count: number; resetTime: number }>()

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown-ip'
    const now = Date.now()
    const limitRecord = rateLimit.get(ip)

    if (limitRecord && now < limitRecord.resetTime) {
      if (limitRecord.count >= 5) {
        return NextResponse.json({ error: 'Too many attempts, please try again later.' }, { status: 429 })
      }
      limitRecord.count++
    } else {
      rateLimit.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 }) // 15 minutes window
    }

    const { password } = await request.json()
    
    // 2. Strict Password Check (No Fallback)
    const targetPassword = process.env.MARKETING_DASHBOARD_PASSWORD
    if (!targetPassword) {
      return NextResponse.json(
        { error: 'Not configured' },
        { status: 500 }
      )
    }

    if (password === targetPassword) {
      // Clear rate limit on success
      rateLimit.delete(ip)

      const response = NextResponse.json({ success: true })
      
      // Issue JWT
      const token = await signToken({ admin: true })

      // Set secure HTTP-only cookie
      response.cookies.set('dako_marketing_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      return response
    }

    return NextResponse.json(
      { error: 'Invalid password' },
      { status: 401 }
    )
  } catch (error: any) {
    console.error('Auth API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
