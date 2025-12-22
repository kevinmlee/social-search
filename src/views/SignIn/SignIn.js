'use client'

import React, { useContext, useEffect, useState } from "react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { jwtDecode } from "jwt-decode"
import validator from "validator"
import { GoogleLogin } from "@react-oauth/google"
import Loader from "../../components/Loader/Loader"
import { AppContext } from "../../../app/providers"
import { Button, Input } from "@/components"

export default function SignIn() {
  const router = useRouter()
  const { setFullWidth, setUser } = useContext(AppContext)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [stepTwo, setStepTwo] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFullWidth(true)
    return () => setFullWidth(false)
  }, [setFullWidth])

  const handleGoogleSignin = async (userData) => {
    const user = await getUser(userData.email)

    if (user) {
      setUser(user)
      setFullWidth(false)
      router.push('/')
    } else await createGoogleUser(userData)
  }

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
    setLoading(true)
    if (validator.isEmail(username)) {
      const user = await getUser(username)

      setLoading(false)
      if (user) setStepTwo(true)
    }
  }

  const formStepOne = () => {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!loading && username) findUser()
        }}
        className="mt-5 space-y-5"
      >
        <Input 
          id="email"
          type="email"
          placeholder="Email address"
          name="username"
          onChange={(e) => {
            setUsername(e.target.value)
            setError("")
          }}
          value={username}
          autoFocus={true}
        />
        <div className="form-field relative">
          <Button className="w-full" disabled={loading || !username} size="large">Continue</Button>
          {loading && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><Loader /></div>}
        </div>
      </form>
    )
  }

  const formStepTwo = () => {
    return (
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setLoading(true)

          const authResult = await fetch(`/api/auth`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: username,
              password: password,
            }),
          })
            .then(response => response.json())
            .then(data => data)

          setLoading(false)

          if (authResult.success) {
            setUser(authResult.data)
            setFullWidth(false)
            router.push('/')
          } else {
            setError("Incorrect password")
          }
        }}
        className="mt-5 space-y-5"
      >
        <Input 
          id="password"
          type="password"
          placeholder="Password"
          name="password"
          onChange={(e) => {
            setPassword(e.target.value)
            setError('')
          }}
          value={password}
          autoFocus={true}
        />

        <div className="form-field relative">
          <Button className="w-full" disabled={loading || !password} size="large">Sign in</Button>
          {loading && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><Loader /></div>}
        </div>
      </form>
    )
  }

  return (
    <div id="signin" className="min-h-screen flex bg-white dark:bg-dark">
      <div className="fixed left-0 top-0 h-full w-full md:w-2/5 flex items-center justify-center px-8">
        <div className="w-full max-w-[340px]">
          <h2 className="text-3xl font-bold text-center mb-8 text-black dark:text-white">Welcome back</h2>

          {error && <div className="alert error mb-5 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">{error}</div>}

          {!stepTwo && formStepOne()}
          {stepTwo && formStepTwo()}

          <div className="separator-text my-9 overflow-hidden text-center relative">
            <span className="relative z-10 px-4 bg-white dark:bg-gray-900">OR</span>
            <div className="absolute top-1/2 left-0 right-0 h-px bg-black dark:bg-white"></div>
          </div>

          <div className="social-signin flex justify-center">
            <div id="googleLogin">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  handleGoogleSignin(
                    jwtDecode(credentialResponse.credential)
                  )
                }}
                onError={() => console.log("Login failed")}
              />
            </div>
          </div>

          <div className="signup mt-9 text-center">
            <p className="text-black dark:text-white">
              Don't have an account? <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
      <div className="hidden md:block fixed right-0 top-0 w-3/5 h-full bg-cover bg-left-center" style={{backgroundImage: "url('/assets/current.jpg')"}}></div>
    </div>
  )
}
