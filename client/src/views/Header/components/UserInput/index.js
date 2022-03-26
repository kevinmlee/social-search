import React, { Component } from "react";
import axios from "axios";

import { Box, TextField } from "@mui/material";

/*
TODO

- implement debounce for search, limit users from making too many requests
- trim excess white space from search query (begining and end of string)
*/

export default class UserInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
    };
  }

  componentDidMount = async () => {};

  handleChange = async (event) => {
    const NAME = event.target.name;
    const VALUE = event.target.value;

    if (NAME === "search" && VALUE !== "")
      await this.props.setAppState("searchQueryBlankError", false);

    await this.setState({ [NAME]: VALUE });
  };

  oneWord = (string) => {
    var regexp = /[a-zA-Z]+\s+[a-zA-Z]+/g;
    if (regexp.test(string)) return false;
    else return true;
  };

  objectEmpty = (obj) => {
    return (
      obj && // 👈 null and undefined check
      Object.keys(obj).length === 0 &&
      Object.getPrototypeOf(obj) === Object.prototype
    );
  };

  search = async (e) => {
    e.preventDefault();
    await this.props.setAppState("loadingBackdrop", true);

    //console.log("search query: ", this.state.search);
    await this.props.setAppState("previousSearchQuery", this.state.search);

    if (this.state.search === "") {
      this.props.setAppState("searchQueryBlankError", true);
    } else {
      this.props.setAppState("searchQuery", this.state.search);
      this.props.setAppState("username", "");
      this.props.setAppState("tweetsByUserId", [{ data: [], includes: [] }]);
      this.props.setAppState("tweetsByRecent", [{ data: [], includes: [] }]);

      if (this.oneWord(this.state.search)) {
        // if search query is a username (has @ symbol in front), remove symbol and continue to get user
        if (this.state.search.charAt(0) === "@")
          await this.props.setAppState(
            "searchQuery",
            this.state.search.substring(1)
          );

        const userFound = await this.searchByUsername();
        if (userFound) await this.getTweetsByUserID();
      }
      await this.searchByRecent();
      await this.redditSearchNew();
      await this.redditSearchHot();
    }

    await this.props.setAppState("loadingBackdrop", false);
    await this.setState({ search: "" });
  };

  searchByUsername = async (e) => {
    return await axios
      .put("/twitter/search/username", {
        searchQuery: this.state.search,
      })
      .then(
        async (response) => {
          //console.log("searchByUsername", response);
          if (response.data.error || this.objectEmpty(response.data))
            return false;
          else {
            await this.setState({
              twitterUserID: response.data.twitterResults.id,
            });
            await this.props.setAppState(
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
          this.props.setAppState("tweetsByUserId", response.data.tweets);
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
          this.props.setAppState("tweetsByRecent", response.data.tweets);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  redditSearchNew = async (e) => {
    return await axios
      .put("/reddit/search", {
        searchQuery: this.state.search,
        filter: "new",
      })
      .then(
        (response) => {
          this.props.setAppState("redditNew", response.data.data.children);
        },
        (error) => {
          console.log(error);
        }
      );
  };
  redditSearchHot = async (e) => {
    return await axios
      .put("/reddit/search", {
        searchQuery: this.state.search,
        filter: "hot",
      })
      .then(
        (response) => {
          // console.log("reddit search", response.data.data.children);
          this.props.setAppState("redditHot", response.data.data.children);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  render() {
    return (
      <div className="search-input">
        <Box sx={{}}>
          <form onSubmit={this.search}>
            <TextField
              //label="Search query"
              variant="filled"
              name="search"
              value={this.state.search}
              size="small"
              placeholder="Search"
              // defaultValue={this.state.search}
              spellCheck="false"
              onChange={this.handleChange}
              fullWidth={true}
            />
          </form>
        </Box>
      </div>
    );
  }
}
