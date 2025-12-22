'use client'

import { useEffect, useRef } from 'react'

const useOutsideClick = handler => {
  const ref = useRef(null)

  useEffect(() => {
    const onClick = event => {
      if (ref.current && !ref.current.contains(event.target)) handler(event)
    }

    document.addEventListener('pointerdown', onClick, { passive: true })
    return () => document.removeEventListener('pointerdown', onClick)
  }, [handler, ref])

  return ref
}

export default useOutsideClick