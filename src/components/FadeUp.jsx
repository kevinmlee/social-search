'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * FadeUp
 *
 * A lightweight, AOS-style "fade up on scroll" animation wrapper.
 * Animates children when they enter the viewport and reverses the
 * animation when they leave.
 *
 * ─────────────────────────────────────────────
 * Usage:
 *
 * ```tsx
 * <FadeUp>
 *   <Post data={post} />
 * </FadeUp>
 * ```
 *
 * With staggered animations:
 *
 * ```tsx
 * {posts.map((post, i) => (
 *   <FadeUp key={post.id} delay={i * 100}>
 *     <Post data={post} />
 *   </FadeUp>
 * ))}
 * ```
 *
 * ─────────────────────────────────────────────
 * Notes:
 * - Client-only component.
 * - Children do NOT need to forward refs.
 * - Animation plays both on enter and exit.
 * - Respects `prefers-reduced-motion`.
 *
 * Props:
 * @param {React.ReactNode} children - Content to animate.
 * @param {number} [delay=0] - Optional delay in milliseconds.
 */
export default function FadeUp({
  children,
  delay = 0,
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting)
      },
      {
        threshold: 0.1,
      }
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`
        transform transition-all duration-700 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}