import React, { Component } from "react";
import moment from "moment";

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

export default class Instagram extends Component {
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

  post = (post) => {
    return (
      <Paper elevation={3} className="reddit-post post-card" key={post.data.id}>
        <a
          href="#"
          //href={"https://reddit.com" + post.data.permalink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Box
            className="details"
            sx={{ paddingTop: 3, paddingLeft: 2, paddingRight: 2 }}
          >
            <Typography variant="caption" style={{ color: "#999999" }}>
              Posted by
            </Typography>
            <span style={{ color: "#999999" }}> · </span>
            <Typography variant="caption" style={{ color: "#999999" }}>
              {/*moment.unix(post.data.created).utc().fromNow()*/}
            </Typography>
          </Box>
        </a>

        <Box
          className="post-text"
          sx={{ paddingTop: 2, paddingLeft: 2, paddingRight: 2 }}
        >
          <Typography variant="body1">
            {/*this.decodeText(post.data.title)*/}
          </Typography>
        </Box>
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
            class={"filter-options " + (this.state.filterToggle && "active")}
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

        <Box className="ig-tab" sx={{ marginTop: 4, marginBottom: 4 }}>
          <Masonry
            className="ig-posts"
            columns={{ xs: 1, md: 2, lg: 3, xl: 4 }}
            spacing={2}
          >
            {/*this.props.state.redditNew &&
                this.props.state.redditNew.slice(0, 50).map((post, index) => {
                  return this.post(post);
                })*/}
          </Masonry>
        </Box>
      </Box>
    );
  }
}
