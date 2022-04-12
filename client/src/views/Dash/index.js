import React, { Component } from "react";
import { Box, Container, Typography } from "@mui/material";

// components
import Home from "./components/Home";
import Twitter from "./components/Twitter";
import Reddit from "./components/Reddit";
import YouTube from "./components/YouTube";
import Trends from "./components/Trends";
import Instagram from "./components/Instagram";
import Settings from "./components/Settings";

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
      <Container id="dashboard" maxWidth="100%">
        {this.props.state.previousSearchQuery && !this.props.state.home && (
          <Box className="previous-search-query" sx={{ paddingTop: 2 }}>
            <Typography variant="h4" sx={{ color: "#999999" }}>
              Results for '{this.props.state.previousSearchQuery}'
            </Typography>
          </Box>
        )}

        {!this.props.state.previousSearchQuery &&
          !this.props.state.home &&
          !this.props.state.settings && (
            <Box
              className="welcome-message"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <Typography variant="h3">Hello</Typography>
              <Typography variant="body1" sx={{ paddingTop: 1 }}>
                Search for a person or topic to get started.
              </Typography>
            </Box>
          )}

        {this.props.state.home && (
          <Home
            setAppState={this.props.setAppState}
            state={this.props.state}
            updateLocalStorage={this.props.updateLocalStorage}
          />
        )}

        {this.props.state.twitter && this.props.state.previousSearchQuery && (
          <Twitter
            setAppState={this.props.setAppState}
            state={this.props.state}
          />
        )}

        {this.props.state.reddit && this.props.state.previousSearchQuery && (
          <Reddit
            setAppState={this.props.setAppState}
            state={this.props.state}
          />
        )}

        {this.props.state.trends && this.props.state.previousSearchQuery && (
          <Trends
            setAppState={this.props.setAppState}
            state={this.props.state}
          />
        )}

        {this.props.state.youtube && this.props.state.previousSearchQuery && (
          <YouTube
            setAppState={this.props.setAppState}
            state={this.props.state}
          />
        )}

        {this.props.state.settings && (
          <Settings
            setAppState={this.props.setAppState}
            updateLocalStorage={this.props.updateLocalStorage}
            state={this.props.state}
          />
        )}

        {/*{this.props.state.instagram && (
          <Instagram
            setAppState={this.props.setAppState}
            state={this.props.state}
          />
        )}*/}

        {/* 
        other APIs to use

        instagram

        */}
      </Container>
    );
  }
}
