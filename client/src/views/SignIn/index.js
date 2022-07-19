import React, { Component } from "react";
import { TextField } from "@mui/material";
import jwt_decode from "jwt-decode";
//import validator from "validator";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",

      formStepTwo: false,
    };

    this.googleUser = {};
  }

  handleChange = async (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  setAppState = async (event) => {
    await this.props.setAppState({ [event.target.name]: event.target.value });
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
    this.setState({ formStepTwo: true });
    // notify user that this account does not exist
  };

  formStepOne = () => {
    return (
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
          onChange={this.setAppState}
          value={this.props.state.username}
        />
        <input className="cta-button" type="submit" value="Continue" />
      </form>
    );
  };

  formStepTwo = () => {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <TextField
          id="outlined-basic"
          type="password"
          label="Password"
          name="password"
          variant="outlined"
          onChange={this.handleChange}
          value={this.state.password}
        />

        <input className="cta-button" type="submit" value="Sign in" />
      </form>
    );
  };

  render() {
    return (
      <div id="signin">
        <div className="flex-container">
          <div className="left">
            <div className="form-container">
              <h2>Welcome back</h2>

              {!this.state.formStepTwo && this.formStepOne()}
              {this.state.formStepTwo && this.formStepTwo()}

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
