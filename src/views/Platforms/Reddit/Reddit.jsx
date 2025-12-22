'use client'

import { Suspense, useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Post from './Post'
import { FadeUp, Filter } from '@/components'

const ENDPOINT = "https://www.reddit.com"
const FILTERS = {
  hot: true,
  recent: false,
}

export default function Reddit() {
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
          // General hot posts
          const res = await fetch(`${ENDPOINT}/hot.json?include_over_18=off&limit=50`)
          if (!res.ok) {
            console.error('Reddit API error:', res.status, res.statusText)
            setPosts([])
          } else {
            const data = await res.json()
            setPosts(data?.data?.children || [])
          }
        } else {
          // Search posts by query
          const sortType = filter === 'recent' ? 'new' : 'hot'
          const res = await fetch(`${ENDPOINT}/search.json?q=${query}&sort=${sortType}&limit=50`)
          if (!res.ok) {
            console.error('Reddit API error:', res.status, res.statusText)
            setPosts([])
          } else {
            const data = await res.json()
            setPosts(data?.data?.children || [])
          }
        }
      } catch (err) {
        console.error('Reddit fetch error:', err)
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
        <div className="text-center py-12 text-gray-500">Loading...</div>
      )}

      {!loading && posts.length === 0 && (
        <div className="text-center py-12 text-gray-500">No posts found.</div>
      )}

      {!loading && posts.length > 0 && (
        <div className="my-6">
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-16">
            {posts.map(post => (
              <FadeUp key={post?.data?.id} className="break-inside-avoid mb-6 md:mb-12 border-white/15 border-b last:border-b-0 md:border-b-0">
                <Post data={post} />
              </FadeUp>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
