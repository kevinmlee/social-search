import React, { Component } from "react";
import moment from "moment";
import axios from "axios";

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
} from "@mui/material";

/*
 * perhaps on first load, get recent hot posts from reddit
 * or worldnews
 * or provide option for both
 */

export default class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //filterToggle: false,
      //recent: false,
      //popular: true,
    };

    //this.wrapperRef = React.createRef();
    //this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount = async () => {
    //document.addEventListener("mousedown", this.handleClickOutside);
    // on initial load, fetch the data if not already present
    /*if (this.state.popular && this.props.state.redditHot.length === 0)
      this.redditSearchHot();

       redditHotWorldNews: [],
      redditHotGlobal: [],
      */
  };

  componentWillUnmount = () => {
    //document.removeEventListener("mousedown", this.handleClickOutside);
  };

  toggle = async (state) => {
    await this.setState({ [state]: !this.state[state] });
  };

  render() {
    return (
      <Box sx={{ paddingTop: 2, paddingBottom: 2 }}>
        <div className="columns d-flex t-no-flex align-top">
          <div className="center-column">
            <h2>Settings</h2>

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
