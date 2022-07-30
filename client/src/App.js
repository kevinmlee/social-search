import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Backdrop, Box } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import "./styles/main.css";

// components
import Header from "./views/Header";
import Sidebar from "./views/Sidebar/Sidebar";
import Dash from "./views/Dash";
import SignIn from "./views/SignIn/SignIn";
import SignUp from "./views/SignUp";
import NotFound from "./views/NotFound/NotFound";
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

      // google
      trendingTopics: [],
      trendingQueries: [],
      interestOverTime: {},

      backdropImage: "",
      backdropToggle: false,
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

  /*
  setAppState = async (state) => {
    new Promise((resolve) => this.setState(state, resolve));
  };
  */

  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
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

  backToTopButton = () => {
    return (
      <div className="back-to-top" onClick={() => this.scrollToTop()}>
        <KeyboardArrowUpIcon />
      </div>
    );
  };

  isInnerPage = () => {
    let pathname = window.location.pathname;
    return pathname !== "/signin" && pathname !== "/signup";
  };

  render() {
    return (
      <Box>
        {this.isInnerPage() && (
          <Box>
            <Header state={this.state} />
            <Sidebar />
          </Box>
        )}

        <div
          id="main-content"
          className={!this.isInnerPage() ? "fw" : undefined}
        >
          <Router>
            <Routes>
              <Route exact path="/" element={<Dash />} />
              <Route exact path="/reddit" element={<Reddit />} />
              <Route exact path="/twitter" element={<Twitter />} />
              <Route exact path="/youtube" element={<YouTube />} />
              <Route exact path="/signin" element={<SignIn />} />
              <Route exact path="/signup" element={<SignUp />} />
              <Route exact path="/settings" element={<Settings />} />
              <Route element={<NotFound />} />
            </Routes>
          </Router>
        </div>

        {this.state.backdropToggle && this.imageBackdrop()}
        {this.state.backToTop && this.backToTopButton()}
      </Box>
    );
  }
}
