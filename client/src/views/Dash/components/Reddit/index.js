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

import LayoutSelector from "../../../LayoutSelector";

/*
 * perhaps on first load, get recent hot posts from reddit
 * or worldnews
 * or provide option for both
 */

export default class Reddit extends Component {
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
    //let userSettings = JSON.parse(localStorage.getItem("userSettings"));
    document.addEventListener("mousedown", this.handleClickOutside);

    // get layout preference from localStorage
    /*
    if ("layout" in userSettings)
      this.setState({ layout: userSettings.layout });
    else this.props.updateLocalStorage("layout", "grid");
    */

    // on initial load, fetch the data if not already present
    if (this.state.popular && this.props.state.redditHot.length === 0)
      this.redditSearchHot();
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
            <Box className="reddit-video" sx={{ marginBottom: 2 }}>
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
            <Box className="youtube-video" sx={{ marginBottom: 2 }}>
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

  redditSearchNew = async (e) => {
    return await axios
      .put("/reddit/search", {
        searchQuery: this.props.state.previousSearchQuery,
        filter: "new",
      })
      .then(
        (response) => {
          this.props.setAppState("redditNew", response.data.data.children);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  redditSearchHot = async (e) => {
    return await axios
      .put("/reddit/search", {
        searchQuery: this.props.state.previousSearchQuery,
        filter: "hot",
      })
      .then(
        (response) => {
          this.props.setAppState("redditHot", response.data.data.children);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  post = (post) => {
    return (
      <Box className="post" key={post.data.id}>
        <a href={post.data.url} target="_blank" rel="noopener noreferrer">
          {this.getVideo(post)
            ? this.getVideo(post)
            : this.getPreviewImage(post) && (
                <Box
                  className="media"
                  /*onClick={() => {
                    this.props.setAppState(
                      "backdropImage",
                      this.getPreviewImage(post)
                    );
                    this.props.setAppState("backdropToggle", true);
                  }}*/
                >
                  <div className="media-image">
                    <img
                      className="featured-image"
                      src={this.getPreviewImage(post)}
                      alt={post.data.title}
                      loading="lazy"
                    />
                  </div>
                </Box>
              )}

          <Box className="details">
            <div className="subreddit">{post.data.subreddit_name_prefixed}</div>
            <Typography variant="caption" style={{ color: "#999999" }}>
              Posted by {post.data.author}
            </Typography>
            <span style={{ color: "#999999" }}> · </span>
            <Typography variant="caption" style={{ color: "#999999" }}>
              {moment.unix(post.data.created).utc().fromNow()}
            </Typography>
          </Box>

          <Box className="post-title" sx={{ paddingTop: 2 }}>
            <Typography variant="h5">
              {this.decodeText(post.data.title)}
            </Typography>
          </Box>
        </a>
      </Box>
    );
  };

  render() {
    const layout = this.props.state.layout;

    return (
      <Box sx={{ paddingTop: 4, paddingBottom: 4 }}>
        <Box id="filterRow">
          <Box className="filter">
            <div
              className="active-display"
              onClick={() => this.toggle("filterToggle")}
            >
              <span className="active-filter">Filter</span>
              <TuneRoundedIcon />
            </div>
            <ul
              className={
                "filter-options " + (this.state.filterToggle && "active")
              }
              ref={this.wrapperRef}
            >
              {/*<li>All</li>*/}
              <li
                className={this.state.recent ? "active" : ""}
                onClick={this.changeTab}
                data-tab="recent"
              >
                Recent
                <Radio checked={this.state.recent} size="small" />
              </li>
              <li
                className={this.state.popular ? "active" : ""}
                onClick={this.changeTab}
                data-tab="popular"
              >
                Hot
                <Radio checked={this.state.popular} size="small" />
              </li>
            </ul>
          </Box>

          {/*<LayoutSelector
            state={this.props.state}
            updateLocalStorage={this.props.updateLocalStorage}
            setAppState={this.props.setAppState}
            />*/}
        </Box>

        {this.state.recent && this.props.state.redditNew.length > 0 && (
          <Box className="topic posts">
            <Masonry
              className={"posts " + layout + "-layout"}
              columns={{ xs: 1, md: 2, lg: 3, xl: 4 }}
              spacing={7}
            >
              {this.props.state.redditNew &&
                this.props.state.redditNew.slice(0, 50).map((post, index) => {
                  return this.post(post);
                })}
            </Masonry>
          </Box>
        )}

        {this.state.popular && this.props.state.redditHot.length > 0 && (
          <Box className="topic posts">
            <Masonry
              className={"posts " + layout + "-layout"}
              columns={{ xs: 1, md: 2, lg: 3, xl: 4 }}
              spacing={7}
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
