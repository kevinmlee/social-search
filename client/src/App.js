import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Backdrop, Box, CircularProgress } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import "./styles/main.css";

// components
import Header from "./views/Header";
import Sidebar from "./views/Sidebar/Sidebar";
import Dash from "./views/Dash";
import SignIn from "./views/SignIn/SignIn";
import SignUp from "./views/SignUp";
import NotFound from "./views/NotFound";
import Settings from "./views/Settings";

import Reddit from "./views/Platforms/Reddit/Reddit";
import Twitter from "./views/Platforms/Twitter/Twitter";
import YouTube from "./views/Platforms/YouTube/YouTube";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // header
      scrollStatus: "",

      // back to top button
      backToTop: false,

      // twitter
      tweetsByUserId: [],
      tweetsByRecent: [],
      twitterUser: {},
      twitterError: false,

      // reddit
      redditHot: [],
      redditNew: [],
      subreddits: [],

      // google
      trendingTopics: [],
      trendingQueries: [],
      interestOverTime: {},

      // youtube
      ytTrendingVideos: {},
      ytSearchResults: [],

      searchQuery: "",
      previousSearchQuery: "",

      // weather
      geolocation: {},
      weather: {},

      // settings
      followingSubreddits: ["news"],
      layout: "grid",

      backdropImage: "",
      backdropToggle: false,
      loadingBackdrop: false,
      searchQueryBlankError: false,

      // error handling
      fetchError: false,
    };
  }

  componentDidMount = () => {
    window.addEventListener("scroll", () => {
      let scrollStatus = "sticky";
      let backToTop = false;
      if (window.scrollY === 0) scrollStatus = "top";
      if (window.scrollY > 600) backToTop = true;

      this.setState({ scrollStatus, backToTop });
    });
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", null);
  };

  setAppState = async (state) => {
    new Promise((resolve) => this.setState(state, resolve));
  };

  changeTab = (event) => {
    const tabs = [
      "home",
      "twitter",
      "reddit",
      "instagram",
      "youtube",
      "trends",
      "settings",
    ];
    const selectedTab = event.currentTarget.getAttribute("data-tab");

    tabs.forEach((tab) => {
      if (tab === selectedTab) this.setState({ [tab]: true });
      else this.setState({ [tab]: false });
    });

    this.setState({ sidebar: false, fetchError: false });
  };

  toggle = (state) => {
    this.setState({ [state]: !this.state[state] });
  };

  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  reset = async () => {
    await this.setState({
      searchQuery: "",
      previousSearchQuery: "",
      tweetsByUserId: [],
      tweetsByRecent: [],
      twitterUser: {},
      twitterError: false,
      redditHot: [],
      redditNew: [],
      redditHotWorldNews: [],
      redditHotGlobal: [],
      youtubeVideosRelevance: {},
      youtubeVideosRating: {},
      youtubeVideosDate: {},
    });
  };

  imageBackdrop = () => {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={() => this.toggle("backdropToggle")}
        onClick={() => this.toggle("backdropToggle")}
      >
        <img src={this.state.backdropImage} alt="" />
      </Backdrop>
    );
  };

  loadingBackdrop = () => {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={() => this.toggle("loadingBackdrop")}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  };

  initialSearchBackdrop = () => {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={() => this.toggle("loadingBackdrop")}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  };

  backToTopButton = () => {
    return (
      <div className="back-to-top" onClick={() => this.scrollToTop()}>
        <KeyboardArrowUpIcon />
      </div>
    );
  };

  render() {
    return (
      <Box>
        {window.location.pathname !== "/signin" &&
          window.location.pathname !== "/signup" && (
            <Box>
              <Header
                state={this.state}
                setAppState={this.setAppState}
                toggle={this.toggle}
                reset={this.reset}
              />
              <Sidebar
                state={this.state}
                setAppState={this.setAppState}
                changeTab={this.changeTab}
                toggle={this.toggle}
              />
            </Box>
          )}

        <div
          id="main-content"
          className={
            window.location.pathname === "/signin" &&
            window.location.pathname === "/signup"
              ? "fw"
              : undefined
          }
        >
          <Router>
            <Routes>
              <Route
                exact
                path="/"
                element={
                  <Dash state={this.state} setAppState={this.setAppState} />
                }
              />

              <Route
                exact
                path="/reddit"
                element={
                  <Reddit state={this.state} setAppState={this.setAppState} />
                }
              />

              <Route
                exact
                path="/twitter"
                element={
                  <Twitter state={this.state} setAppState={this.setAppState} />
                }
              />

              <Route
                exact
                path="/youtube"
                element={
                  <YouTube state={this.state} setAppState={this.setAppState} />
                }
              />

              <Route exact path="/signin" element={<SignIn />} />

              <Route
                exact
                path="/signup"
                element={
                  <SignUp state={this.state} setAppState={this.setAppState} />
                }
              />

              <Route
                exact
                path="/settings"
                element={
                  <Settings state={this.state} setAppState={this.setAppState} />
                }
              />

              <Route component={NotFound} />
            </Routes>
          </Router>
        </div>

        {this.state.backdropToggle && this.imageBackdrop()}
        {this.state.loadingBackdrop && this.loadingBackdrop()}
        {this.state.backToTop && this.backToTopButton()}
      </Box>
    );
  }
}
