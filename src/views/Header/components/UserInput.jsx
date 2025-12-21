'use client'

import React, { useCallback, useContext, useState, useRef, useEffect } from "react"
import { useRouter } from 'next/navigation'

import { X } from "lucide-react"
import { AppContext } from "../../../../app/providers"
import { debounce, useOutsideClick } from "@/util"

export default function UserInput({ minimized = false}) {
  const router = useRouter()
  const { query, setQuery } = useContext(AppContext)
  const [searchFocus, setSearchFocus] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])
  const ref = useRef()
  const outsideClick = useOutsideClick(() => setSearchFocus(false))

  useEffect(() => {
    let searches = JSON.parse(localStorage.getItem("searches"))
    if (searches) setSearchHistory(searches)
    else localStorage.setItem("searches", JSON.stringify([]))
  }, [])

  /*
  const throttle = (func, ms) => {
    let timer;

    return (...args) => {
      let currTime = new Date();
      let elapsed = currTime - timer;
      if (timer === undefined || elapsed > ms) {
        func.apply(this, args);
        timer = currTime;
      }
    };
  };
  */

  const search = useCallback((e, selectedSearchQuery) => {
    if (e) e.preventDefault()

    const searchQuery = selectedSearchQuery ?? query

    // if (validator.isAlphanumeric(searchQuery)) {
    if (searchQuery) {
      updateRecentSearches(searchQuery)
      setSearchFocus(false)

      // switch tab to reddit if on homepage
      if (window.location.pathname === "/") router.push(`/reddit/${searchQuery}`)
      else router.push(`/${window.location.pathname.split('/')[1]}/${searchQuery}`)
    }
  }, [router, query])

  const updateRecentSearches = (searchQuery) => {
    let searches = []

    if (localStorage.getItem("searches"))
      searches = JSON.parse(localStorage.getItem("searches"))

    if (searches.length > 0) {
      // remove queries over 5
      if (searches.length >= 5) searches.pop()

      // if query already exists, move to top / front of array
      if (searches.includes(searchQuery)) {
        searches = searches.filter((item) => item !== searchQuery)
        searches.unshift(searchQuery)
      }
      // if query does not exist, add to front of array
      else searches.unshift(searchQuery)
    } else searches = [searchQuery]

    localStorage.setItem("searches", JSON.stringify(searches))
    setSearchHistory(searches)
  };

  const clearRecentSearches = () => {
    setSearchHistory([])
    setSearchFocus(false)
    localStorage.setItem("searches", JSON.stringify([]))
  };

  const clearSelectedSearch = (e, selectedQuery) => {
    const searches = searchHistory.filter((e) => e !== selectedQuery)

    setSearchHistory(searches)
    setSearchFocus(false)
    localStorage.setItem("searches", JSON.stringify(searches))
  };

  const selectRecentSearch = (e, selectedQuery) => {
    setQuery(selectedQuery)
    search(e, selectedQuery)
  }
  /*
      // border-radius: 12px;
    // height: 45px;
    // padding: 8px 8px 8px 60px;
    */

  return (
    <div id="search-input">
      <div>
        <form onSubmit={(e) => debounce((search(e), 500))}>
          <input
            id="search-input-box"
            type="text"
            name="search"
            value={query}
            placeholder={query ? query : "Search"}
            spellCheck="false"
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchFocus(!searchFocus)}
            ref={ref}
            className={`w-full max-w-[500px] ${minimized ? 'h-[45px]' : 'h-[65px]'} bg-[#131516] pl-14 pr-4 py-2 border border-[#2c2f33] rounded-xl text-medium tracking-wide focus:outline-none focus:ring-2 focus:ring-accent`}
          />
        </form>
      </div>

      {searchFocus && searchHistory.length > 0 && (
        <div
          id="recentSearches"
          ref={outsideClick}
          className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-gray-900 border border-border-light dark:border-border-dark rounded-md shadow-lg overflow-hidden"
        >
          <div className="flex justify-between items-center px-4 py-3 border-b border-border-light dark:border-border-dark">
            <h6 className="text-base font-semibold">Recent</h6>
            <button
              onClick={() => clearRecentSearches()}
              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
            >
              Clear all
            </button>
          </div>

          <ul className="list-none m-0 p-0">
            {searchHistory.map((query) => (
              <li
                className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-border-light dark:border-border-dark last:border-b-0"
                key={query}
              >
                <span
                  className="flex-grow cursor-pointer"
                  onClick={(e) => selectRecentSearch(e, query)}
                >
                  {query}
                </span>

                <button
                  aria-label="remove"
                  onClick={(e) => clearSelectedSearch(e, query)}
                  className="ml-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
