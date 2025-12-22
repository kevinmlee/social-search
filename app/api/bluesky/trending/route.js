import { NextResponse } from 'next/server'
import { AtpAgent } from '@atproto/api'

export async function GET() {
  try {
    const agent = new AtpAgent({
      service: 'https://public.api.bsky.app'
    })

    // Get trending/popular posts from the "What's Hot" feed
    const feedResponse = await agent.app.bsky.feed.getFeed({
      feed: 'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot',
      limit: 50
    })

    return NextResponse.json({ feed: feedResponse.data.feed || [] })
  } catch (error) {
    console.error('Bluesky trending error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trending posts', feed: [] },
      { status: 500 }
    )
  }
}
