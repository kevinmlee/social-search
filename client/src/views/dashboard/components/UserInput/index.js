import React, { Component } from "react";

import { Box, TextField } from "@mui/material";

export default class UserInput extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = async () => {};

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
          <TextField id="standard-basic" label="Search" variant="standard" />
        </Box>
      </div>
    );
  }
}
