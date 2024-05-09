import React from "react";

import "./NotFound.css";

const NotFound = () => {
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

export default NotFound