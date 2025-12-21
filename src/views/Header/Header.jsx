'use client'

import { useContext } from "react"
import { Search } from "lucide-react"
import { AppContext } from "../../../app/providers"
import UserInput from "./components/UserInput"
import User from "./components/User"

const Header = () => {
  const { scrollStatus } = useContext(AppContext)

  return (
    <div id="header" className="flex-grow">
      <header className={`expanded sticky ${scrollStatus} md:flex bg-[#161819] pl-[215px] py-4 shadow-md fixed top-0 left-0 right-0 z-50`}>
        <div className="flex justify-between items-center px-4 py-3">
          <div className="search relative">
            <Search
              className="search-icon absolute top-1/2 -translate-y-1/2 left-2 text-gray-500"
              size={20}
            />
            <UserInput />
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

