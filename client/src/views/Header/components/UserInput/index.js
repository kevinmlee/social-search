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

    if (this.state.search === "") {
      this.props.setAppState("searchQueryBlankError", true);
    } else {
      await this.props.reset();
      await this.props.setAppState("previousSearchQuery", this.state.search);
    }

    await this.props.setAppState("loadingBackdrop", false);
    await this.setState({ search: "" });
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
