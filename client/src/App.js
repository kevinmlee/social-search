import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  //Redirect,
} from "react-router-dom";
//import moment from "moment";
//import ReactNotification from "react-notifications-component";
//import "react-notifications-component/dist/theme.css";

import { Alert, Backdrop, Box, CircularProgress } from "@mui/material";

import "./styles/main.css";

// components
import Header from "./views/Header";
import Sidebar from "./views/Sidebar";
import Dash from "./views/Dash";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // header
      scrollStatus: "",

      // sidebar
      twitter: true,
      reddit: false,

      // twitter
      tweetsByUserId: [{ data: [], includes: [] }],
      tweetsByRecent: [{ data: [], includes: [] }],
      twitterUser: {},

      // reddit
      redditHot: [],
      redditNew: [],

      searchQuery: "",
      previousSearchQuery: "",

      backdropImage: "",
      backdropToggle: false,

      loadingBackdrop: false,

      searchQueryBlankError: false,
    };
  }

  componentDidMount = () => {
    window.addEventListener("scroll", () => {
      let scrollStatus = "sticky";
      if (window.scrollY === 0) scrollStatus = "top";

      this.setState({ scrollStatus });
    });
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll");
  };

  changeTab = (event) => {
    const tab = event.target.getAttribute("data-tab");

    if (tab === "twitter")
      this.setState({ twitter: true, reddit: false, instagram: false });
    else if (tab === "reddit")
      this.setState({ twitter: false, reddit: true, instagram: false });
    else if (tab === "instagram")
      this.setState({ twitter: false, reddit: false, instagram: true });
  };

  setAppState = async (name, value) => {
    await this.setState({ [name]: value });
  };

  toggle = (state) => {
    this.setState({ [state]: !this.state[state] });
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

  render() {
    return (
      <Box>
        <Header state={this.state} setAppState={this.setAppState} />
        <Sidebar
          state={this.state}
          setAppState={this.setAppState}
          changeTab={this.changeTab}
        />

        {this.alerts()}

        <div id="main-content" className="expanded">
          <Router>
            <Switch>
              <Route exact path="/">
                <Dash state={this.state} setAppState={this.setAppState} />
              </Route>
            </Switch>
          </Router>
        </div>

        {this.state.backdropToggle && this.imageBackdrop()}
        {this.state.loadingBackdrop && this.loadingBackdrop()}
      </Box>
    );
  }
}
