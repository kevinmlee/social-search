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

  getVideo = (post) => {
    if ("secure_media" in post.data) {
      if (post.data.secure_media) {
        if ("reddit_video" in post.data.secure_media) {
          return (
            <Box className="reddit-video" sx={{ marginTop: 2 }}>
              <video width="100%" height="240" controls>
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
          return (
            <Box className="youtube-video" sx={{ marginTop: 2 }}>
              <div
                dangerouslySetInnerHTML={{
                  __html: this.htmlDecode(post.data.secure_media.oembed.html),
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
        <Box container>
          <Box className="details" sx={{ marginBottom: 1 }}>
            <span style={{ color: "#ffffff" }}>
              <a
                href={"https://reddit.com/" + post.data.subreddit_name_prefixed}
                target="_blank"
                rel="noopener noreferrer"
              >
                {post.data.subreddit_name_prefixed}
              </a>
            </span>{" "}
            <span style={{ color: "#999999" }}> · </span>
            <span style={{ color: "#999999" }}>
              Posted by {post.data.author}
            </span>
            <span style={{ color: "#999999" }}> · </span>
            <Typography variant="caption" style={{ color: "#999999" }}>
              {moment.unix(post.data.created).utc().fromNow()}
            </Typography>
          </Box>
        </Box>

        <Box className="post-text" sx={{ marginTop: 2 }}>
          <a
            href={"https://reddit.com" + post.data.permalink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Typography variant="body1">{post.data.title}</Typography>
          </a>
        </Box>

        {this.getVideo(post)}

        {this.getVideo(post)
          ? ""
          : this.getPreviewImage(post) && (
              <Box
                className="media"
                sx={{ marginTop: 2 }}
                onClick={() => {
                  this.props.setAppState(
                    "backdropImage",
                    this.getPreviewImage(post)
                  );
                  this.props.setAppState("backdropToggle", true);
                }}
              >
                <img
                  src={this.getPreviewImage(post)}
                  alt={post.data.title}
                  loading="lazy"
                />
              </Box>
            )}

        <Box
          className="public-metrics"
          container
          spacing={2}
          xs={12}
          sx={{ paddingTop: 4 }}
        >
          <Typography
            variant="overline"
            sx={{ paddingRight: 4 }}
            style={{ color: "#999999" }}
          >
            {post.data.ups} Upvotes
          </Typography>

          <Typography
            variant="overline"
            sx={{ paddingRight: 4 }}
            style={{ color: "#999999" }}
          >
            {post.data.num_comments} Comments
          </Typography>

          <Typography
            variant="overline"
            sx={{ paddingRight: 4 }}
            style={{ color: "#999999" }}
          >
            {post.data.total_awards_received} Awards
          </Typography>
        </Box>
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
