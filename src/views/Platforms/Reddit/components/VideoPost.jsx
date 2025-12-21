import React from "react"
import YouTubeVideo from "./YouTubeVideo"

const VideoPost = ({ postData }) => {
  if ("secure_media" in postData.data) {
    if (postData.data.secure_media) {
      if ("reddit_video" in postData.data.secure_media) {
        return (
          <div className="reddit-video media mb-2">
            <video
              preload="none"
              width="100%"
              height="auto"
              controls
              poster={postData?.data?.preview ? postData.data.preview.images[0].source.url.replaceAll("&amp;", "&") : undefined}
            >
              <source src={postData.data.secure_media.reddit_video.fallback_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )
      }
      if ("secure_media_embed" in postData.data) {
        let updatedString = postData.data.secure_media.oembed.html.replace("src=", 'loading="lazy" src=')

        return (
          <YouTubeVideo html={updatedString} />
        )
      }
    }
  }
}

export default VideoPost