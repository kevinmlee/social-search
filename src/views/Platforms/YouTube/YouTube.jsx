import https from "https"
import { Suspense } from "react"

import { FadeUp, Filter } from '@/components'
import Post from "./components/Post"

const ENDPOINT = "https://www.googleapis.com/youtube/v3"

// Fetch trending videos
async function getTrendingVideos(region) {
  return new Promise((resolve, reject) => {
    const url =
      `${ENDPOINT}/videos?part=snippet,statistics&chart=mostPopular&maxResults=20&regionCode=${region}&key=${process.env.YOUTUBE_API_KEY}`

    const request = https.get(url, (response) => {
      let data = ""
      response.on("data", chunk => (data += chunk))
      response.on("end", () => resolve(JSON.parse(data)))
    })

    request.on("error", (e) => reject(e))
  })
}

// Search videos
async function searchYouTube(query, order) {
  return new Promise((resolve, reject) => {
    const url =
      `${ENDPOINT}/search?part=snippet&maxResults=20&q=${encodeURIComponent(
        query
      )}&order=${order}&key=${process.env.YOUTUBE_API_KEY}`

    const request = https.get(url, (response) => {
      let data = ""
      response.on("data", chunk => (data += chunk))
      response.on("end", () => resolve(JSON.parse(data)))
    })

    request.on("error", (e) => reject(e))
  })
}

export default async function YouTubePage({ params, searchParams, location }) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const query = resolvedParams?.query || ''
  const filter = resolvedSearchParams?.filter || 'relevance'
  const filters = { relevance: true, rating: false, date: false }

  let posts = []

  try {
    if (!query) {
      const trending = await getTrendingVideos(location?.country_code || 'US')
      if ('items' in trending) posts = trending.items
    } else {
      const results = await searchYouTube(query, filter)
      if ('items' in results) posts = results.items
    }
  } catch (err) {
    console.error("YouTube API error", err)
    posts = []
  }

  return (
    <div className="py-4 px-5 md:px-8">
      <Suspense fallback={<div>Loading...</div>}>
        <Filter filters={filters} initialFilter={filter} query={query} />
      </Suspense>

      {posts.length === 0 && <p className="text-gray-500">No videos found.</p>}

      {posts.length > 0 && (
        <div className="my-6">
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
            {posts.map((post) => (
              <FadeUp key={post?.id || post?.etag} className="break-inside-avoid mb-6 md:mb-12 border-white/15 border-b last:border-b-0 md:border-b-0">
                <Post data={post} />
              </FadeUp>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
