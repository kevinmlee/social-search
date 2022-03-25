import React, { Component } from "react";
import { Box, Container, Typography } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";

// components
import Tweets from "./components/Tweets";

export default class Dashboard extends Component {
  /*
  constructor(props) {
    super(props);

    this.state = {
      tweetsByUserId: [{ data: [], includes: [] }],
      tweetsByRecent: [{ data: [], includes: [] }],
      twitterUser: {},

      searchQuery: "",

      backdropImage: "",
      backdropToggle: false,
    };
  }*/

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

        <Box className="media-tabs">
          <TwitterIcon sx={{ color: "#1DA1F2", fontSize: "50px" }} />
        </Box>

        <Tweets setAppState={this.props.setAppState} state={this.props.state} />

        {/* 
        other APIs to use

        instagram
        reddit
        
        */}
      </Container>
    );
  }
}
