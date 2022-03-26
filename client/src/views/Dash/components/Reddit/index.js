import React, { Component } from "react";
import moment from "moment";

import {
  Box,
  ButtonGroup,
  Button,
  Paper,
  Typography,
  Tooltip,
} from "@mui/material";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

import { Masonry } from "@mui/lab";

export default class Tweets extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recent: true,
      popular: false,
    };
  }

  componentDidMount = async () => {};

  changeTab = (event) => {
    const tab = event.target.getAttribute("data-tab");

    if (tab === "recent")
      this.setState({ recent: true, popular: false, userTweets: false });
    else if (tab === "popular")
      this.setState({ recent: false, popular: true, userTweets: false });
  };

  htmlDecode = (input) => {
    var e = document.createElement("div");
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  };

  decodeText = (string) => {
    return string.replaceAll("&amp;", "&").replaceAll("&lt;", "<");
  };

  getVideo = (post) => {
    if ("secure_media" in post.data) {
      if (post.data.secure_media) {
        if ("reddit_video" in post.data.secure_media) {
          //console.log(post.data);
          return (
            <Box className="reddit-video" sx={{ marginTop: 2 }}>
              <video
                preload="none"
                width="100%"
                height="240"
                controls
                poster={this.getPreviewImage(post)}
              >
                <source
                  src={post.data.secure_media.reddit_video.fallback_url}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </Box>
          );
        }
        if ("secure_media_embed" in post.data) {
          let updatedString = post.data.secure_media.oembed.html.replace(
            "src=",
            'loading="lazy" src='
          );

          return (
            <Box className="youtube-video" sx={{ marginTop: 2 }}>
              <div
                dangerouslySetInnerHTML={{
                  __html: this.htmlDecode(updatedString),
                }}
              />
            </Box>
          );
        }
      }
    }
  };

  getPreviewImage = (post) => {
    if (post.data.preview) {
      return post.data.preview.images[0].source.url.replaceAll("&amp;", "&");
    }
  };

  post = (post) => {
    return (
      <Paper elevation={3} className="reddit-post" key={post.data.id}>
        <a
          //href={"https://reddit.com/" + post.data.subreddit_name_prefixed}
          href={"https://reddit.com" + post.data.permalink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Box
            className="details"
            sx={{ paddingTop: 3, paddingLeft: 2, paddingRight: 2 }}
          >
            <div className="subreddit">{post.data.subreddit_name_prefixed}</div>
            <Typography variant="caption" style={{ color: "#999999" }}>
              Posted by {post.data.author}
            </Typography>
            <span style={{ color: "#999999" }}> · </span>
            <Typography variant="caption" style={{ color: "#999999" }}>
              {moment.unix(post.data.created).utc().fromNow()}
            </Typography>
          </Box>
        </a>

        <a
          href={"https://reddit.com" + post.data.permalink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Box
            className="post-text"
            sx={{ paddingTop: 2, paddingLeft: 2, paddingRight: 2 }}
          >
            <Typography variant="body1">
              {this.decodeText(post.data.title)}
            </Typography>
          </Box>
        </a>

        {this.getVideo(post)
          ? this.getVideo(post)
          : this.getPreviewImage(post) && (
              <Box
                className="media"
                sx={{ paddingTop: 2, paddingLeft: 2, paddingRight: 2 }}
                onClick={() => {
                  this.props.setAppState(
                    "backdropImage",
                    this.getPreviewImage(post)
                  );
                  this.props.setAppState("backdropToggle", true);
                }}
              >
                <div className="media-image">
                  <img
                    src={this.getPreviewImage(post)}
                    alt={post.data.title}
                    loading="lazy"
                  />
                </div>
              </Box>
            )}

        <a
          href={"https://reddit.com" + post.data.permalink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Box
            className="public-metrics"
            container
            spacing={2}
            xs={12}
            sx={{
              padding: 2,
            }}
          >
            <Typography
              className="metric flex-container"
              variant="overline"
              sx={{ paddingRight: 4 }}
              style={{ color: "#999999" }}
            >
              <ThumbUpIcon />
              <span>{post.data.ups}</span>
            </Typography>

            <Typography
              className="metric flex-container"
              variant="overline"
              sx={{ paddingRight: 4 }}
              style={{ color: "#999999" }}
            >
              <ChatBubbleIcon />
              {post.data.num_comments}
            </Typography>

            <Typography
              className="metric flex-container"
              variant="overline"
              style={{ color: "#999999" }}
            >
              <EmojiEventsIcon />
              {post.data.total_awards_received}
            </Typography>
          </Box>
        </a>
      </Paper>
    );
  };

  render() {
    return (
      <Box sx={{ paddingTop: 4, paddingBottom: 4 }}>
        <Box>
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Tooltip
              title={
                "Most recent posts related to '" +
                this.props.state.searchQuery +
                "'"
              }
            >
              <Button
                className={this.state.recent ? "active" : ""}
                onClick={this.changeTab}
                data-tab="recent"
              >
                Recent
              </Button>
            </Tooltip>

            <Tooltip
              title={
                "Popular posts related to '" +
                this.props.state.searchQuery +
                "'"
              }
            >
              <Button
                className={this.state.popular ? "active" : ""}
                onClick={this.changeTab}
                data-tab="popular"
              >
                Hot
              </Button>
            </Tooltip>
          </ButtonGroup>
        </Box>

        {this.state.recent && (
          <Box className="reddit-tab" sx={{ marginTop: 4, marginBottom: 4 }}>
            <Masonry
              className="reddit-posts"
              columns={{ xs: 1, md: 2, lg: 3, xl: 4 }}
              spacing={2}
            >
              {this.props.state.redditNew &&
                this.props.state.redditNew.slice(0, 50).map((post, index) => {
                  return this.post(post);
                })}
            </Masonry>
          </Box>
        )}

        {this.state.popular && (
          <Box className="reddit-tab" sx={{ marginTop: 4, marginBottom: 4 }}>
            <Masonry
              className="reddit-posts"
              columns={{ xs: 1, md: 2, lg: 3, xl: 4 }}
              spacing={2}
            >
              {this.props.state.redditHot &&
                this.props.state.redditHot.slice(0, 50).map((post, index) => {
                  return this.post(post);
                })}
            </Masonry>
          </Box>
        )}
      </Box>
    );
  }
}
