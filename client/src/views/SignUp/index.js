import React, { Component } from "react";
import { TextField } from "@mui/material";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import validator from "validator";
import { passwordStrength } from "check-password-strength";

const API = require("../../api");

export default class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      firstName: "",
      lastName: "",

      formStepTwo: false,
      formStepThree: false,

      errorMessage: "",

      validEmail: true,
      passwordStrength: {},
    };

    this.googleUser = {};
  }

  handleChange = (event) => {
    // await this.props.setAppState({ [event.target.name]: event.target.value });
    this.setState({ [event.target.name]: event.target.value });

    // clear errors
    this.setState({ validEmail: true, errorMessage: "" });

    // calculate password strength
    if (this.state.formStepTwo)
      this.setState({
        passwordStrength: passwordStrength(this.state.password),
      });
  };

  handleGoogleSignin = async (response) => {
    this.googleUser = response;
    console.log(response);

    // check if user exists if already exists
    // const user = await API.getUser({ username: this.state.username });
    // if(user) display error
    // else this.createGoogleAccount();
  };

  createGoogleAccount = () => {
    return axios
      .post("/api/create/user", {
        username: this.state.username,
        firstName: this.googleUser.given_name,
        lastName: this.googleUser.family_name,
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

      if (user) {
        this.setState({
          errorMessage: "A user with this email address already exists",
        });
      } else this.setState({ formStepTwo: true });
    } else
      this.setState({
        errorMessage: "Not a valid email address",
      });
  };

  validateName = () => {
    if (
      !validator.isEmpty(this.state.firstName) &&
      !validator.isEmpty(this.state.lastName)
    ) {
      return true;
    } else {
      this.setState({
        errorMessage: "First and last name fields cannot be blank",
      });
      return false;
    }
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
        onSubmit={(event) => {
          event.preventDefault();

          if (!validator.isEmpty(this.state.password))
            this.setState({ formStepTwo: false, formStepThree: true });
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

        {Object.keys(this.state.password).length !== 0 && (
          <div className="password-strength">
            Strength:{" "}
            <span className={"strength-" + this.state.passwordStrength.id}>
              {this.state.passwordStrength.value}
            </span>
          </div>
        )}

        <input className="cta-button" type="submit" value="Continue" />
      </form>
    );
  };

  formStepThree = () => {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (this.validateName())
            API.createUser({
              username: this.state.username,
              password: this.state.password,
              firstName: this.state.firstName,
              lastName: this.state.lastName,
            });
        }}
      >
        <TextField
          id="outlined-basic"
          type="text"
          label="First name"
          name="firstName"
          variant="outlined"
          onChange={this.handleChange}
          value={this.state.firstName}
          autoFocus={true}
        />

        <TextField
          id="outlined-basic"
          type="text"
          label="Last Name"
          name="lastName"
          variant="outlined"
          onChange={this.handleChange}
          value={this.state.lastName}
        />

        <input className="cta-button" type="submit" value="Create account" />
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
              <h2>Create an account</h2>

              {this.state.errorMessage && this.errorMessage()}

              {!this.state.formStepTwo &&
                !this.state.formStepThree &&
                this.formStepOne()}
              {this.state.formStepTwo && this.formStepTwo()}
              {this.state.formStepThree && this.formStepThree()}

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
