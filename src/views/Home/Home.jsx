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
  const res = await fetch(
    `https://www.reddit.com/r/${subreddit}/${filter}.json?limit=${limit}`,
    {
      next: { revalidate: 300 }, // cache for 5 minutes
    }
  )

  const json = await res.json()

  return json.data.children.map((item) => item.data)
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-12">
                {subreddits[key]?.map((post, index) => 
                <FadeUp key={post?.id} className="border-white/15 border-b last:border-b-0 md:border-b-0">
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