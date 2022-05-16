import React, { Component } from "react";

import { Box } from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridView";
import HdrStrongIcon from "@mui/icons-material/HdrStrong";
import TwitterIcon from "@mui/icons-material/Twitter";
import RedditIcon from "@mui/icons-material/Reddit";
import SsidChartIcon from "@mui/icons-material/SsidChart";
import YouTubeIcon from "@mui/icons-material/YouTube";
//import SettingsIcon from "@mui/icons-material/Settings";

export default class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount = () => {
    document.addEventListener("mousedown", this.handleClickOutside);
  };

  componentWillUnmount = () => {
    document.removeEventListener("mousedown", this.handleClickOutside);
  };

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.props.setAppState("sidebar", false);
      //alert("You clicked outside of me!");
    }
  };

  render() {
    return (
      <Box
        className={"sidebar " + (this.props.state.sidebar && "expanded")}
        ref={this.wrapperRef}
        sx={{}}
      >
        <div className="logo">
          <HdrStrongIcon sx={{ fontSize: "50px" }} />
        </div>

        <ul className="menu">
          <li
            className="menu-item-container tier-1"
            onClick={this.props.changeTab}
            data-tab="home"
          >
            <div
              className={"menu-item " + (this.props.state.home ? "active" : "")}
            >
              <GridViewIcon className="home-icon" />
              <span>Home</span>
            </div>
          </li>

          <li className="menu-item-container tier-1">
            <div className="menu-section-label">Platforms</div>

            <ul className="sub-menu">
              <li
                className={
                  "menu-item tier-2 " +
                  (this.props.state.reddit ? "active" : "")
                }
                onClick={this.props.changeTab}
                data-tab="reddit"
              >
                <RedditIcon className="reddit-icon" />
                <span>Reddit</span>
              </li>

              <li
                className={
                  "menu-item tier-2 " +
                  (this.props.state.twitter ? "active" : "")
                }
                onClick={this.props.changeTab}
                data-tab="twitter"
              >
                <TwitterIcon className="twitter-icon" />
                <span>Twitter</span>
              </li>

              <li
                className={
                  "menu-item tier-2 " +
                  (this.props.state.youtube ? "active" : "")
                }
                onClick={this.props.changeTab}
                data-tab="youtube"
              >
                <YouTubeIcon className="youtube-icon" />
                <span>YouTube</span>
              </li>
            </ul>
          </li>

          <li className="menu-item-container tier-1">
            <div className="menu-section-label">Reports</div>

            <ul className="sub-menu">
              <li
                className={
                  "menu-item tier-2 " + (this.props.state.trends && "active")
                }
                onClick={this.props.changeTab}
                data-tab="trends"
              >
                <SsidChartIcon className="trends-icon" />
                <span>Trends</span>
              </li>
            </ul>
          </li>

          {/*<div
            className={
              "menu-item " + (this.props.state.settings ? "active" : "")
            }
            onClick={this.props.changeTab}
            data-tab="settings"
          >
            <SettingsIcon className="settings-icon" />
            <span>Settings</span>
          </div>
          */}
        </ul>
      </Box>
    );
  }
}
