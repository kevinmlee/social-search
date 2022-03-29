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
  Grid,
} from "@mui/material";

/*import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";*/
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";

import { Masonry } from "@mui/lab";

export default class YouTube extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterToggle: false,

      date: false,
      rating: false,
      relevance: true,
    };

    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount = () => {
    document.addEventListener("mousedown", this.handleClickOutside);

    this.searchVideosRelevance();
    this.searchVideosRating();
    this.searchVideosDate();
  };

  componentWillUnmount = () => {
    document.removeEventListener("mousedown", this.handleClickOutside);
  };

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target))
      this.setState({ filterToggle: false });
  };

  changeTab = (event) => {
    const tabs = ["date", "rating", "relevance"];
    const selectedTab = event.target.getAttribute("data-tab");

    tabs.forEach((tab) => {
      if (tab === selectedTab) this.setState({ [tab]: true });
      else this.setState({ [tab]: false });
    });

    this.setState({ filterToggle: false });
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

  searchVideosRelevance = async () => {
    return await axios
      .put("/youtube/search", {
        searchQuery: this.props.state.previousSearchQuery,
        order: "relevance",
      })
      .then(
        (response) => {
          if ("items" in response.data)
            this.props.setAppState("youtubeVideosRelevance", response.data);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  searchVideosRating = async () => {
    return await axios
      .put("/youtube/search", {
        searchQuery: this.props.state.previousSearchQuery,
        order: "rating",
      })
      .then(
        (response) => {
          if ("items" in response.data)
            this.props.setAppState("youtubeVideosRating", response.data);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  searchVideosDate = async () => {
    return await axios
      .put("/youtube/search", {
        searchQuery: this.props.state.previousSearchQuery,
        order: "date",
      })
      .then(
        (response) => {
          if ("items" in response.data)
            this.props.setAppState("youtubeVideosDate", response.data);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  post = (post) => {
    //console.log(post);
    return (
      <Paper
        elevation={3}
        className="youtube-post post-card"
        key={post.id.videoId}
      >
        <a
          href={"https://www.youtube.com/watch?v=" + post.id.videoId}
          target="_blank"
          rel="noopener noreferrer"
          className="youtube-post-link"
        >
          <Grid
            container
            spacing={2}
            sx={{ paddingTop: 2, paddingLeft: 2, paddingRight: 2 }}
          >
            <Grid item xs={10}>
              <span>{post.snippet.channelTitle}</span>
              <span style={{ color: "#999999" }}> · </span>
              <Typography variant="caption" style={{ color: "#999999" }}>
                {moment(post.snippet.publishedAt).fromNow()}
              </Typography>
            </Grid>
          </Grid>

          <Box className="tweet-text" sx={{ padding: 2 }}>
            <Typography variant="body1">
              {this.decodeText(post.snippet.title)}
            </Typography>
          </Box>

          <div className="media-image">
            <img
              src={post.snippet.thumbnails.high.url}
              alt={this.decodeText(post.snippet.title)}
            />
          </div>
        </a>

        {/*<div className="yt-embed">
          <iframe
            id="ytplayer"
            type="text/html"
            width="100%"
            height="250"
            loading="lazy"
            src={
              "https://www.youtube.com/embed/" + post.id.videoId + "?autoplay=0"
            }
            frameborder="0"
          ></iframe>
          </div>*/}

        <a
          href={"https://www.youtube.com/watch?v=" + post.id.videoId}
          target="_blank"
          rel="noopener noreferrer"
          className="youtube-post-link"
        >
          <Box sx={{ padding: 2 }}></Box>
        </a>
      </Paper>
    );
  };

  render() {
    return (
      <Box sx={{ paddingTop: 4, paddingBottom: 4 }}>
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
              className={this.state.relevance ? "active" : ""}
              onClick={this.changeTab}
              data-tab="relevance"
            >
              Relevance
              <Radio checked={this.state.relevance && "checked"} size="small" />
            </li>
            <li
              className={this.state.date ? "active" : ""}
              onClick={this.changeTab}
              data-tab="date"
            >
              Recent
              <Radio checked={this.state.date && "checked"} size="small" />
            </li>
            <li
              className={this.state.rating ? "active" : ""}
              onClick={this.changeTab}
              data-tab="rating"
            >
              Rating
              <Radio checked={this.state.rating && "checked"} size="small" />
            </li>
          </ul>
        </Box>

        {this.state.relevance &&
          "items" in this.props.state.youtubeVideosRelevance && (
            <Box className="youtube-tab" sx={{ marginTop: 4, marginBottom: 4 }}>
              <Masonry
                className="youtube-posts"
                columns={{ xs: 1, md: 2, lg: 3, xl: 4 }}
                spacing={2}
              >
                {this.props.state.youtubeVideosRelevance.items.map(
                  (post, index) => {
                    return this.post(post);
                  }
                )}
              </Masonry>
            </Box>
          )}

        {this.state.rating && "items" in this.props.state.youtubeVideosRating && (
          <Box className="youtube-tab" sx={{ marginTop: 4, marginBottom: 4 }}>
            <Masonry
              className="youtube-posts"
              columns={{ xs: 1, md: 2, lg: 3, xl: 4 }}
              spacing={2}
            >
              {this.props.state.youtubeVideosRating.items.map((post, index) => {
                return this.post(post);
              })}
            </Masonry>
          </Box>
        )}

        {this.state.date && "items" in this.props.state.youtubeVideosDate && (
          <Box className="youtube-tab" sx={{ marginTop: 4, marginBottom: 4 }}>
            <Masonry
              className="youtube-posts"
              columns={{ xs: 1, md: 2, lg: 3, xl: 4 }}
              spacing={2}
            >
              {this.props.state.youtubeVideosDate.items.map((post, index) => {
                return this.post(post);
              })}
            </Masonry>
          </Box>
        )}
      </Box>
    );
  }
}
