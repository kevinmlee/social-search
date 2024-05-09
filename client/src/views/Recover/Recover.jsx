import React, { useContext, useEffect, useState, } from "react"
import { Link } from 'react-router-dom'
import { passwordStrength } from "check-password-strength"

import { TextField } from "@mui/material"
import { AppContext } from "@/App"
import Loader from '@/components/Loader/Loader'

const Recover = () => {
  const { setFullWidth } = useContext(AppContext)
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passStrength, setPassStrength] = useState({})
  const [stepTwo, setStepTwo] = useState(false)
  const [error, setError] = useState("");

  useEffect(() => {
    setFullWidth(true)
    return () => setFullWidth(false)
  }, [setFullWidth])

  const getUser = async (username) => await fetch(`/.netlify/functions/getUser`, {
    method: "POST",
    body: JSON.stringify({ username: username }),
  })
    .then(response => response.json())
    .then(data => data)

  const recoverAccount = async () => {
    const result = await fetch(`/.netlify/functions/sendRecoveryEmail`, {
      method: "POST",
      body: JSON.stringify({ username: username }),
    })
      .then(response => response.json())
      .then(data => data)

    console.log('result', result)
  }

  const formOne = () => {
    return (
      <form
        onSubmit={async (event) => {
          event.preventDefault()
          if (!username) return

          setLoading(true)
          const user = await getUser(username)
          setLoading(false)

          if (user) {
            recoverAccount(username)
            setStepTwo(true)
          }
          else setError('This user does not exist')
        }}
      >
        <TextField
          id="outlined-basic"
          type="text"
          label="Username"
          name="username"
          variant="outlined"
          onChange={e => {
            setUsername(e.target.value)
            setError('')
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
    )
  }

  const formTwo = () => {
    return (
      <form
        onSubmit={async (event) => {
          event.preventDefault()
        }}
      >
        <TextField
          id="outlined-basic"
          type="password"
          label="Password"
          name="password"
          variant="outlined"
          onChange={e => {
            setPassword(e.target.value)
          }}
          value={password}
          autoFocus={true}
        />

        <TextField
          id="outlined-basic"
          type="password"
          label="Confirm password"
          name="confirmPassword"
          variant="outlined"
          onChange={e => {
            setConfirmPassword(e.target.value)
            setPassStrength(passwordStrength(password))
          }}
          value={confirmPassword}
        />

        {!!Object.keys(confirmPassword).length && (
          <div className="password-strength">
            Strength:{" "}
            <span className={"strength-" + passStrength.id}>
              {passStrength.value}
            </span>
          </div>
        )}

        <div className="form-field">
          <input
            className={(loading ? "loading " : "") + "cta-button"}
            type="submit"
            value={loading ? "" : "Change password"}
          />
          {loading && <Loader />}
        </div>
      </form>
    )
  }

  return (
    <div id="signin">
      <div className="flex-container">
        <div className="left">
          <div className="form-container">
            <h2>Recover your account </h2>
            
            {error && <div className="alert error">{error}</div>}

            {!stepTwo && formOne()}
            {stepTwo && formTwo()}

            <div className="signup">
              <p>
                Remember your credentials? <Link to="/signin">Sign in</Link>
              </p>
            </div>
            
          </div>
        </div>
        <div className="right"></div>
      </div>
    </div>
  )
}

export default Recover