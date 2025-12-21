'use client'

import React, { useContext, useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

import Loader from "../../../components/Loader/Loader"
import Filter from "../../../components/Filter/Filter"
import Post from "./Post"
import { AppContext } from "../../../../../app/providers"

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

    await fetch(`/api/youtube/search`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
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

    await fetch(`/api/youtube/trending`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    })
      .then(response => response.json())
      .then(data => {
        if ("items" in data) setTrending(data)
        setLoading(false);
      })
  }, [location])

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
    <div className="px-5 md:px-8">
      <Filter filters={filters} onSuccess={(response) => handleFilter(response)} />

      {loading && <Loader />}

      {!!('items' in trending && !query) && (
        <div className="topic posts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {trending.items.map(post => <Post data={post} key={post?.id}/>)}
          </div>
        </div>
      )}

      {!!(filters.relevance && searchResults["relevance"] && query) && (
        <div className="topic posts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {searchResults["relevance"].items.map(post => <Post data={post} key={post?.id}/>)}
          </div>
        </div>
      )}

      {!!(filters.rating && searchResults["rating"] && query) && (
        <div className="topic posts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {searchResults["rating"].items.map(post => <Post data={post} key={post?.id}/>)}
          </div>
        </div>
      )}

      {!!(filters.date && searchResults["date"] && query) && (
        <div className="topic posts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {searchResults["date"].items.map(post => <Post data={post} key={post?.id}/>)}
          </div>
        </div>
      )}
    </div>
  )
}

export default YouTube
