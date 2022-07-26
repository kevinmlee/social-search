import React, { Component } from "react";
import { Container } from "@mui/material";

// components
import Home from "./components/Home";

export default class Dash extends Component {
  render() {
    return (
      <Container id="dashboard" maxWidth="100%">
        <Home />
      </Container>
    );
  }
}
