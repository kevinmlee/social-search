import React, { Component } from "react";
import { Box, FormControl, TextField } from "@mui/material";
import jwt_decode from "jwt-decode";
import validator from "validator";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default class SignIn extends Component {
  constructor(props) {
    super(props);

    this.googleUser = {};
  }

  handleChange = async (event) => {
    await this.props.setAppState({ [event.target.name]: event.target.value });
    //this.setState({ [event.target.name]: event.target.value });
  };

  handleGoogleSignin = async (response) => {
    this.googleUser = response;

    console.log(response);

    // check if user exists in db
    // yes, then sign user in then send to dashboard
    // no, create user and send to dashboard
  };

  createGoogleAccount = () => {
    return axios
      .post("/api/user/create", {
        username: "",
        firstName: this.googleUser.given_name,
        lastName: this.googleUser.family_name,
        googleUid: this.googleUser.jti,
        avatar: this.googleUser.picture,
      })
      .then(
        (response) => {
          // do something
        },
        (error) => {
          console.log(error);
        }
      );
  };

  emailCheck = () => {
    console.log("checking if " + this.props.state.username + " exists");

    // should search database for user.
    // if found, show password field and signin button
    // show signin page
  };

  render() {
    return (
      <div id="signin">
        <div className="flex-container">
          <div className="left">
            <div className="form-container">
              <h2>Welcome back</h2>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  this.emailCheck();
                }}
              >
                <TextField
                  id="outlined-basic"
                  label="Email address"
                  name="username"
                  variant="outlined"
                  onChange={this.handleChange}
                  value={this.props.state.username}
                />
                <input className="cta-button" type="submit" value="Continue" />
              </form>

              <div className="or separator-text">OR</div>
              <div className="social-signin">
                <div id="googleLogin">
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      this.handleGoogleSignin(
                        jwt_decode(credentialResponse.credential)
                      );
                    }}
                    onError={() => {
                      console.log("Login failed");
                    }}
                  />
                </div>
              </div>

              <div className="signup">
                <p>
                  Don't have an account? <a href="/signup">Sign up</a>
                </p>
              </div>
            </div>
          </div>
          <div className="right"></div>
        </div>
      </div>
    );
  }
}
