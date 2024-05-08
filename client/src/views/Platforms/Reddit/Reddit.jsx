import React, { useContext, useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"

import { Box } from "@mui/material"
import { Masonry } from "@mui/lab"
import Loader from "../../../components/Loader/Loader"
import Filter from "../../../components/Filter/Filter"
import Post from './Post'
//import LayoutSelector from "../../../LayoutSelector"
import { AppContext } from "../../../App"
import "./Reddit.css"

const endpoint = "https://www.reddit.com"

const Reddit = () => {
  const { setQuery } = useContext(AppContext)
  const { query } = useParams()
  const [hotFeed, setHotFeed] = useState([])
  const [searchHot, setSearchHot] = useState([])
  const [searchNew, setSearchNew] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ hot: true, recent: false })

  const search = useCallback(
    async (type) => {
      setLoading(true)
      await fetch(`${endpoint}/search.json?q=${query}&sort=${type}`)
        .then((response) => response.json())
        .then((data) => {
          if (type === "hot") setSearchHot(data.data.children)
          if (type === "new") setSearchNew(data.data.children)
          setLoading(false)
        })
    },
    [query]
  )

  useEffect(() => {
    setTimeout(() => window.AOS.refresh(), 700)
  })

  useEffect(() => {
    setQuery(query)

    if (!query) getHotPosts()
    
    if (filters.hot) {
      setSearchHot([])
      search('hot')
    }
    else if (filters.recent) {
      setSearchNew([])
      search('recent')
    }
  }, [query, setQuery, search, filters.hot, filters.recent])

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
 
  const getHotPosts = async (limit) => {
    setLoading(true)
    await fetch(`${endpoint}/hot.json?include_over_18=off&limit=${limit}`)
      .then((response) => response.json())
      .then((data) => {
        setHotFeed(data.data.children)
        setLoading(false)
      })
  }

  /*
  useEffect(() => {
    // on initial load, fetch the data if not already present
    if (filters.hot && searchHot.length === 0) search("hot");
    getHotPosts()
  }, [search, filters, searchHot])
  */

  return (
    <Box sx={{ padding: "0 20px" }} md={{ padding: "0 30px" }}>
      <Filter
        filters={filters}
        onSuccess={(response) => handleFilter(response)}
      />

      {loading && <Loader />}

      {/* General hottest posts */}
      {!query && hotFeed > 0 && (
        <Box className="topic posts">
          <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
            {hotFeed.map((post) => <Post data={post}/>)}
          </Masonry>
        </Box>
      )}

      {/* Recent posts by search query */}
      {filters.recent && searchNew.length > 0 && (
        <Box className="topic posts">
          <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
            {searchNew.slice(0, 50).map((post) => <Post data={post}/>)}
          </Masonry>
        </Box>
      )}

      {/* Hot posts by search query */}
      {filters.hot && searchHot.length > 0 && (
        <Box className="topic posts">
          <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
            {searchHot.slice(0, 50).map(post => <Post data={post}/>)}
          </Masonry>
        </Box>
      )}
    </Box>
  )
}

export default Reddit