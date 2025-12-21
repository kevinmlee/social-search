'use client'

import React from "react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import utc from 'dayjs/plugin/utc'

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
            <div className="reddit-video media mb-2">
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
            </div>
          )
        }
        if ("secure_media_embed" in post.data) {
          let updatedString = post.data.secure_media.oembed.html.replace("src=", 'loading="lazy" src=')

          return (
            <div className="youtube-video media mb-2">
              <div dangerouslySetInnerHTML={{ __html: decodeHtml(updatedString) }} />
            </div>
          )
        }
      }
    }
  }

  return (
    <div className="post" data-aos="fade-up">
      <a href={data?.data.url} target="_blank" rel="noopener noreferrer">
        <div className="details">
          {getVideo(data)
            ? getVideo(data)
            : getPreviewImage(data) && (
                <div className="media">
                  <img
                    className="featured-image"
                    src={getPreviewImage(data)}
                    alt={data.data.title}
                    loading="lazy"
                  />
                </div>
              )}

          <div className="text">
            <div className="author-details">
              <div className="subreddit">
                {data.data.subreddit_name_prefixed}
              </div>
              <span className="text-xs text-[#999999]">
                Posted by {data.data.author}
              </span>
              <span className="text-[#999999]"> · </span>
              <span className="text-xs text-[#999999]">
                {dayjs.unix(data.data.created).utc().fromNow()}
              </span>
            </div>

            <div className="post-title">
              <h5 className="text-xl font-normal">
                {decodeText(data.data.title)}
              </h5>
            </div>
          </div>
        </div>
      </a>
    </div>
  )
}

export default Post