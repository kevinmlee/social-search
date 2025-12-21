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
    <div className="post" key={data.etag} data-aos="fade-up">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="youtube-post-link details"
      >
        {type === "Channel" && (
          <div className="media-image">
            <img
              className="featured-image"
              src={data?.snippet?.thumbnails?.high?.url}
              alt={decodeText(data?.snippet?.title)}
              loading="lazy"
            />
          </div>
        )}

        {type === "Video" && (
          <div className="yt-embed">
            <img
              className="thumb"
              src={data?.snippet?.thumbnails?.high?.url}
              alt="thumb"
              loading="lazy"
            />
          </div>
        )}

        <div className="text">
          <div className="pt-2">
            <div className="author-details">
              <span className="username">{data?.snippet?.channelTitle}</span>
              <span className="text-[#999999]"> · </span>
              <span className="text-xs text-[#999999]">
                {dayjs(data?.snippet?.publishedAt).fromNow()}
              </span>
            </div>
          </div>

          <div className="post-title">
            <h5 className="text-xl font-normal">
              {decodeText(data?.snippet?.title)}
            </h5>
          </div>
        </div>
      </a>
    </div>
  )
}

export default Post