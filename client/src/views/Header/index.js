import React, { Component } from "react";
import { AppBar, Box, Toolbar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import UserInput from "./components/UserInput";
import User from "./components/User";

import "./Header.css";

export default class Header extends Component {
  render() {
    return (
      <Box id="header" sx={{ flexGrow: 1, marginTop: "50px" }}>
        <AppBar
          className={"expanded " + this.props.state.scrollStatus}
          sx={{ display: { md: "flex" } }}
        >
          <Toolbar className="d-flex space-between align-center">
            <Box className="search" sx={{ position: "relative" }}>
              <SearchIcon
                className="search-icon"
                sx={{
                  position: "absolute",
                  top: "50%",
                  transform: " translateY(-50%)",
                  left: "8px",
                }}
              />
              <UserInput
                setAppState={this.props.setAppState}
                reset={this.props.reset}
              />
            </Box>

            <Box>
              <User state={this.props.state} />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }
}
