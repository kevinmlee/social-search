import React, { Component } from "react";
import { Container } from "@mui/material";

// components
import UserInput from "./components/UserInput";
import Tweets from "./components/Tweets";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      twitterResults: [],
    };
  }

  componentDidMount = async () => {};

  setCustomState = async (name, value) => {
    await this.setState({ [name]: value });

    console.log(this.state.twitterResults);
  };

  render() {
    return (
      <Container id="dashboard">
        <UserInput setCustomState={this.setCustomState} />

        <Tweets twitterResults={this.state.twitterResults} />
      </Container>
    );
  }
}
