'use client'

import React, { useEffect, useState } from "react"

import { FadeUp, ScrollToTopOnLoad, LoadingSkeleton } from "@/components"
import Post from "./components/Post"
import TopicsBar from "./components/TopicsBar"

const TOPICS = [
  "news",
  "technology",
  "futurology",
  "science",
  "sports",
  "space",
  "nutrition"
]

async function getCachedNews() {
  try {
    const res = await fetch('/api/news/cached')

    if (!res.ok) {
      console.error('Cache API error:', res.status, res.statusText)
      return null
    }

    const json = await res.json()
    return json.data || null
  } catch (err) {
    console.error('Cache fetch error:', err)
    return null
  }
}

// Fallback: fetch from Reddit if cache is unavailable
async function getRedditPosts({
  subreddit,
  filter = 'hot',
  limit = 20,
}) {
  try {
    const res = await fetch(
      `https://www.reddit.com/r/${subreddit}/${filter}.json?limit=${limit}`
    )

    if (!res.ok) {
      console.error('Reddit API error:', res.status, res.statusText)
      return []
    }

    const json = await res.json()
    return json?.data?.children?.map((item) => item.data) || []
  } catch (err) {
    console.error('Reddit fetch error:', err)
    return []
  }
}

export default function Home() {
  const [subreddits, setSubreddits] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      // Try to get cached news first
      const cachedNews = await getCachedNews()

      if (cachedNews) {
        console.log('Using cached news data')
        setSubreddits(cachedNews)
        setLoading(false)
      } else {
        // Fallback to Reddit if cache is unavailable
        console.log('Cache miss, fetching from Reddit API')
        const results = await Promise.all(
          TOPICS.map(async topic => {
            const items = await getRedditPosts({
              subreddit: topic,
              filter: 'hot',
              limit: 20,
            })

            return [topic, items]
          })
        )

        setSubreddits(Object.fromEntries(results))
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="px-5 md:px-8 py-12">
        <LoadingSkeleton count={20} />
      </div>
    )
  }

  return (
    <>
      <ScrollToTopOnLoad />
      <div className="px-5 md:px-8">
        <TopicsBar topics={TOPICS} />

        <div>
          {Object.keys(subreddits)?.map(key => (
            <div id={key} className="pb-6 md:pb-12 border-b border-[#efefef] dark:border-border-dark last:border-b-0" key={key}>
              <h4 className="font-merriweather text-primary section-title text-3xl md:text-4xl font-medium py-6 md:py-12 capitalize">
                {key}
              </h4>

              <div className="columns-1 sm:columns-2 md:columns-2 lg:columns-3 xl:columns-4 gap-16">
                {subreddits[key]?.map((post, index) =>
                <FadeUp key={`${key}-${index}`} className="break-inside-avoid mb-6 md:mb-12 border-white/15 border-b last:border-b-0 last:mb-0 md:border-b-0">
                  <Post data={post} />
                </FadeUp>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
