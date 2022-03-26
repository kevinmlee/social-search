import React, { Component } from "react";

import { AppBar, Box, Toolbar, IconButton } from "@mui/material";

import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";

import UserInput from "./components/UserInput";

export default class Header extends Component {
  render() {
    return (
      <Box sx={{ flexGrow: 1, marginTop: "50px" }}>
        <AppBar position="fixed" sx={{ display: { md: "flex" } }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
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
              <UserInput setAppState={this.props.setAppState} />
            </Box>

            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                //aria-controls={menuId}
                aria-haspopup="true"
                //onClick={}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/*renderMobileMenu*/}
        {/*renderMenu*/}
      </Box>
    );
  }
}
