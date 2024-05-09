import React, { useContext, useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

import { Box } from "@mui/material"
import { Masonry } from "@mui/lab"
import Loader from "../../../components/Loader/Loader"
import Filter from "../../../components/Filter/Filter"
import Post from "./Post"
import { AppContext } from "../../../App"
import "./YouTube.css"

dayjs.extend(relativeTime)

const YouTube = () => {
  const [trending, setTrending] = useState({});
  const { location, setQuery } = useContext(AppContext)
  const { query } = useParams()
  const [searchResults, setSearchResults] = useState({})
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    relevance: true,
    rating: false,
    date: false
  })

  const search = useCallback(async (filter) => {
    const requestBody = { searchQuery: query, order: filter }
    setLoading(true)

    // serverless API call
    await fetch(`/.netlify/functions/youtubeSearch`, {
      method: "POST",
      body: JSON.stringify(requestBody),
    })
      .then(response => response.json())
      .then(data => {
        if ("items" in data) {
          setSearchResults(prevSearchResults => ({ ...prevSearchResults, [filter]: data }))
        }
        setLoading(false);
      })
  }, [query])

  const fetchTrendingVideos = useCallback(async () => {
    const requestBody = { countryCode: location?.country_code }
    setLoading(true)

    await fetch(`/.netlify/functions/youtubeTrending`, {
      method: "POST",
      body: JSON.stringify(requestBody),
    })
      .then(response => response.json())
      .then(data => {
        if ("items" in data) setTrending(data)
        setLoading(false);
      })
  }, [location])

  useEffect(() => {
    setTimeout(() => window.AOS.refresh(), 700)
  })

  useEffect(() => {
    if (query) {
      setQuery(query)
      search('relevance')
    }
    else {
      fetchTrendingVideos()
    }
  }, [query, setQuery, search, fetchTrendingVideos])

  const handleFilter = (selectedOption) => {
    const tempFilters = { ...filters }
    for (const option in filters) {
      if (option === selectedOption) tempFilters[option] = true
      else tempFilters[option] = false
    }
    setFilters(tempFilters)

    // pull data from cooresponding API if not already pulled
    if (!searchResults[selectedOption]) search(selectedOption)
  }

  return (
    <Box sx={{ padding: "0 20px" }} md={{ padding: "0 30px" }}>
      <Filter filters={filters} onSuccess={(response) => handleFilter(response)} />

      {loading && <Loader />}

      {!!('items' in trending && !query) && (
        <Box className="topic posts">
          <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
            {trending.items.map(post => <Post data={post} key={post?.id}/>)}
          </Masonry>
        </Box>
      )}

      {!!(filters.relevance && searchResults["relevance"] && query) && (
        <Box className="topic posts">
          <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
            {searchResults["relevance"].items.map(post => <Post data={post} key={post?.id}/>)}
          </Masonry>
        </Box>
      )}

      {!!(filters.rating && searchResults["rating"] && query) && (
        <Box className="topic posts">
          <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
            {searchResults["rating"].items.map(post => <Post data={post} key={post?.id}/>)}
          </Masonry>
        </Box>
      )}

      {!!(filters.date && searchResults["date"] && query) && (
        <Box className="topic posts">
          <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
            {searchResults["date"].items.map(post => <Post data={post} key={post?.id}/>)}
          </Masonry>
        </Box>
      )}
    </Box>
  )
}

export default YouTube
