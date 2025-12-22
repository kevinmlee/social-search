import Image from "next/image"
import React from "react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

import { decodeText } from '@/util'

dayjs.extend(relativeTime)

const Post = ({ data }) => {
  let url = "";
  let type = "";

  if (data?.id?.kind === "youtube#video") {
    url = "https://www.youtube.com/watch?v=" + data.id.videoId;
    type = "Video";
  } else if (data?.kind === "youtube#video") {
    url = "https://www.youtube.com/watch?v=" + data?.videoId;
    type = "Video";
  } else if (
    data?.id?.kind === "youtube#channel" ||
    data?.kind === "youtube#channel"
  ) {
    url = "https://www.youtube.com/channel/" + data?.id?.channelId;
    type = "Channel";
  }

  return (
    <div className="pb-6 md:pb-0">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-black dark:text-white hover:text-primary"
      >
        {type === "Channel" && (
          <div data-testid="media-image" className="overflow-hidden rounded-xl mb-2">
            <Image
              data-testid="featured-image"
              src={data?.snippet?.thumbnails?.high?.url}
              alt={decodeText(data?.snippet?.title)}
              width={330}
              height={230}
              loading="lazy"
            />
          </div>
        )}

        {type === "Video" && (
          <div data-testid="yt-embed" className="overflow-hidden rounded-xl mb-2">
            <Image
              data-testid="featured-image"
              src={data?.snippet?.thumbnails?.high?.url}
              alt={decodeText(data?.snippet?.title)}
              width={330}
              height={230}
              loading="lazy"
            />
          </div>
        )}

        <div>
          <div className="pt-2">
            <div data-testid="author-details" className="text-black dark:text-primary">
              <span data-testid="username">{data?.snippet?.channelTitle}</span>
              <span className="text-black dark:text-[#999999]"> · </span>
              <span 
                data-testid="published-time"
                className="text-xs text-black dark:text-[#999999]"
              >
                {dayjs(data?.snippet?.publishedAt).fromNow()}
              </span>
            </div>
          </div>

          <div data-testid="post-title">
            <h5 className="text-xl font-normal mt-2">
              {decodeText(data?.snippet?.title)}
            </h5>
          </div>
        </div>
      </a>
    </div>
  )
}

export default Post