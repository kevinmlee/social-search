import React, { Component } from "react";
import moment from "moment";
import axios from "axios";

import {
  Box,
  ButtonGroup,
  Button,
  Paper,
  Typography,
  Tooltip,
  Radio,
} from "@mui/material";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";

import { Masonry } from "@mui/lab";

/*
 * perhaps on first load, get recent hot posts from reddit
 * or worldnews
 * or provide option for both
 */

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterToggle: false,

      recent: false,
      popular: true,
    };

    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount = () => {
    document.addEventListener("mousedown", this.handleClickOutside);

    // on initial load, fetch the data if not already present
    /*if (this.state.popular && this.props.state.redditHot.length === 0)
      this.redditSearchHot();

       redditHotWorldNews: [],
      redditHotGlobal: [],
      */
    if (this.props.state.home && this.props.state.redditHotGlobal.length === 0)
      this.getHotPosts();
    if (
      this.props.state.home &&
      this.props.state.redditHotWorldNews.length === 0
    )
      this.getWorldNewsHotPosts();
  };

  componentWillUnmount = () => {
    document.removeEventListener("mousedown", this.handleClickOutside);
  };

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target))
      this.setState({ filterToggle: false });
  };

  changeTab = (event) => {
    const tabs = ["recent", "popular"];
    const selectedTab = event.currentTarget.getAttribute("data-tab");

    tabs.forEach((tab) => {
      if (tab === selectedTab) this.setState({ [tab]: true });
      else this.setState({ [tab]: false });
    });

    this.setState({ filterToggle: false });

    // pull data from cooresponding API if not already pulled
    if (selectedTab === "recent" && this.props.state.redditNew.length === 0)
      this.redditSearchNew();
    if (selectedTab === "popular" && this.props.state.redditHot.length === 0)
      this.redditSearchHot();
  };

  toggle = async (state) => {
    await this.setState({ [state]: !this.state[state] });
  };

  htmlDecode = (input) => {
    var e = document.createElement("div");
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  };

  decodeText = (string) => {
    return string
      .replaceAll("&amp;", "&")
      .replaceAll("&lt;", "<")
      .replaceAll("&#39;", "'")
      .replaceAll("&quot;", '"')
      .replaceAll("&gt;", ">");
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
                height="auto"
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
    if (post.data.preview)
      return post.data.preview.images[0].source.url.replaceAll("&amp;", "&");
  };

  getHotPosts = async (e) => {
    return await axios
      .put("/reddit/get/hot/posts", {
        limit: 10,
      })
      .then(
        (response) => {
          this.props.setAppState(
            "redditHotGlobal",
            response.data.data.children
          );
        },
        (error) => {
          console.log(error);
        }
      );
  };

  getWorldNewsHotPosts = async () => {
    return await axios
      .put("/reddit/get/subreddit/posts", {
        subreddit: "worldnews",
        filter: "hot",
        limit: 10,
      })
      .then(
        (response) => {
          console.log("response worldnews hot posts", response);
          this.props.setAppState(
            "redditHotWorldNews",
            response.data.data.children
          );
        },
        (error) => {
          console.log(error);
        }
      );
  };

  post = (post) => {
    //console.log(post);
    return (
      <Paper elevation={3} className="reddit-post post-card" key={post.data.id}>
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

  tinyPost = (post) => {
    //console.log(post);
    return (
      <Box elevation={3} className="tiny-post" key={post.data.id}>
        <a
          //href={"https://reddit.com/" + post.data.subreddit_name_prefixed}
          href={"https://reddit.com" + post.data.permalink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Box
            className="details"
            sx={{ paddingTop: 2, paddingLeft: 2, paddingRight: 2 }}
          >
            {/* <span className="subreddit">
              {post.data.subreddit_name_prefixed}
            </span>
    <span style={{ color: "#999999" }}> · </span>*/}
            <Typography variant="caption" style={{ color: "#999999" }}>
              Posted by {post.data.author}
            </Typography>
            <span style={{ color: "#999999" }}> · </span>
            <Typography variant="caption" style={{ color: "#999999" }}>
              {moment.unix(post.data.created).utc().fromNow()}
            </Typography>
          </Box>

          <Box className="post-text" sx={{ padding: 2 }}>
            <Typography variant="body1">
              {this.decodeText(post.data.title)}
            </Typography>
          </Box>
        </a>
      </Box>
    );
  };

  render() {
    return (
      <Box sx={{ paddingTop: 4, paddingBottom: 4 }}>
        <div className="columns d-flex m-no-flex align-top">
          <div className="center-column">
            <div className="world-news">
              <h2>Hottest World News</h2>

              {this.props.state.redditHotWorldNews.length > 0 && (
                <Paper
                  className="tiny-card-container reddit-post"
                  sx={{ marginTop: 4, marginBottom: 4 }}
                >
                  {this.props.state.redditHotWorldNews.map((post, index) => {
                    return this.tinyPost(post);
                  })}
                </Paper>
              )}
            </div>
          </div>

          <div className="right-column">
            <div className="spotlight">
              <h2>Spotlight</h2>
            </div>
          </div>
        </div>

        {/*{this.props.state.redditHotGlobal.length > 0 && (
          <Paper
            className="tiny-card-container reddit-post"
            sx={{ marginTop: 4, marginBottom: 4 }}
          >
            {this.props.state.redditHotGlobal &&
              this.props.state.redditHotGlobal.map((post, index) => {
                return this.tinyPost(post);
              })}
          </Paper>
            )}*/}

        {/*this.props.state.redditHotWorldNews.length > 0 && (
          <Box className="reddit-tab" sx={{ marginTop: 4, marginBottom: 4 }}>
            <Masonry
              className="reddit-posts"
              columns={{ xs: 1, md: 2, lg: 3, xl: 4 }}
              spacing={2}
            >
              {this.props.state.redditHotWorldNews &&
                this.props.state.redditHotWorldNews.map((post, index) => {
                  return this.post(post);
                })}
            </Masonry>
          </Box>
              )*/}
      </Box>
    );
  }
}
