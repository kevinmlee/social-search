'use client'

import { Suspense, useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Post from './Post'
import { FadeUp, Filter, Loader, LoadingSkeleton } from '@/components'

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
        if (!query) {
          // Get trending/popular posts - use API route to avoid CORS
          const response = await fetch('/api/bluesky/trending')
          if (response.ok) {
            const data = await response.json()
            setPosts(data.feed || [])
          } else {
            console.error('Failed to fetch trending posts')
            setPosts([])
          }
        } else {
          // Use our API route to avoid CORS issues
          const sortType = filter === 'recent' ? 'latest' : 'top'
          const response = await fetch(`/api/bluesky/search?q=${encodeURIComponent(query)}&sort=${sortType}`)

          if (response.ok) {
            const data = await response.json()
            // searchPosts returns posts directly, not wrapped in feed items
            // Convert them to the same format as feed items for consistency
            const formattedPosts = (data.posts || []).map(post => ({
              post: post
            }))
            setPosts(formattedPosts)
          } else {
            console.error('Search failed with status:', response.status)
            setPosts([])
          }
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
      <Suspense fallback={<div><Loader /></div>}>
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
