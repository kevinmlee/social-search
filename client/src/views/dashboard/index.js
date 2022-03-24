import React, { Component } from "react";
import { Container, Backdrop } from "@mui/material";

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

      backdropImage: "",
      backdropToggle: false,
    };
  }

  componentDidMount = async () => {};

  setCustomState = async (name, value) => {
    await this.setState({ [name]: value });
  };

  toggle = (state) => {
    this.setState({ [state]: !this.state[state] });
  };

  imageBackdrop = () => {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={() => this.toggle("backdropToggle")}
        onClick={() => this.toggle("backdropToggle")}
      >
        <img src={this.state.backdropImage} alt="" />
      </Backdrop>
    );
  };

  render() {
    return (
      <Container id="dashboard" maxWidth="md">
        <UserInput setCustomState={this.setCustomState} />

        <Tweets
          setCustomState={this.setCustomState}
          searchQuery={this.state.searchQuery}
          twitterUser={this.state.twitterUser}
          tweetsByUserId={this.state.tweetsByUserId}
          tweetsByRecent={this.state.tweetsByRecent}
        />

        {this.state.backdropToggle && this.imageBackdrop()}
      </Container>
    );
  }
}
