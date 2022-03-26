import React, { Component } from "react";
import { Box, Container, Typography } from "@mui/material";

import TwitterIcon from "@mui/icons-material/Twitter";
import RedditIcon from "@mui/icons-material/Reddit";

// components
import Twitter from "./components/Twitter";
import Reddit from "./components/Reddit";

export default class Dash extends Component {
  /*
  constructor(props) {
    super(props);

    this.state = {
      twitter: true,
      reddit: false,
    };
  }
  */

  render() {
    return (
      <Container id="dashboard" maxWidth="xl">
        {this.props.state.previousSearchQuery && (
          <Box className="previous-search-query" sx={{ paddingTop: 2 }}>
            <Typography variant="h4" sx={{ color: "#999999" }}>
              Results for '{this.props.state.previousSearchQuery}'
            </Typography>
          </Box>
        )}

        {this.props.state.twitter && (
          <Twitter
            setAppState={this.props.setAppState}
            state={this.props.state}
          />
        )}

        {this.props.state.reddit && (
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
