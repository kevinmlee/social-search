import { NextResponse } from 'next/server'
import { AtpAgent } from '@atproto/api'

// Cache agent instance to reuse session
let cachedAgent = null
let cacheTime = 0
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

async function getAgent() {
  const now = Date.now()

  // Return cached agent if still valid
  if (cachedAgent && (now - cacheTime) < CACHE_DURATION) {
    return cachedAgent
  }

  // Use bsky.social for authenticated requests (not public.api.bsky.app)
  const agent = new AtpAgent({
    service: 'https://bsky.social'
  })

  // Login if credentials are provided
  if (process.env.BLUESKY_IDENTIFIER && process.env.BLUESKY_PASSWORD) {
    try {
      await agent.login({
        identifier: process.env.BLUESKY_IDENTIFIER,
        password: process.env.BLUESKY_PASSWORD
      })
      cachedAgent = agent
      cacheTime = now
      console.log('Bluesky login successful')
    } catch (loginError) {
      console.error('Bluesky login failed:', loginError)
      throw new Error('Failed to authenticate with Bluesky')
    }
  } else {
    throw new Error('Bluesky credentials not configured')
  }

  return agent
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const sort = searchParams.get('sort') || 'top'

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required', posts: [] },
      { status: 400 }
    )
  }

  try {
    const agent = await getAgent()

    const response = await agent.app.bsky.feed.searchPosts({
      q: query,
      sort: sort,
      limit: 50
    })

    return NextResponse.json({ posts: response.data.posts || [] })
  } catch (error) {
    console.error('Bluesky search error:', error)

    // Check if it's an auth error
    if (error.status === 403 || error.message?.includes('403')) {
      return NextResponse.json(
        {
          error: 'Bluesky search requires authentication. Please set BLUESKY_IDENTIFIER and BLUESKY_PASSWORD environment variables.',
          posts: []
        },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to search Bluesky posts', posts: [] },
      { status: 500 }
    )
  }
}
