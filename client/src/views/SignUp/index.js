import React, { useContext, useEffect, useState, } from "react"
import { Link, useNavigate } from 'react-router-dom'
import jwt_decode from "jwt-decode"
import { passwordStrength } from "check-password-strength"
import validator from "validator"

import { TextField } from "@mui/material"
import { GoogleLogin } from "@react-oauth/google"
import { AppContext } from "@/App"

const API = require("../../api")

const SignUp = () => {
  const navigate = useNavigate()
  const { setFullWidth } = useContext(AppContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [formStepTwo, setFormStepTwo] = useState(false)
  const [formStepThree, setFormStepThree] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [passStrength, setPassStrength] = useState({})
  const [googleUser, setGoogleUser] = useState({})

  useEffect(() => {
    setFullWidth(true)
    return () => setFullWidth(false)
  }, [setFullWidth])

  const handleChange = (updateState) => {
    if (updateState) updateState()

    // clear errors
    setErrorMessage('')

    // calculate password strength
    if (formStepTwo) setPassStrength(passwordStrength(password))
  }

  const handleGoogleSignin = async (response) => {
    setGoogleUser(response)

    const user = await API.getUser({ username: googleUser.email });
    if (user) {
      setErrorMessage('A user with this email address already exists')
    }
    else {
      const createdUser = await API.createUser({
        username: googleUser.email,
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
        avatar: googleUser.picture,
        accountType: "google",
      });

      if (createdUser) navigate('/signin');
    }
  }

  const findUser = async () => {
    if (validator.isEmail(username)) {
      const user = await API.getUser({ username: username })

      if (user) {
        setErrorMessage('A user with this email address already exists')
      } else setFormStepTwo(true)
    } else setErrorMessage('Not a valid email address')
  }

  const validateName = () => {
    if (!validator.isEmpty(firstName) && !validator.isEmpty(lastName)) {
      return true
    } else {
      setErrorMessage("First and last name fields cannot be blank")
      return false
    }
  }

  const stepOne = () => {
    return (
      <form
        onSubmit={event => {
          event.preventDefault()
          findUser()
        }}
      >
        <TextField
          id="outlined-basic"
          label="Email address"
          name="username"
          variant="outlined"
          onChange={e => handleChange(setUsername(e.target.value))}
          value={username}
          autoFocus={true}
        />
        <input className="cta-button" type="submit" value="Continue" />
      </form>
    );
  };

  const stepTwo = () => {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault()

          if (!validator.isEmpty(password)) {
            setFormStepTwo(false)
            setFormStepThree(true)
          }
        }}
      >
        <TextField
          id="outlined-basic"
          type="password"
          label="Password"
          name="password"
          variant="outlined"
          onChange={e => handleChange(setPassword(e.target.value))}
          value={password}
          autoFocus={true}
        />

        {Object.keys(password).length !== 0 && (
          <div className="password-strength">
            Strength:{" "}
            <span className={"strength-" + passStrength.id}>
              {passStrength.value}
            </span>
          </div>
        )}

        <input className="cta-button" type="submit" value="Continue" />
      </form>
    );
  };

  const stepThree = () => {
    return (
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (validateName()) {
            const user = await API.createUser({
              username: username,
              password: password,
              firstName: firstName,
              lastName:lastName,
              accountType: "standard",
            });

            if (user) navigate('/signin')
          }
        }}
      >
        <TextField
          id="outlined-basic"
          type="text"
          label="First name"
          name="firstName"
          variant="outlined"
          onChange={e => handleChange(setFirstName(e.target.value))}
          value={firstName}
          autoFocus={true}
        />

        <TextField
          id="outlined-basic"
          type="text"
          label="Last Name"
          name="lastName"
          variant="outlined"
          onChange={e => handleChange(setLastName(e.target.value))}
          value={lastName}
        />

        <input className="cta-button" type="submit" value="Create account" />
      </form>
    );
  };

  return (
    <div id="signin">
      <div className="flex-container">
        <div className="left">
          <div className="form-container">
            <h2>Create an account</h2>

            {!!errorMessage && (
              <div className="alert error">{errorMessage}</div>
            )}

            {!formStepTwo && !formStepThree && stepOne()}


            {formStepTwo && stepTwo()}
            {formStepThree && stepThree()}

            <div className="or separator-text">OR</div>
            <div className="social-signin">
              <div id="googleLogin">
                <GoogleLogin
                  onSuccess={credentialResponse => handleGoogleSignin(jwt_decode(credentialResponse.credential))}
                  onError={() => console.log("Login failed")}
                />
              </div>
            </div>

            <div className="signup">
              <p>
                Already have an account? <Link to="/signin">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
        <div className="right"></div>
      </div>
    </div>
  )
}

export default SignUp