import React, { createContext, useCallback, useEffect, useState } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { Backdrop, Box } from "@mui/material"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"

import "./styles/main.css"

import {
  Header,
  Home,
  NotFound,
  Profile,
  Reddit,
  // Recover,
  Settings,
  Sidebar,
  SignIn,
  SignUp,
  YouTube,
  Trends
} from '@/views'

export const AppContext = createContext(null)

export default function App() {
  const [fullWidth, setFullWidth] = useState(false)
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState({})
  const [user, setUser] = useState({})
  const [scrollStatus, setScrollStatus] = useState('')
  const [backToTop, setBackToTop] = useState(false)
  const [backdropImage, setBackdropImage] = useState('')
  const [backdropToggle, setBackdropToggle] = useState(false)

  const getLocation = useCallback(async () => {
    await fetch(`/.netlify/functions/getLocation`)
      .then(response => response.json())
      .then(data => setLocation(data))
  }, [])

  useEffect(() => {
    getLocation()
  }, [getLocation])

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScrollStatus(window.scrollY === 0 ? 'top' : 'sticky')
      setBackToTop(window.scrollY > 0 ? true : false)
    })

    return () => window.removeEventListener("scroll", null)
  }, [])

  const backToTopButton = () => (
    <div className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
      <KeyboardArrowUpIcon />
    </div>
  )
  
  const imageBackdrop = () => (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={() => setBackdropToggle(!backdropToggle)}
      onClick={() => setBackdropToggle(!backdropToggle)}
    >
      <img src={backdropImage} alt="" />
    </Backdrop>
  )

  return (
    <AppContext.Provider value={{ 
      backdropImage,
      backToTop,
      fullWidth,
      location,
      scrollStatus,
      query,
      user,
      setBackdropImage,
      setBackToTop,
      setFullWidth,
      setLocation,
      setScrollStatus,
      setQuery,
      setUser
    }}>
    <Box>
      <Router>
        {!!(!fullWidth) && (
          <Box>
            <Header />
            <Sidebar />
          </Box>
        )}

        <div id="main-content" className={fullWidth ? 'fw' : ''}>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/reddit" element={<Reddit />} />
            <Route exact path="/reddit/:query" element={<Reddit />} />
            {/*<Route exact path="/twitter/:query" element={<Twitter />} />*/}
            <Route exact path="/youtube" element={<YouTube />} />
            <Route exact path="/youtube/:query" element={<YouTube />} />
            <Route exact path="/trends/:query" element={<Trends />} />
            <Route exact path="/signin" element={<SignIn />} />
            <Route exact path="/signup" element={<SignUp />} />
            {/*<Route exact path="/recover" element={<Recover />} />*/}
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>

      {backdropToggle && imageBackdrop()}
      {backToTop && backToTopButton()}
    </Box>
  </AppContext.Provider>
  )
}
