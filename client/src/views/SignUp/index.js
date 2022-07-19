import React, { Component } from "react";
import { Box, TextField } from "@mui/material";
import jwt_decode from "jwt-decode";
import validator from "validator";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",

      formStepTwo: false,
    };

    this.googleUser = {};
  }

  handleChange = async (event) => {
    // await this.props.setAppState({ [event.target.name]: event.target.value });
    this.setState({ [event.target.name]: event.target.value });
  };

  handleGoogleSignin = async (response) => {
    this.googleUser = response;
    console.log(response);
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

  searchEmail = () => {
    console.log("checking if " + this.state.username + " exists");

    // should search database for user.
    // if not found, show password field and create account button
    this.setState({ formStepTwo: true });
    // else let user know they already have an account with this email address
    //this.setState({ formStepTwo: false });
  };

  formStepOne = () => {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          this.searchEmail();
        }}
      >
        <TextField
          id="outlined-basic"
          label="Email address"
          name="username"
          variant="outlined"
          onChange={this.handleChange}
          value={this.state.username}
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
          this.checkPasswords();
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

        <input className="cta-button" type="submit" value="Create account" />
      </form>
    );
  };

  render() {
    return (
      <div id="signin">
        <div className="flex-container">
          <div className="left">
            <div className="form-container">
              <h2>Create an account</h2>

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
                  Already have an account? <a href="/signin">Sign in</a>
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
