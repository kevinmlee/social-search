import React from "react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

import { decodeText } from "@/util"

dayjs.extend(relativeTime)

const Post = ({ data }) => {
  return (
    <div id="post" data-aos="fade-up">
      <a href={data?.link} className="font-merriweather" target="_blank" rel="noopener noreferrer">
        <div id="details">
          <div id="text">
            <div id="author-details">
              <span className="text-xs text-[#999999]">
                Posted by {data?.author}
              </span>
              <span className="text-[#999999]"> · </span>
              <span className="text-xs text-[#999999]">
                {dayjs(data?.pubDate).fromNow()}
              </span>
            </div>

            <div id="post-title" className="mt-3">
              <h5 className="text-lg font-semibold leading-snug">
                {decodeText(data?.title)}
              </h5>
            </div>
          </div>
        </div>
      </a>
    </div>
  )
}

export default Post