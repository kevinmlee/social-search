import { Component } from "react";

import { Box, TextField, Typography } from "@mui/material";

export default class Settings extends Component {
  constructor(props) {
    super(props);
  }
  state = {};
  render() {
    return (
      <Box id="settings" sx={{ padding: "0 30px" }}>
        <Box>
          <Typography className="section-title" variant="h5">
            Topics
          </Typography>
        </Box>
      </Box>
    );
  }
}
