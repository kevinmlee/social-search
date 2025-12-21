import React from "react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

import { decodeText } from "@/util"

dayjs.extend(relativeTime)

const Post = ({ data }) => {
  return (
    <div className="post" data-aos="fade-up">
      <a href={data?.link} target="_blank" rel="noopener noreferrer">
        <div className="details">
          <div className="text">
            <div className="author-details">
              <span className="text-xs text-[#999999]">
                Posted by {data?.author}
              </span>
              <span className="text-[#999999]"> · </span>
              <span className="text-xs text-[#999999]">
                {dayjs(data?.pubDate).fromNow()}
              </span>
            </div>

            <div className="post-title">
              <h5 className="text-xl font-bold">
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