import React from "react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import utc from 'dayjs/plugin/utc'

import { decodeText } from '@/util'
import { ImagePost, VideoPost } from "./components"

dayjs.extend(relativeTime)
dayjs.extend(utc)

const Post = ({ data }) => {
  return (
    <div id="post">
      <a href={data?.data.url} target="_blank" rel="noopener noreferrer">
        <div id="details">
          {data?.data?.is_video && <VideoPost postData={data} />}
          {!data?.data?.is_video && data?.data?.preview && <ImagePost postData={data} />}
 
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