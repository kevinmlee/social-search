import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { GoogleOAuthProvider } from "@react-oauth/google";

// check if userSetting object exists in localStorage
// if not, create it
let userSettings = localStorage.getItem("userSettings");
if (!userSettings) localStorage.setItem("userSettings", "{}");

const GOOGLE_CLIENT_ID =
  "755162400821-sthb8ebrfdpvutds6f4qmcq4iefk7a0a.apps.googleusercontent.com";

ReactDOM.render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
//serviceWorker.register();
