import React, { Component } from "react";
import axios from "axios";

import { Box, Button, TextField } from "@mui/material";

export default class UserInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",

      twitterResults: [],
    };
  }

  componentDidMount = async () => {};

  handleChange = async (event) => {
    const NAME = event.target.name;
    const VALUE = event.target.value;

    await this.setState({ [NAME]: VALUE });
  };

  search = async () => {
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
  };

  render() {
    return (
      <div className="user-input">
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="standard-basic"
            label="Search query"
            variant="standard"
            name="search"
            defaultValue={this.state.search}
            onChange={this.handleChange}
            fullWidth={true}
          />

          <Button variant="contained" onClick={() => this.search()}>
            Submit
          </Button>
        </Box>
      </div>
    );
  }
}
