import React from "react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import utc from 'dayjs/plugin/utc'

import { decodeText } from '@/util'
import { FeaturedImage, FeaturedVideo } from "./components"

dayjs.extend(relativeTime)
dayjs.extend(utc)

const Post = ({ data }) => {
  return (
    <div data-testid="post" className="pb-6 md:pb-0">
      <a href={data?.data.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-200">
        <div data-testid="details">
          {data?.data?.is_video && <FeaturedVideo postData={data} />}
          {!data?.data?.is_video && data?.data?.preview && <FeaturedImage postData={data} />}
 
          <div data-testid="text">
            <div data-testid="subreddit" className="text-sm font-medium mb-2 text-primary">
              {data.data.subreddit_name_prefixed}
            </div>
            <div data-testid="author-details" className="mb-2">
              <span className="text-xs text-[#999999]">
                Posted by {data.data.author}
              </span>
              <span className="text-[#999999]"> · </span>
              <span className="text-xs text-[#999999]">
                {dayjs.unix(data.data.created).utc().fromNow()}
              </span>
            </div>

            <div data-testid="post-title">
              <h5 className="font-merriweather text-lg font-medium">
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