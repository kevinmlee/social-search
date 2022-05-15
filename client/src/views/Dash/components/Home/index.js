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

import Weather from "../Weather";

const TOPICS = ["news", "technology"];

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterToggle: false,

      recent: false,
      popular: true,
    };

    this.wrapperRef = React.createRef();
    //this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount = async () => {
    //document.addEventListener("mousedown", this.handleClickOutside);
    // if (this.props.state.home && this.props.state.subreddits.length === 0)
    this.getPosts();
  };

  componentWillUnmount = () => {
    //document.removeEventListener("mousedown", this.handleClickOutside);
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

  getNewsHotPosts = async () => {
    return await axios
      .put("/reddit/get/subreddit/posts", {
        subreddit: "news",
        filter: "hot",
        limit: 10,
      })
      .then(
        (response) => {
          this.props.setAppState("redditHotNews", response.data.data.children);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  getTechHotPosts = async () => {
    return await axios
      .put("/reddit/get/subreddit/posts", {
        subreddit: "technology",
        filter: "hot",
        limit: 10,
      })
      .then(
        (response) => {
          this.props.setAppState("redditHotTech", response.data.data.children);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  getSubredditPosts = async (subreddit) => {
    return await axios
      .put("/reddit/get/subreddit/posts", {
        subreddit: subreddit,
        filter: "hot",
        limit: 10,
      })
      .then(
        (response) => {
          let subreddits = this.props.state.subreddits;
          subreddits[subreddit] = response.data.data.children;

          this.props.setAppState("subreddits", subreddits);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  getPosts = async () => {
    for (const topic of TOPICS) await this.getSubredditPosts(topic);
  };

  tinyPost = (post) => {
    return (
      <Box className="post" key={post.data.id}>
        <a href={post.data.url} target="_blank" rel="noopener noreferrer">
          <Box className="details">
            {"preview" in post.data && (
              <img
                className="featured-image"
                src={this.getPreviewImage(post)}
                alt={this.decodeText(post.data.title)}
              />
            )}

            <Box className="author-details">
              <Typography variant="caption" style={{ color: "#999999" }}>
                Posted by {post.data.author}
              </Typography>
              <span style={{ color: "#999999" }}> · </span>
              <Typography variant="caption" style={{ color: "#999999" }}>
                {moment.unix(post.data.created).utc().fromNow()}
              </Typography>
            </Box>

            <Box className="post-title">
              <Typography variant="h5">
                {this.decodeText(post.data.title)}
              </Typography>
            </Box>
          </Box>
        </a>
      </Box>
    );
  };

  render() {
    const posts = this.props.state.subreddits;
    console.log("posts", posts);

    return (
      <Box sx={{ paddingTop: 2, paddingBottom: 2 }}>
        {Object.keys(posts).map((key) => (
          <Box id={key} className="topic">
            <Typography className="section-title" variant="h4">
              {key}
            </Typography>

            <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={5}>
              {posts[key].map((post, index) => {
                return this.tinyPost(post);
              })}
            </Masonry>
          </Box>
        ))}
      </Box>
    );
  }
}
