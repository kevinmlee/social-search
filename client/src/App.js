import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Backdrop, Box } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import "./styles/main.css";

// components
import Header from "./views/Header";
import Sidebar from "./views/Sidebar/Sidebar";
import SignIn from "./views/SignIn/SignIn";
import SignUp from "./views/SignUp";
import NotFound from "./views/NotFound/NotFound";
import Settings from "./views/Settings";

import Dash from "./views/Dash";
import Reddit from "./views/Platforms/Reddit/Reddit";
import Twitter from "./views/Platforms/Twitter/Twitter";
import YouTube from "./views/Platforms/YouTube/YouTube";

export const AppContext = createContext(null)

export default function App() {
  const [query, setQuery] = useState('')
  const [scrollStatus, setScrollStatus] = useState('')
  const [backToTop, setBackToTop] = useState(false)
  const [backdropImage, setBackdropImage] = useState('')
  const [backdropToggle, setBackdropToggle] = useState(false)

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScrollStatus(window.scrollY === 0 ? 'top' : 'sticky')
      setBackToTop(window.scrollY > 0 ? true : false)
    })

    return () => window.removeEventListener("scroll", null)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  const backToTopButton = () => (
    <div className="back-to-top" onClick={() => scrollToTop()}>
      <KeyboardArrowUpIcon />
    </div>
  )
  
  const isInnerPage = () => {
    let pathname = window.location.pathname
    return pathname !== "/signin" && pathname !== "/signup"
  }

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
      scrollStatus,
      query,
      setBackdropImage,
      setBackToTop,
      setScrollStatus,
      setQuery
    }}>
    <Box>
      <Router>
        {isInnerPage() && (
          <Box>
            <Header />
            <Sidebar />
          </Box>
        )}

        <div id="main-content" className={!isInnerPage() ? "fw" : undefined}>
          <Routes>
            <Route exact path="/" element={<Dash />} />
            <Route exact path="/reddit/:query" element={<Reddit />} />
            <Route exact path="/twitter/:query" element={<Twitter />} />
            <Route exact path="/youtube/:query" element={<YouTube />} />
            <Route exact path="/signin" element={<SignIn />} />
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/settings" element={<Settings />} />
            <Route element={<NotFound />} />
          </Routes>
        </div>
      </Router>

      {backdropToggle && imageBackdrop()}
      {backToTop && backToTopButton()}
    </Box>
  </AppContext.Provider>
  )
}
