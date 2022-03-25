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
import Dash from "./views/Dash";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
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

  componentDidMount = async () => {};

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

  render() {
    return (
      <Box>
        <Header state={this.state} setAppState={this.setAppState} />

        {this.alerts()}

        <Router>
          <Switch>
            <Route exact path="/">
              <Dash state={this.state} setAppState={this.setAppState} />
            </Route>
          </Switch>
        </Router>

        {this.state.backdropToggle && this.imageBackdrop()}
        {this.state.loadingBackdrop && this.loadingBackdrop()}
      </Box>
    );
  }
}
