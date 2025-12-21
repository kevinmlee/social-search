'use client'

import React, { useContext } from "react"
import { AppContext } from "../../../app/providers"
import { Search } from "lucide-react"
import UserInput from "./components/UserInput"
import User from "./components/User"

const Header = () => {
  const { scrollStatus } = useContext(AppContext)

  return (
    <div id="header" className="sticky top-0 z-50">
      <header className={`pl-10 bg-[#161819] md:pl-[215px] shadow-lg py-2 ${scrollStatus === 'scrolled' ? 'md:py-2' : 'md:py-4'} transition-all duration-300 ease-in-out`}>
        <div className="flex justify-between items-center w-full px-4 py-3">
          <div className="search relative flex-1 max-w-2xl">
            <Search
              className="search-icon absolute top-1/2 -translate-y-1/2 left-4 text-white"
              size={24}
            />
            <UserInput minimized={scrollStatus === 'scrolled'} />
          </div>

          <div className="ml-4">
            <User />
          </div>
        </div>
      </header>
    </div>
  )
}

export default Header

