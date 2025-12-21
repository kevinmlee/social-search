'use client'

import React, { useContext, useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Menu, X, LayoutGrid } from "lucide-react"
import { AppContext } from "../../../app/providers"

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

const platforms = [
  { name: "Reddit", icon: <RedditIcon />, path: "/reddit" },
  //{ name: "Twitter", icon: <TwitterIcon />, path: "/twitter" },
  { name: "YouTube", icon: <YouTubeIcon />, path: "/youtube" }
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
    <div className="sidebar-container">
      <button
        className={`fixed z-[9999] top-3 left-5 transition-all duration-300 ease-in-out p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 md:hidden ${
          sidebar ? 'top-[-2px] left-40' : ''
        }`}
        aria-label="open drawer"
        onClick={() => setSidebar(!sidebar)}
      >
        {sidebar
          ? <X className="w-6 h-6" />
          : <Menu className="w-6 h-6" />
        }
      </button>

      <div
        className={`fixed z-[9991] left-0 top-0 h-full w-[200px] transition-all duration-300 ease-in-out bg-white dark:bg-bg-dark border-r border-border-light dark:border-border-dark text-black dark:text-white ${
          sidebar ? 'ml-0' : 'ml-[-200px] md:ml-0'
        }`}
        ref={ref}
      >
        <div className="px-8 pt-12 pb-0 flex justify-center items-center">
          <h2 className="m-0 font-serif">Currently</h2>
        </div>

        <div className="pt-12 pb-0 m-0">
          <Link href="/">
            <span className="menu-item-container tier-1" data-tab="home" onClick={handleClick}>
              <div className={`flex items-center px-8 py-2 text-sm cursor-pointer relative transition-all duration-300 capitalize text-black dark:text-white hover:bg-accent/40 dark:hover:bg-black/50 ${
                pathname === "/" ? 'active bg-accent/40 dark:bg-black/50 text-black dark:text-accent before:content-[""] before:block before:absolute before:left-0 before:top-0 before:w-[3px] before:h-full before:bg-black dark:before:bg-accent' : ''
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
                    className={`flex items-center px-8 py-2 text-sm cursor-pointer relative transition-all duration-300 capitalize text-black dark:text-white hover:bg-accent/40 dark:hover:bg-black/50 ${
                      pathname?.includes(platform.path) ? 'active bg-accent/40 dark:bg-black/50 text-black dark:text-accent before:content-[""] before:block before:absolute before:left-0 before:top-0 before:w-[3px] before:h-full before:bg-black dark:before:bg-accent' : ''
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