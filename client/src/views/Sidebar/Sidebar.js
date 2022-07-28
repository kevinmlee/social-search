import React, { useState, useRef, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import GridViewIcon from "@mui/icons-material/GridView";
import TwitterIcon from "@mui/icons-material/Twitter";
import RedditIcon from "@mui/icons-material/Reddit";
import YouTubeIcon from "@mui/icons-material/YouTube";
//import SettingsIcon from "@mui/icons-material/Settings";

import "./Sidebar.css";

const platforms = [
  { name: "Reddit", icon: <RedditIcon />, href: "/reddit" },
  { name: "Twitter", icon: <TwitterIcon />, href: "/twitter" },
  { name: "YouTube", icon: <YouTubeIcon />, href: "/youtube" },
];

export default function Sidebar() {
  const [sidebar, setSidebar] = useState(false);
  const ref = useRef();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useOutsideClick(ref, (e) => {
    if (
      e.target.classList.contains("menu-btn-open") ||
      e.target.classList.contains("menu-button", "false")
    )
      setSidebar(true);
    else setSidebar(false);
  });

  return (
    <Box className="sidebar-container">
      <IconButton
        className={"menu-button " + (sidebar && "opened")}
        size="large"
        edge="start"
        color="inherit"
        aria-label="open drawer"
        sx={{ mr: 2 }}
      >
        {sidebar ? (
          <CloseIcon className="menu-btn-close" />
        ) : (
          <MenuIcon className="menu-btn-open" />
        )}
      </IconButton>
      <Box className={"sidebar " + (sidebar && "expanded")} ref={ref}>
        <div className="logo">
          <h2>Currently</h2>
        </div>

        <div className="menu">
          <a
            className="menu-item-container tier-1"
            onClick={() => {
              window.location.pathname === "/" && scrollToTop();
            }}
            href={window.location.pathname !== "/" && "/"}
            data-tab="home"
          >
            <div
              className={
                "menu-item " + (window.location.pathname === "/" && "active")
              }
            >
              <GridViewIcon className="home-icon" />
              <span>Home</span>
            </div>
          </a>

          <div className="menu-item-container tier-1">
            <div className="menu-section-label">Platforms</div>

            <div className="sub-menu">
              {platforms.map((platform) => (
                <a
                  className={
                    "menu-item tier-2 " +
                    (window.location.pathname.includes(platform.href) &&
                      "active")
                  }
                  onClick={(e) => {
                    window.location.pathname === platform.href && scrollToTop();
                  }}
                  href={
                    window.location.pathname !== platform.href && platform.href
                  }
                  data-tab={platform.name.toLowerCase()}
                  key={platform.name}
                >
                  {platform.icon}
                  <span>{platform.name}</span>
                </a>
              ))}
            </div>
          </div>

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
        </div>
      </Box>
    </Box>
  );
}

const useOutsideClick = (ref, callback) => {
  const handleClick = (e) => {
    if (ref.current && !ref.current.contains(e.target)) callback(e);
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  });
};
