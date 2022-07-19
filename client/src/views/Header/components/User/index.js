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
        <div className="user">
          {this.props.state.authenticated ? (
            <div
              className="avatar"
              onClick={() => this.setState({ opened: true })}
            >
              <PersonIcon className="default" />
            </div>
          ) : (
            <a href="/signin" className="sign-in cta-button">
              Sign in
            </a>
          )}
        </div>

        <div className={"account " + (this.state.opened && "opened")}>
          <div className="top">
            <div className="avatar">
              <PersonIcon className="default" />
            </div>

            <div className="name">First name Last name</div>
            <div className="email">email@address.com</div>
          </div>

          <ul className="options">
            <li>Profile</li>
            <li>Settings</li>
            <li>Sign out</li>
          </ul>
        </div>
      </Box>
    );
  }
}
