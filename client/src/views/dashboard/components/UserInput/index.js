import React, { Component } from "react";
import axios from "axios";

import { Alert, Box, Button, TextField } from "@mui/material";

export default class UserInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",

      twitterResults: [],

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

  search = async (e) => {
    e.preventDefault();

    if (this.state.search === "") {
      this.setState({ searchQueryBlankError: true });
    } else {
      await axios
        .put("/twitter/search", {
          searchQuery: this.state.search,
        })
        .then(
          (response) => {
            this.props.setCustomState(
              "twitterResults",
              response.data.twitterResults
            );
          },
          (error) => {
            console.log(error);
          }
        );
    }
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
