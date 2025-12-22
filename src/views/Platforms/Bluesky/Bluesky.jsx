'use client'

import { Suspense, useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { BskyAgent } from '@atproto/api'
import Post from './Post'
import { FadeUp, Filter, LoadingSkeleton } from '@/components'

const FILTERS = {
  hot: true,
  recent: false,
}

export default function Bluesky() {
  const params = useParams()
  const searchParams = useSearchParams()
  const query = params?.query || ''
  const filter = searchParams?.get('filter') || 'hot'

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true)
      try {
        const agent = new BskyAgent({
          service: 'https://public.api.bsky.app'
        })

        if (!query) {
          // Get trending/popular posts
          const response = await agent.app.bsky.unspecced.getPopularFeedGenerators({
            limit: 50
          })

          // Fetch posts from the first popular feed
          if (response.data.feeds && response.data.feeds.length > 0) {
            const feedUri = response.data.feeds[0].uri
            const feedResponse = await agent.app.bsky.feed.getFeed({
              feed: feedUri,
              limit: 50
            })
            setPosts(feedResponse.data.feed || [])
          } else {
            setPosts([])
          }
        } else {
          // Search posts by query
          const sortType = filter === 'recent' ? 'latest' : 'top'
          const response = await agent.app.bsky.feed.searchPosts({
            q: query,
            sort: sortType,
            limit: 50
          })
          setPosts(response.data.posts || [])
        }
      } catch (err) {
        console.error('Bluesky fetch error:', err)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [query, filter])

  return (
    <div className="py-4 px-5 md:px-8">
      <Suspense fallback={<div>Loading...</div>}>
        <Filter filters={FILTERS} />
      </Suspense>

      {loading && (
        <div className="my-6">
          <LoadingSkeleton count={12} />
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="text-center py-12 text-gray-500">No posts found.</div>
      )}

      {!loading && posts.length > 0 && (
        <div className="my-6">
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-16">
            {posts.map((post, index) => (
              <FadeUp key={post?.post?.uri || index} className="break-inside-avoid mb-6 md:mb-12 border-white/15 border-b last:border-b-0 md:border-b-0">
                <Post data={post} />
              </FadeUp>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
