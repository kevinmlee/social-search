import React from "react";

import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";

const Settings = () => {
  return (
    <Box id="settings" sx={{ padding: "0 30px" }}>
      <Box>
        <Typography className="section-title" variant="h5">
          Topics
        </Typography>

        <div className="columns d-flex t-no-flex align-top">
          <div className="center-column">
            <Typography variant="h5">Settings</Typography>

            {/*
            <div className="setting-group">
              <div className="two-col-setting-header">
                <Typography noWrap variant="h6">
                  Topics followed
                </Typography>

                <Button
                  variant="outlined"
                  onClick={this.addFollowing}
                  startIcon={<AddCircleIcon />}
                >
                  Add topic
                </Button>
              </div>
              <Box>{this.following}</Box>
            </div>
            */}

            <FormGroup>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Label"
              />
              <FormControlLabel
                disabled
                control={<Switch />}
                label="Disabled"
              />
            </FormGroup>
          </div>

          <div className="right-column"></div>
        </div>
      </Box>
    </Box>
  );
}

export default Settings