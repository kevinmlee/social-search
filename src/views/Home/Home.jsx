'use client'

import React, { useCallback, useEffect, useState } from "react"
import Post from "./Post"
import { ScrollToTopOnLoad } from "@/components"

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
    getPosts()
  }, [getPosts])

  return (
    <>
      <ScrollToTopOnLoad />
      <div className="px-5 md:px-8">
        <ul className="hidden lg:flex sticky top-[85px] bg-white dark:bg-bg-dark flex space-x-10 overflow-x-auto text-lg font-medium capitalize justify-center cursor-pointer py-4 border-b border-[#efefef] dark:border-border-dark">
          {TOPICS.map(topic => (
            <li
              key={"key-" + topic}
              className="topic"
              onClick={() => {
                const element = document.getElementById(topic);
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - 180;
                window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth'
                });
              }}
            >
              {topic}
            </li>
          ))}
        </ul>

        <div>
          {Object.keys(subreddits)?.map(key => (
            <div id={key} className="pb-6 border-b border-[#efefef] dark:border-border-dark last:border-b-0" key={key}>
              <h4 className="font-merriweather section-title text-2xl md:text-4xl font-medium py-6 md:py-12 capitalize">
                {key}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-12">
                {subreddits[key]?.map(post => <Post data={post} key={post?.id}/>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Home