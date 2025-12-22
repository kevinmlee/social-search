import React from "react"

import { FadeUp, ScrollToTopOnLoad } from "@/components"
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

export async function getRedditPosts({
  subreddit,
  filter = 'hot',
  limit = 20,
}) {
  try {
    const res = await fetch(
      `https://www.reddit.com/r/${subreddit}/${filter}.json?limit=${limit}`,
      {
        next: { revalidate: 300 }, // cache for 5 minutes
      }
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

export default async function Home() {
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

  const subreddits = Object.fromEntries(results)

  return (
    <>
      <ScrollToTopOnLoad />
      <div className="px-5 md:px-8">
        <TopicsBar topics={TOPICS} />

        <div>
          {Object.keys(subreddits)?.map(key => (
            <div id={key} className="pb-6 border-b border-[#efefef] dark:border-border-dark last:border-b-0" key={key}>
              <h4 className="font-merriweather text-primary section-title text-2xl md:text-4xl font-medium py-6 md:py-12 capitalize">
                {key}
              </h4>

              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-16">
                {subreddits[key]?.map((post, index) => 
                <FadeUp key={post?.id} className="break-inside-avoid mb-6 md:mb-12 border-white/15 border-b last:border-b-0 md:border-b-0">
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