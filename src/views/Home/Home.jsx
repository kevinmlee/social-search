'use client'

import React, { useCallback, useEffect, useState } from "react"
import Post from "./Post"

const TOPICS = [
  "news",
  "technology",
  "futurology",
  "science",
  "sports",
  "space",
  "nutrition"
]

const Home = () => {
  const [subreddits, setSubreddits] = useState([])

  // API call to get posts
  const getPosts = useCallback(async () => {
    for (const topic of TOPICS) {
      await fetch(`/api/reddit/posts`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subreddit: topic,
          filter: 'hot',
          limit: 20
        }),
      }).then(response => response.json())
        .then(data => setSubreddits(prevSubreddits => ({ ...prevSubreddits, [topic]: data.items })))
    }
  }, [])

  useEffect(() => {
    setTimeout(() => window.AOS.refresh(), 700)
  })

  useEffect(() => {
    window.scrollTo({ top: 0,behavior: "smooth" })
    getPosts()
  }, [getPosts])

  return (
    <div className="px-5 md:px-8">
      <ul className="fw-filter">
        {TOPICS.map(topic => (
          <li
            key={"key-" + topic}
            className="topic"
            onClick={() => document.getElementById(topic).scrollIntoView()}
          >
            {topic}
          </li>
        ))}
      </ul>

      <div>
        {Object.keys(subreddits)?.map(key => (
          <div id={key} className="pb-6 border-b border-[#efefef] dark:border-border-dark last:border-b-0" key={key}>
            <h4 className="section-title text-3xl font-bold mb-6 capitalize">
              {key}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
              {subreddits[key]?.map(post => <Post data={post} key={post?.id}/>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home