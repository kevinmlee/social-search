import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
//import { GoogleAuthProvider } from "./views/signin/components/GoogleSignInButton/googleAuth";

// check if userSetting object exists in localStorage
// if not, create it
let userSettings = JSON.parse(localStorage.getItem("userSettings"));
if (!userSettings) localStorage.setItem("userSettings", "{}");

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
//serviceWorker.register();
