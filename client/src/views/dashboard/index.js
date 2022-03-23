import React, { Component } from "react";
import { Container } from "@mui/material";

// components
import UserInput from "./components/UserInput";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = async () => {};

  render() {
    return (
      <Container id="dashboard">
        <UserInput />
      </Container>
    );
  }
}
