import React, { useCallback, useContext, useState, useRef, useEffect } from "react"
import { useNavigate } from 'react-router-dom'

import { Box, IconButton, TextField, Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { AppContext } from "@/App"
import { debounce, useOutsideClick } from "@/util"

export default function UserInput() {
  const navigate = useNavigate()
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
      if (window.location.pathname === "/") navigate(`/reddit/${searchQuery}`)
      else navigate(`${window.location.pathname.split('/')[1]}/${searchQuery}`)
    }
  }, [navigate, query])

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

  return (
    <div className="search-input">
      <Box sx={{}}>
        <form onSubmit={(e) => debounce((search(e), 500))}>
          <TextField
            variant="filled"
            name="search"
            value={query}
            size="small"
            placeholder={query ? query : "Search"}
            spellCheck="false"
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchFocus(!searchFocus)}
            fullWidth={true}
            ref={ref}
          />
        </form>
      </Box>

      {searchFocus && searchHistory.length > 0 && (
        <Box id="recentSearches" ref={outsideClick}>
          <div className="top d-flex">
            <Typography variant="h6">Recent</Typography>
            <Typography className="clear" onClick={() => clearRecentSearches()}>
              Clear all
            </Typography>
          </div>

          <ul className="searches">
            {searchHistory.map((query) => (
              <li className="recent-item" key={query}>
                <span className="query" onClick={(e) => selectRecentSearch(e, query)}>
                  {query}
                </span>

                <IconButton
                  aria-label="remove"
                  color="primary"
                  onClick={(e) => clearSelectedSearch(e, query)}
                >
                  <CloseIcon />
                </IconButton>
              </li>
            ))}
          </ul>
        </Box>
      )}
    </div>
  )
}
