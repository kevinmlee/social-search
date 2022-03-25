import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  //Redirect,
} from "react-router-dom";
//import moment from "moment";
//import ReactNotification from "react-notifications-component";
//import "react-notifications-component/dist/theme.css";

import { Box } from "@mui/material";

import "./styles/main.css";

// components
import Header from "./views/Header";
import Dashboard from "./views/Dashboard";

export default class App extends Component {
  /*
  constructor(props) {
    super(props);
  }
  */

  componentDidMount = async () => {};

  render() {
    return (
      <Box>
        <Header />

        <Router>
          <Switch>
            <Route exact path="/">
              <Dashboard />
            </Route>
          </Switch>
        </Router>
      </Box>
    );
  }
}
