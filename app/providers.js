'use client'

import { createContext, useCallback, useEffect, useState } from 'react'
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
      setScrollStatus(window.scrollY === 0 ? 'top' : 'sticky')
      setBackToTop(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const backToTopButton = () => (
    <div
      className="back-to-top"
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
  )
}
