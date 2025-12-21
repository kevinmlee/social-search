'use client'

import React, { useContext } from "react"
import { AppContext } from "../../../app/providers"
import { Search } from "lucide-react"
import UserInput from "./components/UserInput"
import User from "./components/User"

const Header = () => {
  const { scrollStatus } = useContext(AppContext)

  console.log("Header scrollStatus:", scrollStatus)

  return (
    <div id="header" className="sticky top-0 z-50">
      <header className={`expanded md:flex bg-[#161819] pl-[215px] shadow-md ${scrollStatus === 'scrolled' ? 'py-2' : 'py-4'} transition-all duration-300 ease-in-out`}>
        <div className="flex justify-between items-center px-4 py-3">
          <div className="search relative">
            <Search
              className="search-icon absolute top-1/2 -translate-y-1/2 left-4 text-white"
              size={24}
            />
            <UserInput minimized={scrollStatus === 'scrolled'} />
          </div>

          <div>
            <User />
          </div>
        </div>
      </header>
    </div>
  )
}

export default Header

