import React, { Component } from "react";
//import axios from "axios";

import { Box, IconButton, TextField, Typography } from "@mui/material";
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
        <div className="avatar" onClick={() => this.setState({ opened: true })}>
          {/* if no user is logged in, show the person icon */}
          <PersonIcon className="default" />
        </div>
      </Box>
    );
  }
}
