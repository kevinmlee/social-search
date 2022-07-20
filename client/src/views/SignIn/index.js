import React, { Component } from "react";
import { TextField } from "@mui/material";
import jwt_decode from "jwt-decode";
import validator from "validator";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const API = require("../../api");

export default class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",

      formStepTwo: false,

      errorMessage: "",
    };

    this.googleUser = {};
  }

  handleChange = async (event) => {
    this.setState({ [event.target.name]: event.target.value });

    // clear errors
    this.setState({ errorMessage: "" });
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

  findUser = async () => {
    if (validator.isEmail(this.state.username)) {
      const user = await API.getUser({ username: this.state.username });

      console.log(user);

      if (user) this.setState({ formStepTwo: true });
      else
        this.setState({
          errorMessage: "No users found with this email address",
        });
    } else
      this.setState({
        errorMessage: "Not a valid email address",
      });
  };

  formStepOne = () => {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          this.findUser();
        }}
      >
        <TextField
          id="outlined-basic"
          label="Email address"
          name="username"
          variant="outlined"
          onChange={this.handleChange}
          value={this.state.username}
          autoFocus={true}
        />
        <input className="cta-button" type="submit" value="Continue" />
      </form>
    );
  };

  formStepTwo = () => {
    return (
      <form
        onSubmit={async (event) => {
          event.preventDefault();

          const authResult = await API.auth({
            username: this.state.username,
            password: this.state.password,
          });

          console.log("auth result", authResult);
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
          autoFocus={true}
        />

        <input className="cta-button" type="submit" value="Sign in" />
      </form>
    );
  };

  errorMessage = () => {
    return <div className="alert error">{this.state.errorMessage}</div>;
  };

  render() {
    return (
      <div id="signin">
        <div className="flex-container">
          <div className="left">
            <div className="form-container">
              <h2>Welcome back</h2>

              {this.state.errorMessage && this.errorMessage()}

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
