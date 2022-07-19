import React, { Component } from "react";

import { Box } from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridView";
//import HdrStrongIcon from "@mui/icons-material/HdrStrong";
import TwitterIcon from "@mui/icons-material/Twitter";
import RedditIcon from "@mui/icons-material/Reddit";
//import SsidChartIcon from "@mui/icons-material/SsidChart";
import YouTubeIcon from "@mui/icons-material/YouTube";
//import SettingsIcon from "@mui/icons-material/Settings";
//import logo from "../../assets/news-256.svg";

export default class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.platforms = [
      { name: "Reddit", icon: <RedditIcon /> },
      { name: "Twitter", icon: <TwitterIcon /> },
      { name: "YouTube", icon: <YouTubeIcon /> },
    ];

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
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target))
      this.props.setAppState({ sidebar: false });
  };

  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  render() {
    return (
      <Box
        className={"sidebar " + (this.props.state.sidebar && "expanded")}
        ref={this.wrapperRef}
        sx={{}}
      >
        <div className="logo">
          {/*<img src={logo} alt="current logo" />*/}
          <h2>Currently</h2>
        </div>

        <ul className="menu">
          <li
            className="menu-item-container tier-1"
            onClick={
              this.props.state.home ? this.scrollToTop : this.props.changeTab
            }
            data-tab="home"
          >
            <div className={"menu-item " + (this.props.state.home && "active")}>
              <GridViewIcon className="home-icon" />
              <span>Home</span>
            </div>
          </li>

          <li className="menu-item-container tier-1">
            <div className="menu-section-label">Platforms</div>

            <ul className="sub-menu">
              {this.platforms.map((platform) => (
                <li
                  className={
                    "menu-item tier-2 " +
                    (this.props.state[platform.name.toLowerCase()] && "active")
                  }
                  onClick={
                    this.props.state[platform.name.toLowerCase()]
                      ? this.scrollToTop
                      : this.props.changeTab
                  }
                  data-tab={platform.name.toLowerCase()}
                  key={platform.name}
                >
                  {platform.icon}
                  <span>{platform.name}</span>
                </li>
              ))}
            </ul>
          </li>

          {/*<li className="menu-item-container tier-1">
            <div className="menu-section-label">Reports</div>

            <ul className="sub-menu">
              <li
                className={
                  "menu-item tier-2 " + (this.props.state.trends && "active")
                }
                onClick={
                  this.props.state.trends
                    ? this.scrollToTop
                    : this.props.changeTab
                }
                data-tab="trends"
              >
                <SsidChartIcon className="trends-icon" />
                <span>Trends</span>
              </li>
            </ul>
          </li>
              */}

          {/*<li className="menu-item-container tier-1">
            <div className="menu-section-label">Settings</div>

            <ul className="sub-menu">
              <li
                className={
                  "menu-item tier-2 " + (this.props.state.settings && "active")
                }
                onClick={
                  this.props.state.settings
                    ? this.scrollToTop
                    : this.props.changeTab
                }
                data-tab="settings"
              >
                <SettingsIcon className="settings-icon" />
                <span>Settings</span>
              </li>
            </ul>
              </li>*/}
        </ul>
      </Box>
    );
  }
}
