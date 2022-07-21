import React, { Component } from "react";
import { Box, Container, Typography } from "@mui/material";

// components
import Home from "./components/Home";

export default class Dash extends Component {
  render() {
    return (
      <Container id="dashboard" maxWidth="100%">
        <Home setAppState={this.props.setAppState} state={this.props.state} />
      </Container>
    );
  }
}
