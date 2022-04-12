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
    //this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount = async () => {
    //document.addEventListener("mousedown", this.handleClickOutside);

    // on initial load, fetch the data if not already present
    /*if (this.state.popular && this.props.state.redditHot.length === 0)
      this.redditSearchHot();

       redditHotWorldNews: [],
      redditHotGlobal: [],
      */

    if (this.props.state.home && this.props.state.redditHotGlobal.length === 0)
      this.getHotPosts();
    if (this.props.state.home && this.props.state.redditHotNews.length === 0)
      this.getNewsHotPosts();

    for (const subreddit of this.props.state.followingSubreddits) {
      //console.log("subreddit", subreddit);
      this.getSubredditPosts(subreddit);
    }
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

  tinyPost = (post) => {
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
    console.log("subreddit posts", this.props.state.subreddits);
    return (
      <Box sx={{ paddingTop: 2, paddingBottom: 2 }}>
        <div className="columns d-flex t-no-flex align-top">
          <div className="center-column">
            <div className="world-news">
              <Typography variant="h5">Trending News</Typography>

              {this.props.state.redditHotNews.length > 0 && (
                <Paper
                  className="tiny-card-container reddit-post"
                  sx={{ marginTop: 4, marginBottom: 4 }}
                >
                  {this.props.state.redditHotNews.map((post, index) => {
                    return this.tinyPost(post);
                  })}
                </Paper>
              )}
            </div>
          </div>

          <div className="right-column">
            <Weather
              setAppState={this.props.setAppState}
              updateLocalStorage={this.props.updateLocalStorage}
              state={this.props.state}
            />
          </div>
        </div>
      </Box>
    );
  }
}
