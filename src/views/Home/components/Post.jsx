import React from "react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

import { decodeText } from "@/util"

dayjs.extend(relativeTime)

const Post = ({ data }) => {
  return (
    <div id="post" className="pb-6 md:pb-0">
      <a href={data?.url} className="font-merriweather text-black dark:text-white hover:text-primary transition-colors duration-200" target="_blank" rel="noopener noreferrer">
        <div id="details">
          <div id="text">
            <div id="author-details">
              <span className="text-xs text-black/70 dark:text-[#999999]">
                Posted by {data?.author}
              </span>
              <span className="text-black/70 dark:text-[#999999]"> · </span>
              <span className="text-xs text-black/70 dark:text-[#999999]">
                {dayjs(data?.pubDate).fromNow()}
              </span>
            </div>

            <div id="post-title" className="mt-3">
              <h5 className="text-medium md:text-lg font-semibold leading-snug">
                {decodeText(data?.title)}
              </h5>
            </div>

            <div id="post-stats" className="mt-4 flex items-center space-x-4">
              <span className="text-xs text-black/50 dark:text-[#666666]">
                {data?.score.toLocaleString()} upvotes
              </span>
              <span className="text-xs text-black/50 dark:text-[#666666]">
                {data?.num_comments.toLocaleString()} comments
              </span>
            </div>
          </div>
        </div>
      </a>
    </div>
  )
}

export default Post