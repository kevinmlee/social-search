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

  signOut = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  render() {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
      <Box id="user" ref={this.wrapperRef}>
        {/* if no user is logged in, show sign in button. otherwise show their avatar */}
        <div className="user">
          {user ? (
            <div
              className="avatar"
              onClick={() => this.setState({ opened: true })}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.firstName + " " + user.lastName}
                />
              ) : (
                <PersonIcon className="default" />
              )}
            </div>
          ) : (
            <a href="/signin" className="sign-in cta-button">
              Sign in
            </a>
          )}
        </div>

        {user && (
          <div className={"account " + (this.state.opened && "opened")}>
            <div className="top">
              <div className="avatar">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.firstName + " " + user.lastName}
                  />
                ) : (
                  <PersonIcon className="default" />
                )}
              </div>

              <div className="name">{user.firstName + " " + user.lastName}</div>
              <div className="email">{user.username}</div>
            </div>

            <ul className="options">
              <li>
                <span>Profile</span>
              </li>
              <li>
                <span>Settings</span>
              </li>
              <li onClick={this.signOut}>
                <span className="sign-out">Sign out</span>
              </li>
            </ul>
          </div>
        )}
      </Box>
    );
  }
}
