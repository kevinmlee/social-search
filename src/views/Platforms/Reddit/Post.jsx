import React from "react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import utc from 'dayjs/plugin/utc'

import { Box, Typography } from "@mui/material"
import { decodeHtml, decodeText } from '@/util'

dayjs.extend(relativeTime)
dayjs.extend(utc)

const getPreviewImage = (post) => {
  if (post.data.preview)
    return post.data.preview.images[0].source.url.replaceAll("&amp;", "&")
}

const Post = ({ data }) => {

  const getVideo = post => {
    if ("secure_media" in post.data) {
      if (post.data.secure_media) {
        if ("reddit_video" in post.data.secure_media) {
          return (
            <Box className="reddit-video media" sx={{ marginBottom: 2 }}>
              <video
                preload="none"
                width="100%"
                height="auto"
                controls
                poster={getPreviewImage(post)}
              >
                <source src={post.data.secure_media.reddit_video.fallback_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Box>
          )
        }
        if ("secure_media_embed" in post.data) {
          let updatedString = post.data.secure_media.oembed.html.replace("src=", 'loading="lazy" src=')

          return (
            <Box className="youtube-video media" sx={{ marginBottom: 2 }}>
              <div dangerouslySetInnerHTML={{ __html: decodeHtml(updatedString) }} />
            </Box>
          )
        }
      }
    }
  }

  return (
    <Box className="post" data-aos="fade-up">
      <a href={data?.data.url} target="_blank" rel="noopener noreferrer">
        <Box className="details">
          {getVideo(data)
            ? getVideo(data)
            : getPreviewImage(data) && (
                <Box className="media">
                  <img
                    className="featured-image"
                    src={getPreviewImage(data)}
                    alt={data.data.title}
                    loading="lazy"
                  />
                </Box>
              )}

          <Box className="text">
            <Box className="author-details">
              <div className="subreddit">
                {data.data.subreddit_name_prefixed}
              </div>
              <Typography variant="caption" style={{ color: "#999999" }}>
                Posted by {data.data.author}
              </Typography>
              <span style={{ color: "#999999" }}> · </span>
              <Typography variant="caption" style={{ color: "#999999" }}>
                {dayjs.unix(data.data.created).utc().fromNow()}
              </Typography>
            </Box>

            <Box className="post-title">
              <Typography variant="h5">
                {decodeText(data.data.title)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </a>
    </Box>
  )
}

export default Post