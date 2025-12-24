import React from "react"
import Image from "next/image"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

import { decodeText } from "@/util"

dayjs.extend(relativeTime)

const Post = ({ data }) => {
  // Detect if this is NewsData.io format or Reddit format
  const isNewsData = data?.article_id || data?.source_id

  const url = isNewsData ? data?.link : data?.url
  const author = isNewsData ? data?.source_name || data?.source_id : data?.author
  const pubDate = isNewsData ? data?.pubDate : data?.created_utc ? data.created_utc * 1000 : data?.pubDate
  const title = data?.title
  const imageUrl = isNewsData ? data?.image_url : null

  return (
    <div id="post" className="pb-6 md:pb-0">
      <a href={url} className="text-black dark:text-white hover:text-primary transition-colors duration-200" target="_blank" rel="noopener noreferrer">
        <div id="details">
          {/* Show image for NewsData articles if available */}
          {isNewsData && imageUrl && (
            <div id="media" className="overflow-hidden rounded-xl mb-4">
              <Image
                src={imageUrl}
                alt={title || 'News article image'}
                width={600}
                height={400}
                loading="lazy"
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          <div id="text">
            <div id="author-details">
              <span className="text-xs text-black/70 dark:text-primary">
                {isNewsData ? `Source: ${author}` : `Posted by ${author}`}
              </span>
              <span className="text-black/70 dark:text-[#999999]"> · </span>
              <span className="text-xs text-black/70 dark:text-[#999999]">
                {dayjs(pubDate).fromNow()}
              </span>
            </div>

            <div id="post-title" className="mt-3">
              <h5 className="font-merriweather text-medium md:text-lg font-semibold leading-snug">
                {decodeText(title)}
              </h5>
            </div>

            {!isNewsData && (
              <div id="post-stats" className="mt-4 flex items-center space-x-4">
                <span className="text-xs text-black/50 dark:text-[#666666]">
                  {data?.score?.toLocaleString()} upvotes
                </span>
                <span className="text-xs text-black/50 dark:text-[#666666]">
                  {data?.num_comments?.toLocaleString()} comments
                </span>
              </div>
            )}
          </div>
        </div>
      </a>
    </div>
  )
}

export default Post