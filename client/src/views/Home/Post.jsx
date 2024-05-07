import React from "react"
import moment from "moment"

import { Box, Typography } from "@mui/material"
import { decodeText } from '../../util/decodeText'

const Post = ({ data }) => {
  return (
    <Box className={"post "} key={data?.id} data-aos="fade-up">
      <a href={data?.link} target="_blank" rel="noopener noreferrer">
        <Box className="details">
          <Box className="text">
            <Box className="author-details">
              <Typography variant="caption" style={{ color: "#999999" }}>
                Posted by {data?.author}
              </Typography>
              <span style={{ color: "#999999" }}> · </span>
              <Typography variant="caption" style={{ color: "#999999" }}>
                {moment(data?.pubDate).fromNow()}
              </Typography>
            </Box>

            <Box className="post-title">
              <Typography variant="h5">
                {decodeText(data?.title)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </a>
    </Box>
  )
}

export default Post