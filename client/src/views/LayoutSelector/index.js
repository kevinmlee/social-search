import React, { Component } from "react";

import {
  Box,
  ButtonGroup,
  Button,
  Paper,
  Typography,
  Tooltip,
  Radio,
} from "@mui/material";

import GridViewIcon from "@mui/icons-material/GridView";
import ViewDayIcon from "@mui/icons-material/ViewDay";

export default class LayoutSelector extends Component {
  /* constructor(props) {
    super(props);

    this.state = {
      layout: "grid",
    };
  }
  */

  componentDidMount = async () => {
    let userSettings = JSON.parse(localStorage.getItem("userSettings"));
    if ("layout" in userSettings)
      this.props.setAppState({ layout: userSettings.layout });
    else this.props.updateLocalStorage("layout", "grid");
  };

  changeView = (event) => {
    const selectedView = event.currentTarget.getAttribute("data-view");
    this.props.setAppState({ layout: selectedView });
    this.props.updateLocalStorage("layout", selectedView);
  };

  render() {
    return (
      <Box id="layoutSelector">
        <ButtonGroup variant="contained">
          <Button
            className={this.props.state.layout === "grid" ? "active" : ""}
            onClick={this.changeView}
            data-view="grid"
          >
            <GridViewIcon />
          </Button>
          <Button
            className={this.props.state.layout === "card" ? "active" : ""}
            onClick={this.changeView}
            data-view="card"
          >
            <ViewDayIcon />
          </Button>
        </ButtonGroup>
      </Box>
    );
  }
}
