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
      this.props.setCustomState("searchQuery", this.state.search);
      this.props.setCustomState("username", "");
      this.props.setCustomState("tweetsByUserId", [{ data: [], includes: [] }]);
      this.props.setCustomState("tweetsByRecent", [{ data: [], includes: [] }]);

      if (this.oneWord(this.state.search)) {
        // if search query is a username (has @ symbol in front), remove symbol and continue to get user
        if (this.state.search.charAt(0) === "@")
          await this.setState({ search: this.state.search.substring(1) });

        const userFound = await this.searchByUsername();
        if (userFound) await this.getTweetsByUserID();
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
          //onsole.log("searchByUsername", response);
          if (response.data.error) return false;
          else {
            this.setState({ twitterUserID: response.data.twitterResults.id });
            this.props.setCustomState(
              "twitterUser",
              response.data.twitterResults
            );
            return true;
          }
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
          //console.log("getTweetsByUserID", response);
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
          //console.log("searchByRecent", response);
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
        <Box sx={{ paddingTop: 4, paddingBottom: 4 }}>
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
          <Alert severity="error">
            Search query cannot be blank. Please enter a search query and try
            again.
          </Alert>
        )}
      </div>
    );
  }
}
