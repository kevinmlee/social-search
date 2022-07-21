import React, { Component } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  //Redirect,
} from "react-router-dom";
//import moment from "moment";
//import ReactNotification from "react-notifications-component";
//import "react-notifications-component/dist/theme.css";

import { Backdrop, Box, CircularProgress } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import "./styles/main.css";

// components
import Header from "./views/Header";
import Sidebar from "./views/Sidebar";
import Dash from "./views/Dash";
import SignIn from "./views/SignIn";
import SignUp from "./views/SignUp";
import NotFound from "./views/NotFound";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authenticated: false,

      // header
      scrollStatus: "",

      // sidebar
      sidebar: false,
      home: true,
      reddit: false,
      twitter: false,
      instagram: false,
      youtube: false,
      trends: false,
      settings: false,

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

    this.getGeolocation();
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

  alerts = () => {
    /*
    if (this.state.searchQueryBlankError)
      return (
        <Alert severity="error">
          Search query cannot be blank. Please enter a search query and try
          again.
        </Alert>
      );
    */
  };

  updateLocalStorage = (key, value) => {
    let userSettings = {};

    if (localStorage.getItem("userSettings"))
      userSettings = JSON.parse(localStorage.getItem("userSettings"));

    userSettings[key] = value;

    localStorage.setItem("userSettings", JSON.stringify(userSettings));
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

  getGeolocation = async () => {
    await axios.get("/get/geolocation").then(
      async (response) => {
        await this.setState({ geolocation: response });
      },
      (error) => console.log(error)
    );
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
                updateLocalStorage={this.updateLocalStorage}
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

        {this.alerts()}

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
                  <Dash
                    state={this.state}
                    setAppState={this.setAppState}
                    updateLocalStorage={this.updateLocalStorage}
                  />
                }
              />

              <Route
                exact
                path="/signin"
                element={
                  <SignIn
                    state={this.state}
                    setAppState={this.setAppState}
                    updateLocalStorage={this.updateLocalStorage}
                  />
                }
              />

              <Route
                exact
                path="/signup"
                element={
                  <SignUp
                    state={this.state}
                    setAppState={this.setAppState}
                    updateLocalStorage={this.updateLocalStorage}
                  />
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
