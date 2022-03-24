import React, { Component } from "react";
import { Container } from "@mui/material";

// components
import UserInput from "./components/UserInput";
import Tweets from "./components/Tweets";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tweetsByUserId: [{ data: [], includes: [] }],
      includesByUserId: [],
      tweetsByRecent: [],
    };
  }

  componentDidMount = async () => {};

  setCustomState = async (name, value) => {
    await this.setState({ [name]: value });
  };

  render() {
    return (
      <Container id="dashboard" maxWidth="md">
        <UserInput setCustomState={this.setCustomState} />

        <Tweets
          tweetsByUserId={this.state.tweetsByUserId}
          includesByUserId={this.state.includesByUserId}
          tweetsByRecent={this.state.tweetsByRecent}
        />
      </Container>
    );
  }
}
