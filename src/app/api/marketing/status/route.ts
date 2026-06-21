import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/session'
import { getContentState, saveContentState } from '@/utils/marketing-data'

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('dako_marketing_token')
    
    if (!token?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token.value)
    if (!payload?.admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { id, type, status, publishedUrl } = body

    if (!id || !type || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const state = getContentState()
    const key = type === 'post' ? `post_${id}` : `copy_${id}`

    state[key] = {
      status,
      publishedUrl: publishedUrl || state[key]?.publishedUrl || ''
    }

    if (saveContentState(state)) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Failed to save state' }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
