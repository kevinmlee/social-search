import React, { Component } from "react";
import { Box, Container, Typography } from "@mui/material";

import TwitterIcon from "@mui/icons-material/Twitter";
import RedditIcon from "@mui/icons-material/Reddit";

// components
import Twitter from "./components/Twitter";
import Reddit from "./components/Reddit";

export default class Dash extends Component {
  constructor(props) {
    super(props);

    this.state = {
      twitter: true,
      reddit: false,
    };
  }

  changeTab = (event) => {
    const tab = event.target.getAttribute("data-tab");

    if (tab === "twitter")
      this.setState({ twitter: true, reddit: false, instagram: false });
    else if (tab === "reddit")
      this.setState({ twitter: false, reddit: true, instagram: false });
    else if (tab === "instagram")
      this.setState({ twitter: false, reddit: false, instagram: true });
  };

  render() {
    return (
      <Container id="dashboard" maxWidth="xl" sx={{ marginTop: 8 }}>
        {this.props.state.previousSearchQuery && (
          <Box className="previous-search-query" sx={{ paddingTop: 3 }}>
            <Typography variant="overline" sx={{ color: "#999999" }}>
              Results for '{this.props.state.previousSearchQuery}'
            </Typography>
          </Box>
        )}

        <Box className="media-tabs" sx={{ paddingTop: 3 }}>
          <div
            className={"media-tab " + (this.state.twitter ? "active" : "")}
            onClick={this.changeTab}
            data-tab="twitter"
            size="large"
          >
            <TwitterIcon
              className="twitter-icon"
              sx={{ color: "#1DA1F2" }}
              onClick={this.changeTab}
              data-tab="twitter"
            />
            <span onClick={this.changeTab} data-tab="twitter">
              Twitter
            </span>
          </div>

          <div
            className={"media-tab " + (this.state.reddit ? "active" : "")}
            onClick={this.changeTab}
            data-tab="reddit"
            size="large"
          >
            <RedditIcon
              className="reddit-icon"
              sx={{ color: "#FF5400" }}
              onClick={this.changeTab}
              data-tab="reddit"
            />
            <span onClick={this.changeTab} data-tab="reddit">
              Reddit
            </span>
          </div>
        </Box>

        {this.state.twitter && (
          <Twitter
            setAppState={this.props.setAppState}
            state={this.props.state}
          />
        )}

        {this.state.reddit && (
          <Reddit
            setAppState={this.props.setAppState}
            state={this.props.state}
          />
        )}

        {/* 
        other APIs to use

        instagram
       
        
        */}
      </Container>
    );
  }
}
