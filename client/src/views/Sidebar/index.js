import React, { Component } from "react";

import { Box } from "@mui/material";
import HdrStrongIcon from "@mui/icons-material/HdrStrong";
import TwitterIcon from "@mui/icons-material/Twitter";
import RedditIcon from "@mui/icons-material/Reddit";

export default class Sidebar extends Component {
  render() {
    return (
      <Box className="sidebar expanded" sx={{}}>
        <div className="logo">
          <HdrStrongIcon sx={{ fontSize: "50px" }} />
        </div>

        <div className="menu">
          <div
            className={
              "menu-item " + (this.props.state.twitter ? "active" : "")
            }
            onClick={this.props.changeTab}
            data-tab="twitter"
          >
            <TwitterIcon
              className="twitter-icon"
              onClick={this.props.changeTab}
              data-tab="twitter"
            />
            <span onClick={this.props.changeTab} data-tab="twitter">
              Twitter
            </span>
          </div>
          <div
            className={"menu-item " + (this.props.state.reddit ? "active" : "")}
            onClick={this.props.changeTab}
            data-tab="reddit"
          >
            <RedditIcon
              className="reddit-icon"
              onClick={this.props.changeTab}
              data-tab="reddit"
            />
            <span onClick={this.props.changeTab} data-tab="reddit">
              Reddit
            </span>
          </div>
        </div>
      </Box>
    );
  }
}
