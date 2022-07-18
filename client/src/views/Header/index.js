import React, { Component } from "react";

import { AppBar, Box, Toolbar, IconButton } from "@mui/material";

import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";

import UserInput from "./components/UserInput";
import User from "./components/User";

export default class Header extends Component {
  render() {
    return (
      <Box sx={{ flexGrow: 1, marginTop: "50px" }}>
        <AppBar
          className={"expanded " + this.props.state.scrollStatus}
          sx={{ display: { md: "flex" } }}
        >
          <Toolbar className="d-flex space-between align-center">
            <IconButton
              className="menu-button"
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick={() => this.props.toggle("sidebar")}
            >
              <MenuIcon className="menu-btn" />
            </IconButton>

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
                state={this.props.state}
                setAppState={this.props.setAppState}
                reset={this.props.reset}
                updateLocalStorage={this.props.updateLocalStorage}
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
