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

export default class YouTube extends Component {
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

    this.searchVideos();
  };

  componentWillUnmount = () => {
    document.removeEventListener("mousedown", this.handleClickOutside);
  };

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target))
      this.setState({ filterToggle: false });
  };

  changeTab = (event) => {
    const tab = event.target.getAttribute("data-tab");

    if (tab === "recent")
      this.setState({ recent: true, popular: false, userTweets: false });
    else if (tab === "popular")
      this.setState({ recent: false, popular: true, userTweets: false });

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
    return string.replaceAll("&amp;", "&").replaceAll("&lt;", "<");
  };

  searchVideos = async () => {
    return await axios
      .put("/youtube/search", {
        //searchQuery: this.props.state.previousSearchQuery,
        searchQuery: "spacex",
      })
      .then(
        (response) => {
          console.log("youtube search results", response);

          if (response.status === 200) {
            //console.log("youtube search results", response.data.data.children);
            //this.props.setAppState("youtubeVideos", response.data.ata);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  };

  post = (post) => {
    return <Paper elevation={3} className="youtube-post post-card"></Paper>;
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
              className={this.state.recent ? "active" : ""}
              onClick={this.changeTab}
              data-tab="recent"
            >
              Recent
              <Radio checked={this.state.recent && "checked"} size="small" />
            </li>
            <li
              className={this.state.popular ? "active" : ""}
              onClick={this.changeTab}
              data-tab="popular"
            >
              Hot
              <Radio checked={this.state.popular && "checked"} size="small" />
            </li>
          </ul>
        </Box>

        {/*
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
              */}
      </Box>
    );
  }
}
