import React, { Component } from "react";
import axios from "axios";

import { Alert, Box, Button, TextField } from "@mui/material";

export default class UserInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",

      twitterResults: [],
      twitterUserID: "",

      searchQueryBlankError: false,
    };
  }

  componentDidMount = async () => {};

  handleChange = async (event) => {
    const NAME = event.target.name;
    const VALUE = event.target.value;

    if (NAME === "search" && VALUE !== "")
      this.setState({ searchQueryBlankError: false });

    this.setState({ [NAME]: VALUE.toString() });
  };

  oneWord = (string) => {
    var regexp = /[a-zA-Z]+\s+[a-zA-Z]+/g;
    if (regexp.test(string)) return false;
    else return true;
  };

  search = async (e) => {
    e.preventDefault();

    if (this.state.search === "") {
      this.setState({ searchQueryBlankError: true });
    } else {
      if (this.oneWord(this.state.search)) {
        await this.searchByUsername();
        await this.getTweetsByUserID();
      }
      await this.searchByRecent();
    }
  };

  searchByUsername = async (e) => {
    return await axios
      .put("/twitter/search/username", {
        searchQuery: this.state.search,
      })
      .then(
        (response) => {
          console.log("searchByUsername", response);
          this.setState({ twitterUserID: response.data.twitterResults.id });
          this.props.setCustomState(
            "username",
            response.data.twitterResults.username
          );
        },
        (error) => {
          console.log(error);
        }
      );
  };

  getTweetsByUserID = async (e) => {
    return await axios
      .put("/twitter/get/tweets/id", {
        userId: this.state.twitterUserID,
      })
      .then(
        (response) => {
          console.log("getTweetsByUserID", response);
          this.props.setCustomState("tweetsByUserId", response.data.tweets);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  searchByRecent = async (e) => {
    return await axios
      .put("/twitter/search", {
        searchQuery: this.state.search,
      })
      .then(
        (response) => {
          this.props.setCustomState("tweetsByRecent", response.data.tweets);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  render() {
    return (
      <div className="user-input">
        <Box>
          <form onSubmit={this.search}>
            <div className="flex-container">
              <TextField
                className="standard-input"
                label="Search query"
                variant="standard"
                name="search"
                defaultValue={this.state.search}
                onChange={this.handleChange}
                fullWidth={true}
              />
              <Button type="submit" variant="contained">
                Search
              </Button>
            </div>
          </form>
        </Box>

        {this.state.searchQueryBlankError && (
          <Alert severity="error" sx={{ marginTop: 4 }}>
            Search query cannot be blank. Please enter a search query and try
            again.
          </Alert>
        )}
      </div>
    );
  }
}
