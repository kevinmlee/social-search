'use client'

import React, { useContext, useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"

import Loader from "../../../components/Loader/Loader"
import Filter from "../../../components/Filter/Filter"
import Post from './Post'
import { AppContext } from "../../../../../app/providers"

const endpoint = "https://www.reddit.com"

const Reddit = () => {
  const { setQuery } = useContext(AppContext)
  const { query } = useParams()
  const [hotFeed, setHotFeed] = useState([])
  const [searchHot, setSearchHot] = useState([])
  const [searchNew, setSearchNew] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ hot: true, recent: false })

  const search = useCallback(async (type) => {
    setLoading(true)
    await fetch(`${endpoint}/search.json?q=${query}&sort=${type}`)
      .then((response) => response.json())
      .then((data) => {
        if (type === "hot") setSearchHot(data.data.children)
        if (type === "new") setSearchNew(data.data.children)
        setLoading(false)
      })
  }, [query])

  const getHotPosts = useCallback(async (limit) => {
    setLoading(true)
    await fetch(`${endpoint}/hot.json?include_over_18=off&limit=${limit}`)
      .then((response) => response.json())
      .then((data) => {
        setHotFeed(data.data.children)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    setTimeout(() => window.AOS.refresh(), 700)
  })

  useEffect(() => {
    if (!query) getHotPosts()
    
    if (query) {
      setQuery(query)

      if (filters.hot) {
        setSearchHot([])
        search('hot')
      } else if (filters.recent) {
        setSearchNew([])
        search('recent')
      }
    }
  }, [getHotPosts, query, setQuery, search, filters.hot, filters.recent])

  const handleFilter = (selectedOption) => {
    const tempFilters = { ...filters };
    for (const option in filters) {
      if (option === selectedOption) tempFilters[option] = true;
      else tempFilters[option] = false;
    }
    setFilters(tempFilters);

    // change views & pull data from cooresponding API if not already pulled
    if (selectedOption === "recent" && searchNew.length === 0)
      search("new", "searchNew")
    if (selectedOption === "hot" && searchHot.length === 0)
      search("hot", "searchHot")
  }

  return (
    <div className="px-5 md:px-8">
      <Filter filters={filters} onSuccess={(response) => handleFilter(response)} />
      {loading && <Loader />}

      {/* General hottest posts */}
      {!!(!query && hotFeed.length) && (
        <div className="topic posts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {hotFeed.map((post) => <Post data={post} key={post?.data?.id}/>)}
          </div>
        </div>
      )}

      {/* Recent posts by search query */}
      {!!(filters.recent && searchNew.length) && (
        <div className="topic posts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {searchNew.slice(0, 50).map((post) => <Post data={post} key={post?.data?.id}/>)}
          </div>
        </div>
      )}

      {/* Hot posts by search query */}
      {!!(filters.hot && searchHot.length) && (
        <div className="topic posts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {searchHot.slice(0, 50).map(post => <Post data={post} key={post?.data?.id}/>)}
          </div>
        </div>
      )}
    </div>
  )
}

export default Reddit