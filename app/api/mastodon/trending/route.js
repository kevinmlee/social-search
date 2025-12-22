import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Cache for 5 minutes
let cache = {
  data: null,
  timestamp: null,
  ttl: 5 * 60 * 1000 // 5 minutes
}

// Default Mastodon instance (you can change this or make it configurable)
const MASTODON_INSTANCE = 'https://mastodon.social'

export async function GET() {
  try {
    // Check cache first
    const now = Date.now()
    if (cache.data && cache.timestamp && (now - cache.timestamp) < cache.ttl) {
      return NextResponse.json({ posts: cache.data })
    }

    // Fetch trending posts from Mastodon
    // Using trending statuses endpoint - no authentication required
    const response = await fetch(`${MASTODON_INSTANCE}/api/v1/trends/statuses?limit=40`, {
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('Failed to fetch trending posts:', response.status)
      return NextResponse.json({ posts: [] })
    }

    const posts = await response.json()

    // Update cache
    cache.data = posts
    cache.timestamp = now

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Mastodon trending posts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trending posts' },
      { status: 500 }
    )
  }
}
