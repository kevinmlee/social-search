import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Simple in-memory cache
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Default Mastodon instance
const MASTODON_INSTANCE = 'https://mastodon.social'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const sort = searchParams.get('sort') || 'top'

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    // Check cache
    const cacheKey = `${query}_${sort}`
    const cached = cache.get(cacheKey)
    const now = Date.now()

    if (cached && (now - cached.timestamp) < CACHE_TTL) {
      return NextResponse.json({ posts: cached.data })
    }

    // Check if query looks like a hashtag
    const isHashtag = query.startsWith('#') || !query.includes(' ')
    let posts = []

    if (isHashtag) {
      // Search by hashtag using hashtag timeline
      const hashtag = query.replace('#', '').toLowerCase()

      try {
        const hashtagUrl = `${MASTODON_INSTANCE}/api/v1/timelines/tag/${encodeURIComponent(hashtag)}?limit=40`
        const response = await fetch(hashtagUrl, {
          headers: {
            'Accept': 'application/json'
          }
        })

        if (response.ok) {
          posts = await response.json()

          // Sort if needed
          if (sort === 'recent') {
            posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          } else {
            // Sort by engagement (favorites + reblogs)
            posts.sort((a, b) => {
              const engagementA = (a.favourites_count || 0) + (a.reblogs_count || 0)
              const engagementB = (b.favourites_count || 0) + (b.reblogs_count || 0)
              return engagementB - engagementA
            })
          }
        }
      } catch (err) {
        console.error('Hashtag search error:', err)
      }
    } else {
      // For multi-word queries, try general search
      // Note: Search API requires authentication for full results, but we'll try anyway
      try {
        const searchUrl = `${MASTODON_INSTANCE}/api/v2/search?q=${encodeURIComponent(query)}&type=statuses&limit=40`
        const response = await fetch(searchUrl, {
          headers: {
            'Accept': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          posts = data.statuses || []

          // Sort if needed
          if (sort === 'recent') {
            posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          } else {
            // Sort by engagement
            posts.sort((a, b) => {
              const engagementA = (a.favourites_count || 0) + (a.reblogs_count || 0)
              const engagementB = (b.favourites_count || 0) + (b.reblogs_count || 0)
              return engagementB - engagementA
            })
          }
        }
      } catch (err) {
        console.error('General search error:', err)
      }
    }

    // Update cache
    cache.set(cacheKey, {
      data: posts,
      timestamp: now
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Mastodon search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
