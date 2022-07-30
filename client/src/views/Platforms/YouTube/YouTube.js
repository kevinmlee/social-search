import React, { Component } from "react";
import moment from "moment";
import axios from "axios";
//import LayoutSelector from "../../../LayoutSelector";
import { Box, Typography, Grid } from "@mui/material";
import { Masonry } from "@mui/lab";
import Loader from "../../../components/Loader/Loader";
import Filter from "../../../components/Filter/Filter";

import "./YouTube.css";

const FILTERS = ["relevance", "rating", "date"];
const searchQuery = localStorage.getItem("searchQuery");

export default class YouTube extends Component {
  constructor(props) {
    super(props);

    this.state = { ytTrendingVideos: {}, ytSearchResults: [], loading: false };
  }

  componentDidMount = async () => {
    // create and set filter options
    FILTERS.forEach((option, index) => {
      if (index === 0) this.state[option] = true;
      else this.state[option] = false;
    });

    const ytSearchResults = this.state.ytSearchResults;
    if (searchQuery && !ytSearchResults["relevance"])
      await this.search("relevance");
    //else this.getTrendingVideos();
  };

  componentDidUpdate = async () => {
    setTimeout(function () {
      window.AOS.refresh();
    }, 700);
  };

  handleFilter = (selectedOption) => {
    FILTERS.forEach((option) => {
      if (option === selectedOption) this.setState({ [option]: true });
      else this.setState({ [option]: false });
    });

    // pull data from cooresponding API if not already pulled
    const ytSearchResults = this.state.ytSearchResults;
    if (!ytSearchResults[selectedOption]) this.search(selectedOption);
  };

  htmlDecode = (input) => {
    var e = document.createElement("div");
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  };

  decodeText = (string) => {
    return string
      .replaceAll("&amp;", "&")
      .replaceAll("&lt;", "<")
      .replaceAll("&#39;", "'")
      .replaceAll("&quot;", '"')
      .replaceAll("&gt;", ">");
  };

  search = async (filter) => {
    await this.setState({ loading: true });

    return await axios
      .put("/youtube/search", {
        searchQuery: searchQuery,
        order: filter,
      })
      .then(
        async (response) => {
          if ("items" in response.data) {
            let ytSearchResults = this.state.ytSearchResults;
            ytSearchResults[filter] = response.data;

            await this.setState({ ytSearchResults: ytSearchResults });
          }

          await this.setState({ loading: false });
        },
        (error) => {
          console.log(error);
        }
      );
  };

  getTrendingVideos = async () => {
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

  post = (post) => {
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
      <Box className="post" key={post.id.videoId} data-aos="fade-up">
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
                alt={this.decodeText(post.snippet.title)}
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
                {this.decodeText(post.snippet.title)}
              </Typography>
            </Box>
          </Box>
        </a>
      </Box>
    );
  };

  render() {
    //const layout = this.props.state.layout;
    const ytTrendingVideos = this.state.ytTrendingVideos;
    const ytSearchResults = this.state.ytSearchResults;

    return (
      <Box sx={{ padding: "0 30px;" }}>
        <Filter
          filters={FILTERS}
          onSuccess={(response) => {
            this.handleFilter(response);
          }}
        />

        {this.state.loading && <Loader />}

        {"items" in ytTrendingVideos && !searchQuery && (
          <Box className="topic posts">
            <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
              {ytTrendingVideos.items.map((post) => this.post(post))}
            </Masonry>
          </Box>
        )}

        {this.state.relevance && ytSearchResults["relevance"] && searchQuery && (
          <Box className="topic posts">
            <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
              {ytSearchResults["relevance"].items.map((post) =>
                this.post(post)
              )}
            </Masonry>
          </Box>
        )}

        {this.state.rating && ytSearchResults["rating"] && searchQuery && (
          <Box className="topic posts">
            <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
              {ytSearchResults["rating"].items.map((post) => this.post(post))}
            </Masonry>
          </Box>
        )}

        {this.state.date && ytSearchResults["date"] && searchQuery && (
          <Box className="topic posts">
            <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
              {ytSearchResults["date"].items.map((post) => this.post(post))}
            </Masonry>
          </Box>
        )}
      </Box>
    );
  }
}
