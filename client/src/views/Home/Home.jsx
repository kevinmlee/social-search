import React, { useCallback, useEffect, useState } from "react"
import { Box, Typography } from "@mui/material"
import { Masonry } from "@mui/lab"
import Post from "./Post"

import "./Home.css"

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

  // serverless API call to get posts
  const getPosts = useCallback(async () => {
    for (const topic of TOPICS) {
      await fetch(`/.netlify/functions/fetchSubredditPosts`, {
        method: "POST",
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
    <Box sx={{ padding: "0 20px" }} md={{ padding: "0 30px" }}>
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

      <Box>
        {Object.keys(subreddits)?.map(key => (
          <Box id={key} className="topic posts" key={key}>
            <Typography className="section-title" variant="h4">
              {key}
            </Typography>

            <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
              {subreddits[key]?.map(post => <Post data={post} key={post?.id}/>)}
            </Masonry>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default Home