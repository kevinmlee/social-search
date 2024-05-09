import React, { useContext, useEffect, useState, } from "react"
import { Link, useNavigate } from 'react-router-dom'
import jwt_decode from "jwt-decode"
import { passwordStrength } from "check-password-strength"
import validator from "validator"

import { TextField } from "@mui/material"
import { GoogleLogin } from "@react-oauth/google"
import { AppContext } from "@/App"

const SignUp = () => {
  const navigate = useNavigate()
  const { setFullWidth, setUser } = useContext(AppContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [formStepTwo, setFormStepTwo] = useState(false)
  const [formStepThree, setFormStepThree] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [passStrength, setPassStrength] = useState({})

  useEffect(() => {
    setFullWidth(true)
    return () => setFullWidth(false)
  }, [setFullWidth])

  const handleChange = (updateState) => {
    if (updateState) updateState()
    setErrorMessage('')
    if (formStepTwo) setPassStrength(passwordStrength(password))
  }

  const handleGoogleSignin = async (userData) => {
    const user = await getUser(userData.email)
    
    if (user) {
      setUser(user)
      setFullWidth(false)
      navigate('/')
    } else await createGoogleUser(userData)
  };

  const getUser = async (username) => await fetch(`/.netlify/functions/getUser`, {
    method: "POST",
    body: JSON.stringify({ username: username }),
  })
    .then(response => response.json())
    .then(data => data)

  const createGoogleUser = async (userData) => {
    const requestBody = { 
      username: userData.email,
      firstName: userData.given_name,
      lastName: userData.family_name,
      avatar: userData.picture,
      accountType: "google",
     }

    const result = await fetch(`/.netlify/functions/createUser`, {
      method: "POST",
      body: JSON.stringify(requestBody),
    })
      .then(response => response.json())
      .then(data => data)

    if (result?.acknowledged) {
      handleGoogleSignin(userData)
    }
  }

  const findUser = async () => {
    if (validator.isEmail(username)) {
      const user = await getUser(username)

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
            const requestBody = { 
              username: username,
              password: password,
              firstName: firstName,
              lastName: lastName,
              accountType: "standard",
             }

            const result = await fetch(`/.netlify/functions/createUser`, {
              method: "POST",
              body: JSON.stringify(requestBody),
            })
              .then(response => response.json())
              .then(data => data)

            if (result?.acknowledged) navigate('/signin')
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