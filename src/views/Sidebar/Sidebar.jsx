'use client'

import React, { useContext, useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Menu, X, LayoutGrid } from "lucide-react"
import { AppContext } from "../../../app/providers"

// Reusable active state classes
const ACTIVE_CLASSES = 'bg-primary/40 dark:bg-black/50 text-black dark:text-primary before:content-[""] before:block before:absolute before:left-0 before:top-0 before:w-[3px] before:h-full before:bg-black dark:before:bg-primary'

// Using custom SVG icons for Reddit and YouTube since Lucide doesn't have brand icons
const RedditIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
)

const YouTubeIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const BlueskyIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"/>
  </svg>
)

const MastodonIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z"/>
  </svg>
)

const platforms = [
  { name: "Reddit", icon: <RedditIcon />, path: "/reddit" },
  { name: "Bluesky", icon: <BlueskyIcon />, path: "/bluesky" },
  { name: "Mastodon", icon: <MastodonIcon />, path: "/mastodon" },
  //{ name: "Twitter", icon: <TwitterIcon />, path: "/twitter" },
  { name: "YouTube", icon: <YouTubeIcon />, path: "/youtube" },
]

const Sidebar = () => {
  const { query } = useContext(AppContext)
  const pathname = usePathname()
  const ref = useRef()
  const [sidebar, setSidebar] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    setSelected(document.querySelector('.menu-item.active'))
  }, [])

  const handleClick = element => {
    setSidebar(false)
    selected?.classList?.remove('active')
    element.target.classList.add('active')
    setSelected(element)
  }

  return (
    <div id="sidebar">
      <button
        className={`fixed z-[9999] ${sidebar ? 'top-[-2px] left-40' : 'top-6 left-2'} transition-all duration-300 ease-in-out p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 md:hidden`}
        aria-label="open drawer"
        onClick={() => setSidebar(!sidebar)}
      >
        {sidebar
          ? <X className="w-6 h-6" />
          : <Menu className="w-6 h-6" />
        }
      </button>

      <div
        className={`fixed z-[9991] left-0 top-0 h-full w-[200px] transition-all duration-300 ease-in-out bg-white dark:bg-dark border-r border-border-light dark:border-border-dark text-black dark:text-white ${
          sidebar ? 'ml-0' : 'ml-[-200px] md:ml-0'
        }`}
        ref={ref}
      >
        <div className="px-8 pt-12 pb-0 flex justify-center items-center">
          <h2 className="m-0 font-serif text-2xl font-bold">Currently</h2>
        </div>

        <div className="pt-12 pb-0 m-0">
          <Link href="/">
            <span className="menu-item-container tier-1" data-tab="home" onClick={handleClick}>
              <div className={`flex items-center px-8 py-2 text-sm cursor-pointer relative transition-all duration-300 capitalize ${
                pathname === "/" ? ACTIVE_CLASSES : 'text-black dark:text-white hover:bg-accent/40 dark:hover:bg-black/50'
              }`}>
                <LayoutGrid className="w-6 h-6 mr-4" />
                <span>Home</span>
              </div>
            </span>
          </Link>

          <div className="menu-item-container tier-1 mt-8">
            <div className="px-8 pb-4 text-[#aeaeae]">Platforms</div>

            <div className="m-0 p-0 list-none">
              {platforms.map(platform => (
                <Link href={`${platform.path}/${query ?? ''}`} key={platform.name} >
                  <span
                    className={`flex items-center px-8 py-2 text-sm cursor-pointer relative transition-all duration-300 capitalize ${
                      pathname?.includes(platform.path) ? ACTIVE_CLASSES : 'text-black dark:text-white hover:bg-accent/40 dark:hover:bg-black/50'
                    }`}
                    data-tab={platform.name.toLowerCase()}
                    onClick={handleClick}
                  >
                    <span className="mr-4">{platform.icon}</span>
                    <span>{platform.name}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar