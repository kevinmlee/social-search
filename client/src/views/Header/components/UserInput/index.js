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

  componentDidMount = async () => {
    /*
    const userSettings = JSON.parse(localStorage.getItem("userSettings"));

    if ("recentSearches" in userSettings) {
      this.setState({
        //[userSettings.recentSearches]: searches,
      });
    }
    */
  };

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
    //await this.props.setAppState("loadingBackdrop", true);

    if (this.state.search === "") {
      this.props.setAppState("searchQueryBlankError", true);
    } else {
      await this.props.reset();
      await this.props.setAppState("previousSearchQuery", this.state.search);
      this.updateRecentSearches(this.state.search);
    }

    //await this.props.setAppState("loadingBackdrop", false);
    // switch tab
    await this.props.setAppState("home", false);
    await this.props.setAppState("reddit", true);
    await this.setState({ search: "" });
  };

  updateRecentSearches = (searchQuery) => {
    let userSettings = JSON.parse(localStorage.getItem("userSettings"));
    let searches = [];

    if ("searches" in userSettings) {
      searches = userSettings.searches;

      // remove queries over 5
      if (searches.length >= 5) searches.pop();

      // if query already exists, move to top / front of array
      if (searches.includes(searchQuery)) {
        searches = searches.filter((item) => item !== searchQuery);
        searches.unshift(searchQuery);
      }
      // if query does not exist, add to front of array
      else searches.unshift(searchQuery);
    } else searches = [searchQuery];

    this.props.updateLocalStorage("searches", searches);
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
              placeholder="Search for a person or topic"
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
