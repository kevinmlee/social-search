import React, { Component } from "react";

import "./NotFound.css";

export default class NotFound extends Component {
  render() {
    return (
      <div id="notFound">
        <h2>Well this is awkward.</h2>
        <p>This page could not be found.</p>
        <p>
          <a className="cta-button" href="/">
            Go to dashboard
          </a>
        </p>
      </div>
    );
  }
}
