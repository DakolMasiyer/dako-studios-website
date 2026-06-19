import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    
    const targetPassword = process.env.MARKETING_DASHBOARD_PASSWORD || 'dako-grow-2026'

    if (password === targetPassword) {
      const response = NextResponse.json({ success: true })
      
      // Set secure HTTP-only cookie
      response.cookies.set('dako_marketing_token', 'dako_authorized_session_2026', {
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
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}
