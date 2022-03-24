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
      tweetsByRecent: [{ data: [], includes: [] }],
      twitterUser: {},

      searchQuery: "",
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
          searchQuery={this.state.searchQuery}
          twitterUser={this.state.twitterUser}
          tweetsByUserId={this.state.tweetsByUserId}
          tweetsByRecent={this.state.tweetsByRecent}
        />
      </Container>
    );
  }
}
