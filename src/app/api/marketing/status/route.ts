import { NextResponse } from 'next/server'
import { getContentState, saveContentState } from '@/utils/marketing-data'

export async function POST(req: Request) {
  try {
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
