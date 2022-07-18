import React, { Component } from "react";
//import axios from "axios";

import { Box } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
//import CloseIcon from "@mui/icons-material/Close";

export default class User extends Component {
  constructor(props) {
    super(props);

    this.state = { opened: false };

    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount = async () => {
    document.addEventListener("mousedown", this.handleClickOutside);
  };

  componentWillUnmount = () => {
    document.removeEventListener("mousedown", this.handleClickOutside);
  };

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target))
      this.setState({ opened: false });
  };

  render() {
    return (
      <Box id="user" ref={this.wrapperRef}>
        {/* if no user is logged in, show sign in button. otherwise show their avatar */}
        <div class="user">
          {this.props.state.authenticated ? (
            <div class="avatar" onClick={() => this.setState({ opened: true })}>
              <PersonIcon className="default" />
            </div>
          ) : (
            <a
              href="#should-go-to-signup-signin-page"
              class="sign-in cta-button"
            >
              Sign in
            </a>
          )}
        </div>

        <div class={"account " + (this.state.opened && "opened")}>
          <div class="top">
            <div class="avatar">
              <PersonIcon className="default" />
            </div>

            <div class="name">First name Last name</div>
            <div class="email">email@address.com</div>
          </div>

          <ul class="options">
            <li>Profile</li>
            <li>Settings</li>
            <li>Sign out</li>
          </ul>
        </div>
      </Box>
    );
  }
}
