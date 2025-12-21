'use client'

import { useEffect } from 'react'

export default function ScrollToTopOnLoad() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return null
}