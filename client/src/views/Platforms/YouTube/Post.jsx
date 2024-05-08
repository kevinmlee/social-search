import React from "react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

import { Box, Grid, Typography } from "@mui/material"
import { decodeText } from '../../../util/decodeText'

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
    <Box className="post" key={data.etag} data-aos="fade-up">
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

        <Box className="text">
          <Grid container sx={{ paddingTop: 2 }}>
            <Grid className="author-details" item xs={10}>
              <span className="username">{data?.snippet?.channelTitle}</span>
              <span style={{ color: "#999999" }}> · </span>
              <Typography variant="caption" style={{ color: "#999999" }}>
                {dayjs(data?.snippet?.publishedAt).fromNow()}
              </Typography>
            </Grid>
          </Grid>
          
          <Box className="post-title">
            <Typography variant="h5">
              {decodeText(data?.snippet?.title)}
            </Typography>
          </Box>
        </Box>
      </a>
    </Box>
  )
}

export default Post