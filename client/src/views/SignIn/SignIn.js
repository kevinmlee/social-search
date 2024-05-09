import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

import { TextField } from "@mui/material";
import jwt_decode from "jwt-decode";
import validator from "validator";
import { GoogleLogin } from "@react-oauth/google";
import Loader from "../../components/Loader/Loader";
import { AppContext } from "@/App"

import "./SignIn.css";

//import GoogleSignIn from "../../components/GoogleSignIn/GoogleSignIn";

const API = require("../../api");

export default function SignIn() {
  const navigate = useNavigate()
  const { setFullWidth, setUser } = useContext(AppContext)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [stepTwo, setStepTwo] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFullWidth(true)
    return () => setFullWidth(false)
  }, [setFullWidth])

  const handleGoogleSignin = async (response) => {
    console.log('response', response)
    const user = await API.getUser({ username: response.email });

    console.log('user', user)

    if (user) {
      //localStorage.setItem("user", JSON.stringify(user));
      // setUser(setUser)
      setFullWidth(false)
      navigate('/')
      // window.location.href = "/";
    }
  };

  const findUser = async () => {
    setLoading(true);
    if (validator.isEmail(username)) {
      const user = await API.getUser({ username: username });

      if (user) setStepTwo(true);
      else setError("No users found with this email address");
    } else setError("Not a valid email address");
    setLoading(false);
  };

  const formStepOne = () => {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!loading) findUser();
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
        <div className="form-field">
          <input
            className={(loading ? "loading " : "") + "cta-button"}
            type="submit"
            value={loading ? "" : "Continue"}
          />
          {loading && <Loader />}
        </div>
      </form>
    );
  };

  const formStepTwo = () => {
    return (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);

          const authResult = await API.auth({
            username: username,
            password: password,
          });

          if (authResult.success) {
            localStorage.setItem("user", JSON.stringify(authResult.data));
            window.location.href = "/";
          } else {
            setError("Incorrect password");
            setLoading(false);
          }
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

        <div className="form-field">
          <input
            className={(loading ? "loading " : "") + "cta-button"}
            type="submit"
            value={loading ? "" : "Sign in"}
          />
          {loading && <Loader />}
        </div>
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
                Don't have an account? <Link to="/signup">Sign up</Link>
              </p>
            </div>
          </div>
        </div>
        <div className="right"></div>
      </div>
    </div>
  );
}
