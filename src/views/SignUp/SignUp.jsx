'use client'

import React, { useContext, useEffect, useState } from "react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { jwtDecode } from "jwt-decode"
import { passwordStrength } from "check-password-strength"
import validator from "validator"

import { GoogleLogin } from "@react-oauth/google"
import { AppContext } from "../../../app/providers"
import { Button, Input } from "@/components"

const SignUp = () => {
  const router = useRouter()
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
      router.push('/')
    } else await createGoogleUser(userData)
  };

  const getUser = async (username) => await fetch(`/api/users/get`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
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

    const result = await fetch(`/api/users/create`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
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
        className="mt-5 space-y-5"
      >
        <Input
          id="email"
          type="email"
          placeholder="Email address"
          name="username"
          onChange={e => handleChange(setUsername(e.target.value))}
          value={username}
          autoFocus={true}
        />
        <Button type="submit" className="w-full">Continue</Button>
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
        className="mt-5 space-y-5"
      >
        <Input
          id="password"
          type="password"
          placeholder="Password"
          name="password"
          onChange={e => handleChange(setPassword(e.target.value))}
          value={password}
          autoFocus={true}
        />

        {Object.keys(password).length !== 0 && (
          <div className="password-strength text-sm">
            Strength:{" "}
            <span className={`strength-${passStrength.id} font-medium ${
              passStrength.id === 0 ? 'text-red-500' :
              passStrength.id === 1 ? 'text-orange-500' :
              passStrength.id === 2 ? 'text-yellow-500' :
              'text-green-500'
            }`}>
              {passStrength.value}
            </span>
          </div>
        )}

        <Button type="submit" className="w-full">Continue</Button>
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

            const result = await fetch(`/api/users/create`, {
              method: "POST",
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(requestBody),
            })
              .then(response => response.json())
              .then(data => data)

            if (result?.acknowledged) router.push('/signin')
          }
        }}
        className="mt-5 space-y-5"
      >
        <Input
          id="firstName"
          type="text"
          placeholder="First name"
          name="firstName"
          onChange={e => handleChange(setFirstName(e.target.value))}
          value={firstName}
          autoFocus={true}
        />

        <Input
          id="lastName"
          type="text"
          placeholder="Last name"
          name="lastName"
          onChange={e => handleChange(setLastName(e.target.value))}
          value={lastName}
        />

        <Button type="submit" className="w-full">Create account</Button>
      </form>
    );
  };

  return (
    <div id="signin" className="min-h-screen flex bg-white dark:bg-dark">
      <div className="fixed left-0 top-0 h-full w-full md:w-2/5 flex items-center justify-center px-8">
        <div className="w-full max-w-[340px]">
          <h2 className="text-3xl font-bold text-center mb-8 text-black dark:text-white">Create an account</h2>

          {!!errorMessage && (
            <div className="alert error mb-5 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">{errorMessage}</div>
          )}

          {!formStepTwo && !formStepThree && stepOne()}
          {formStepTwo && stepTwo()}
          {formStepThree && stepThree()}

          <div className="separator-text my-9 overflow-hidden text-center relative">
            <span className="relative z-10 px-4 bg-white dark:bg-gray-900">OR</span>
            <div className="absolute top-1/2 left-0 right-0 h-px bg-black dark:bg-white"></div>
          </div>

          <div className="social-signin flex justify-center">
            <div id="googleLogin">
              <GoogleLogin
                onSuccess={credentialResponse => handleGoogleSignin(jwtDecode(credentialResponse.credential))}
                onError={() => console.log("Login failed")}
              />
            </div>
          </div>

          <div className="signup mt-9 text-center">
            <p className="text-black dark:text-white">
              Already have an account? <Link href="/signin" className="text-primary hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
      <div className="hidden md:block fixed right-0 top-0 w-3/5 h-full bg-cover bg-left-center" style={{backgroundImage: "url('/assets/current.jpg')"}}></div>
    </div>
  )
}

export default SignUp