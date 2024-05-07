import React, { useContext, useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import utc from 'dayjs/plugin/utc'

import { Box, Typography } from "@mui/material"
import { Masonry } from "@mui/lab"

import Loader from "../../../components/Loader/Loader"
import Filter from "../../../components/Filter/Filter"
//import LayoutSelector from "../../../LayoutSelector"
import { AppContext } from "../../../App"

import "./Reddit.css"

dayjs.extend(relativeTime)
dayjs.extend(utc)

const endpoint = "https://www.reddit.com"

export default function Reddit() {
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
  };

  const htmlDecode = (input) => {
    var e = document.createElement("div")
    e.innerHTML = input
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue
  };

  const decodeText = (string) => {
    return string
      .replaceAll("&amp;", "&")
      .replaceAll("&lt;", "<")
      .replaceAll("&#39;", "'")
      .replaceAll("&quot;", '"')
      .replaceAll("&gt;", ">");
  }

  const getVideo = (post) => {
    if ("secure_media" in post.data) {
      if (post.data.secure_media) {
        if ("reddit_video" in post.data.secure_media) {
          return (
            <Box className="reddit-video media" sx={{ marginBottom: 2 }}>
              <video
                preload="none"
                width="100%"
                height="auto"
                controls
                poster={getPreviewImage(post)}
              >
                <source
                  src={post.data.secure_media.reddit_video.fallback_url}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </Box>
          )
        }
        if ("secure_media_embed" in post.data) {
          let updatedString = post.data.secure_media.oembed.html.replace(
            "src=",
            'loading="lazy" src='
          )

          return (
            <Box className="youtube-video media" sx={{ marginBottom: 2 }}>
              <div dangerouslySetInnerHTML={{ __html: htmlDecode(updatedString) }} />
            </Box>
          )
        }
      }
    }
  }

  const getPreviewImage = (post) => {
    if (post.data.preview)
      return post.data.preview.images[0].source.url.replaceAll("&amp;", "&")
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

  const postCard = (post) => {
    return (
      <Box className="post" key={post.data.id} data-aos="fade-up">
        <a href={post.data.url} target="_blank" rel="noopener noreferrer">
          <Box className="details">
            {getVideo(post)
              ? getVideo(post)
              : getPreviewImage(post) && (
                  <Box
                    className="media"
                    /*onClick={() => {
                    this.props.setAppState(
                      "backdropImage",
                      this.getPreviewImage(post)
                    );
                    this.props.setAppState("backdropToggle", true);
                  }}*/
                  >
                    <div className="media-image">
                      <img
                        className="featured-image"
                        src={getPreviewImage(post)}
                        alt={post.data.title}
                        loading="lazy"
                      />
                    </div>
                  </Box>
                )}

            <Box className="text">
              <Box className="author-details">
                <div className="subreddit">
                  {post.data.subreddit_name_prefixed}
                </div>
                <Typography variant="caption" style={{ color: "#999999" }}>
                  Posted by {post.data.author}
                </Typography>
                <span style={{ color: "#999999" }}> · </span>
                <Typography variant="caption" style={{ color: "#999999" }}>
                  {dayjs.unix(post.data.created).utc().fromNow()}
                </Typography>
              </Box>

              <Box className="post-title">
                <Typography variant="h5">
                  {decodeText(post.data.title)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </a>
      </Box>
    )
  }

  /*
  useEffect(() => {
    // on initial load, fetch the data if not already present
    if (filters.hot && searchHot.length === 0) search("hot");
    getHotPosts()
  }, [search, filters, searchHot])
  */

  return (
    <Box sx={{ padding: "0 30px" }}>
      <Filter
        filters={filters}
        onSuccess={(response) => handleFilter(response)}
      />

      {loading && <Loader />}

      {/* General hottest posts */}
      {!query && hotFeed > 0 && (
        <Box className="topic posts">
          <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
            {hotFeed.map((post) => postCard(post))}
          </Masonry>
        </Box>
      )}

      {/* Recent posts by search query */}
      {filters.recent && searchNew.length > 0 && (
        <Box className="topic posts">
          <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
            {searchNew.slice(0, 50).map((post) => postCard(post))}
          </Masonry>
        </Box>
      )}

      {/* Hot posts by search query */}
      {filters.hot && searchHot.length > 0 && (
        <Box className="topic posts">
          <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
            {searchHot.slice(0, 50).map((post) => postCard(post))}
          </Masonry>
        </Box>
      )}
    </Box>
  )
}
