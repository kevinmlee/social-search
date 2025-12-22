'use client'

import { createContext, useCallback, useEffect, useState } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ChevronUp } from 'lucide-react'

export const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [fullWidth, setFullWidth] = useState(false)
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState({})
  const [user, setUser] = useState({})
  const [scrollStatus, setScrollStatus] = useState('')
  const [backToTop, setBackToTop] = useState(false)
  const [backdropImage, setBackdropImage] = useState('')
  const [backdropToggle, setBackdropToggle] = useState(false)

  const getLocation = useCallback(async () => {
    try {
      const response = await fetch('/api/location')
      const data = await response.json()
      setLocation(data)
    } catch (error) {
      console.error('Failed to fetch location:', error)
    }
  }, [])

  useEffect(() => {
    getLocation()
  }, [getLocation])

  useEffect(() => {
    if (Object.keys(user).length) {
      localStorage.setItem('user', JSON.stringify(user))
    }
  }, [user])

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrollStatus(window.scrollY === 0 ? '' : 'scrolled')
      setBackToTop(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const backToTopButton = () => (
    <div
      data-testid="back-to-top"
      className={`bg-primary text-black fixed right-10 bottom-10 rounded-full w-14 h-14 text-center cursor-pointer z-[5]
        flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300
        transform transition-transform duration-200 ease-out hover:-translate-y-1
      `}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <ChevronUp size={35} />
    </div>
  )

  const imageBackdrop = () => (
    <div
      className="fixed inset-0 z-[9992] flex items-center justify-center bg-black/50"
      onClick={() => setBackdropToggle(!backdropToggle)}
    >
      <img src={backdropImage} alt="" className="max-h-full" />
    </div>
  )

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <AppContext.Provider
        value={{
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
          setUser,
        }}
      >
        {children}
        {backdropToggle && imageBackdrop()}
        {backToTop && backToTopButton()}
      </AppContext.Provider>
    </GoogleOAuthProvider>
  )
}
