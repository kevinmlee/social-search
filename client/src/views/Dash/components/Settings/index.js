import React, { Component } from "react";
import moment from "moment";
import axios from "axios";
import $ from "jquery";

import {
  Box,
  ButtonGroup,
  Button,
  Paper,
  Typography,
  Tooltip,
  Radio,
  FormGroup,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle";

/*
 * use localStorage to store the user's settings
 */

export default class Settings extends Component {
  constructor(props) {
    super(props);

    this.following = [];
    this.state = {
      showFollowing: this.following,
    };
  }

  componentDidMount = async () => {
    //this.jQueryScripts();
  };

  componentWillUnmount = () => {};

  jQueryScripts = () => {
    /*
    schemaJSON.itemListElement.map((breadcrumb, index) => {
      $("#name-" + index).val(breadcrumb["name"]);
      $("#item-" + index).val(breadcrumb["item"]);
      $("#position-" + index).val(breadcrumb["position"]);
      return 1;
    });
    */
  };

  toggle = async (state) => {
    await this.setState({ [state]: !this.state[state] });
  };

  saveSettings = async () => {};

  followingFields = (counter) => {
    return (
      <TextField
        //label="Search query"
        variant="filled"
        name="search"
        value={this.state.search}
        size="small"
        spellCheck="false"
        onChange={this.handleChange}
        fullWidth={true}
        key={counter}
      />
    );
  };

  addFollowing = async () => {
    let counter = this.following.length;
    this.following.push(this.followingFields(counter));

    this.setState({
      showFollowing: this.following,
    });
  };

  removeFollowing = async (indexToRemove) => {
    let following = this.following;

    this.following = this.following.filter(
      (followingItem, index) => index !== indexToRemove
    );
  };

  generateInputFields = async () => {
    /*
    this.following = [];

    schemaJSON.itemListElement.map((breadcrumb, counter) =>
      this.breadcrumbs.push(this.breadcrumbFields(counter))
    );
    */
  };

  render() {
    return (
      <Box sx={{ paddingTop: 2, paddingBottom: 2 }}>
        <div className="columns d-flex t-no-flex align-top">
          <div className="center-column">
            <Typography variant="h5">Settings</Typography>

            {/* <div className="setting-group">
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
    );
  }
}
