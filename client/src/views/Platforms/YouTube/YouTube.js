import React, { useContext, useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import moment from "moment"

import { Box, Typography, Grid } from "@mui/material"
import { Masonry } from "@mui/lab"
import Loader from "../../../components/Loader/Loader"
import Filter from "../../../components/Filter/Filter"
import { AppContext } from "../../../App"

import "./YouTube.css"

export default function YouTube() {
  //const [trending, setTrending] = useState({});
  const { setQuery } = useContext(AppContext)
  const { query } = useParams()
  const [searchResults, setSearchResults] = useState({})
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    relevance: true,
    rating: false,
    date: false
  })

  const search = useCallback(
    async (filter) => {
      const requestBody = { searchQuery: query, order: filter }
      setLoading(true)

      // serverless API call
      await fetch(`/.netlify/functions/youtubeSearch`, {
        method: "POST",
        body: JSON.stringify(requestBody),
      })
        .then((response) => response.json())
        .then((data) => {
          if ("items" in data) {
            const newResults = searchResults
            newResults[filter] = data
            setSearchResults(newResults)
          }
          setLoading(false);
        })
    },
    [searchResults, query]
  )

  useEffect(() => {
    setTimeout(() => window.AOS.refresh(), 700)
  })

  useEffect(() => {
    setQuery(query)
    search('relevance')
  }, [query, setQuery, search])

  /*
  useEffect(() => {
    if (query && !searchResults["relevance"]) search("relevance");
    //else getTrendingVideos();
  }, [search, searchResults, query])
  */

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

  const decodeText = (string) => {
    return string
      .replaceAll("&amp;", "&")
      .replaceAll("&lt;", "<")
      .replaceAll("&#39;", "'")
      .replaceAll("&quot;", '"')
      .replaceAll("&gt;", ">")
  }

  /*
  const search = useCallback(
    async (filter) => {
      setLoading(true);

      return await axios
        .put("https://prickly-umbrella-toad.cyclic.app/youtube/search", {
          searchQuery: query,
          order: filter,
        })
        .then(
          (response) => {
            if ("items" in response.data) {
              const newResults = searchResults;
              newResults[filter] = response.data;

              setSearchResults(newResults);
            }

            setLoading(false);
          },
          (error) => console.log(error)
        );
    },
    [searchResults]
  )
  */

  /*
  const getTrendingVideos = async () => {
    const countryCode = this.state.geolocation.data.country_code;
    this.setState({ loading: true });

    return await axios
      .put("/youtube/get/trending", { region: countryCode })
      .then(
        async (response) => {
          if ("items" in response.data)
            await this.setState({ ytTrendingVideos: response.data });

          await this.setState({ loading: false });
        },
        (error) => {
          console.log(error);
        }
      );
  };
  */

  const postCard = (post) => {
    let url = "";
    let type = "";

    if (post.id.kind === "youtube#video") {
      url = "https://www.youtube.com/watch?v=" + post.id.videoId;
      type = "Video";
    } else if (post.kind === "youtube#video") {
      url = "https://www.youtube.com/watch?v=" + post.videoId;
      type = "Video";
    } else if (
      post.id.kind === "youtube#channel" ||
      post.kind === "youtube#channel"
    ) {
      url = "https://www.youtube.com/channel/" + post.id.channelId;
      type = "Channel";
    }

    return (
      <Box className="post" key={post.etag} data-aos="fade-up">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="youtube-post-link details"
        >
          {type === "Channel" && (
            <div className="media-image">
              <img
                className="featured-image"
                src={post.snippet.thumbnails.high.url}
                alt={decodeText(post.snippet.title)}
                loading="lazy"
              />
            </div>
          )}

          {type === "Video" && (
            <div className="yt-embed">
              <img
                className="thumb"
                src={post.snippet.thumbnails.high.url}
                alt="thumb"
                loading="lazy"
              />

              {/*<iframe
              id="ytplayer"
              type="text/html"
              width="100%"
              height="250"
              loading="lazy"
              src={
                "https://www.youtube.com/embed/" +
                post.id.videoId +
                "?autoplay=0"
              }
              frameborder="0"
            ></iframe>*/}
            </div>
          )}

          <Box className="text">
            <Grid container sx={{ paddingTop: 2 }}>
              <Grid className="author-details" item xs={10}>
                <span className="username">{post.snippet.channelTitle}</span>
                <span style={{ color: "#999999" }}> · </span>
                <Typography variant="caption" style={{ color: "#999999" }}>
                  {moment(post.snippet.publishedAt).fromNow()}
                </Typography>
              </Grid>
            </Grid>

            {/*<Typography variant="caption" style={{ color: "#999999" }}>
              {type}
          </Typography>*/}

            <Box className="post-title">
              <Typography variant="h5">
                {decodeText(post.snippet.title)}
              </Typography>
            </Box>
          </Box>
        </a>
      </Box>
    );
  };

  return (
    <Box sx={{ padding: "0 30px;" }}>
      <Filter
        filters={filters}
        onSuccess={(response) => handleFilter(response)}
      />

      {loading && <Loader />}

      {/*
      {"items" in trending && !query && (
        <Box className="topic posts">
          <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
            {trending.items.map((post) => postCard(post))}
          </Masonry>
        </Box>
      )}*/}

      {filters.relevance && searchResults["relevance"] && query && (
        <Box className="topic posts">
          <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
            {searchResults["relevance"].items.map((post) => postCard(post))}
          </Masonry>
        </Box>
      )}

      {filters.rating && searchResults["rating"] && query && (
        <Box className="topic posts">
          <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
            {searchResults["rating"].items.map((post) => postCard(post))}
          </Masonry>
        </Box>
      )}

      {filters.date && searchResults["date"] && query && (
        <Box className="topic posts">
          <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
            {searchResults["date"].items.map((post) => postCard(post))}
          </Masonry>
        </Box>
      )}
    </Box>
  );
}
