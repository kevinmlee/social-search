import React, { useState } from "react";
import { TextField } from "@mui/material";
import jwt_decode from "jwt-decode";
import validator from "validator";
import { GoogleLogin } from "@react-oauth/google";

//import GoogleSignIn from "../../components/GoogleSignIn/GoogleSignIn";

const API = require("../../api");

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [stepTwo, setStepTwo] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignin = async (response) => {
    const user = await API.getUser({ username: response.email });

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "/";
    }
  };

  const findUser = async () => {
    if (validator.isEmail(username)) {
      const user = await API.getUser({ username: username });

      if (user) setStepTwo(true);
      else setError("No users found with this email address");
    } else setError("Not a valid email address");
  };

  const formStepOne = () => {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          findUser();
        }}
      >
        <TextField
          id="outlined-basic"
          label="Email address"
          name="username"
          variant="outlined"
          onChange={(e) => {
            setUsername(e.target.value);
            setError("");
          }}
          value={username}
          autoFocus={true}
        />
        <input className="cta-button" type="submit" value="Continue" />
      </form>
    );
  };

  const formStepTwo = () => {
    return (
      <form
        onSubmit={async (event) => {
          event.preventDefault();

          const authResult = await API.auth({
            username: username,
            password: password,
          });

          if (authResult.success) {
            localStorage.setItem("user", JSON.stringify(authResult.data));
            window.location.href = "/";
          } else setError("Incorrect password");
        }}
      >
        <TextField
          id="outlined-basic"
          type="password"
          label="Password"
          name="password"
          variant="outlined"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          autoFocus={true}
        />

        <input className="cta-button" type="submit" value="Sign in" />
      </form>
    );
  };

  return (
    <div id="signin">
      <div className="flex-container">
        <div className="left">
          <div className="form-container">
            <h2>Welcome back</h2>

            {error && <div className="alert error">{error}</div>}

            {!stepTwo && formStepOne()}
            {stepTwo && formStepTwo()}

            <div className="or separator-text">OR</div>
            <div className="social-signin">
              <div id="googleLogin">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    handleGoogleSignin(
                      jwt_decode(credentialResponse.credential)
                    );
                  }}
                  onError={() => console.log("Login failed")}
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
