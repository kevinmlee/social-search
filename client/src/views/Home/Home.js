import React, { useEffect, useState } from "react"
import moment from "moment"
import axios from 'axios'

import { Box, Typography } from "@mui/material"
import { Masonry } from "@mui/lab"

import "./Home.css"

const TOPICS = [
  "news",
  "technology",
  "futurology",
  "science",
  "sports",
  "space",
  "nutrition",
]

export default function Home() {
  const [subreddits, setSubreddits] = useState([])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })

    const getPosts = async () => {
      for (const topic of TOPICS) {
        await axios.post(`/.netlify/functions/reddit/getSubredditPosts`, {
          subreddit: topic,
          filter: 'hot',
          limit: 20
        }).then(
          (response) => {
            let newSubReddits = subreddits
            newSubReddits[topic] = response.data.data
            setSubreddits(newSubReddits)
          },
          (error) => error
        )

        /*
        await fetch(`https://reddit.com/r/${topic}/hot.json?include_over_18=off&limit=20`)
          .then((response) => response.json())
          .then((data) => {
            let newSubReddits = subreddits
            newSubReddits[topic] = data.data.children
            setSubreddits(newSubReddits)
          })
        */
      }
    }

    getPosts()
  })

  useEffect(() => {
    setTimeout(() => window.AOS.refresh(), 500)
  }, [subreddits])
 
  const htmlDecode = (input) => {
    var e = document.createElement("div");
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  };

  const decodeText = (string) => {
    return string
      .replaceAll("&amp;", "&")
      .replaceAll("&lt;", "<")
      .replaceAll("&#39;", "'")
      .replaceAll("&quot;", '"')
      .replaceAll("&gt;", ">");
  }

  const getVideo = (post) => {
    if ("secure_media" in post.data) {
      if (post.data.secure_media) {
        if ("reddit_video" in post.data.secure_media) {
          //console.log(post.data);
          return (
            <Box className="reddit-video media" sx={{ marginTop: 2 }}>
              <video
                preload="none"
                width="100%"
                height="auto"
                controls
                poster={getPreviewImage(post)}
              >
                <source
                  src={post.data.secure_media.reddit_video.fallback_url}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </Box>
          )
        }
        if ("secure_media_embed" in post.data) {
          let updatedString = post.data.secure_media.oembed.html.replace(
            "src=",
            'loading="lazy" src='
          )

          return (
            <Box className="youtube-video" sx={{ marginTop: 2 }}>
              <div
                dangerouslySetInnerHTML={{
                  __html: htmlDecode(updatedString)
                }}
              />
            </Box>
          )
        }
      }
    }
  }

  const getPreviewImage = (post) => {
    if (post.data.preview)
      return post.data.preview.images[0].source.url.replaceAll("&amp;", "&")
  }

  const postItem = (post) => {
    let classes = "";

    if (post.data.over_18) classes += "nsfw ";

    return (
      <Box className={"post " + classes} key={post.data.id} data-aos="fade-up">
        <a href={post.data.url} target="_blank" rel="noopener noreferrer">
          <Box className="details">
            {getVideo(post)
              ? getVideo(post)
              : getPreviewImage(post) && (
                  <Box className="media">
                    <div className="media-image">
                      <img
                        className="featured-image"
                        src={getPreviewImage(post)}
                        alt={post.data.title}
                        loading="lazy"
                      />
                    </div>
                  </Box>
                )}

            <Box className="text">
              <Box className="author-details">
                <Typography variant="caption" style={{ color: "#999999" }}>
                  Posted by {post.data.author}
                </Typography>
                <span style={{ color: "#999999" }}> · </span>
                <Typography variant="caption" style={{ color: "#999999" }}>
                  {moment.unix(post.data.created).utc().fromNow()}
                </Typography>
              </Box>

              <Box className="post-title">
                <Typography variant="h5">
                  {decodeText(post.data.title)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </a>
      </Box>
    );
  };

  return (
      <Box sx={{ paddingTop: 2, paddingBottom: 2 }}>
        <ul className="fw-filter">
          {TOPICS.map((topic) => (
            <li
              key={"key-" + topic}
              className="topic"
              onClick={() => {
                document.getElementById(topic).scrollIntoView();
              }}
            >
              {topic}
            </li>
          ))}
        </ul>

        <Box>
          {Object.keys(subreddits)?.map((key) => (
            <Box id={key} className="topic posts" key={key}>
              <Typography className="section-title" variant="h4">
                {key}
              </Typography>

              <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
                {subreddits[key]?.map((post) => postItem(post))}
              </Masonry>
            </Box>
          ))}
        </Box>
      </Box>
  )
}
