import React, { Component } from "react";
import moment from "moment";
import axios from "axios";

//import LayoutSelector from "../../../LayoutSelector";
import { Box, Typography, Radio, Grid } from "@mui/material";
import { Masonry } from "@mui/lab";
import CircularProgress from "@mui/material/CircularProgress";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";

const FILTERS = ["relevance", "rating", "date"];

export default class YouTube extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,

      filterToggle: false,

      date: false,
      rating: false,
      relevance: true,
    };

    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount = async () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.addEventListener("mousedown", this.handleClickOutside);

    const ytSearchResults = this.props.state.ytSearchResults;
    if (this.props.state.previousSearchQuery && !ytSearchResults["relevance"])
      await this.search("relevance");
    else this.getTrendingVideos();
  };

  componentWillUnmount = () => {
    document.removeEventListener("mousedown", this.handleClickOutside);
  };

  componentDidUpdate = async () => {
    const ytSearchResults = this.props.state.ytSearchResults;

    // pull data from cooresponding API if not already pulled
    if (this.props.state.previousSearchQuery) {
      /*
      if (!ytSearchResults["relevance"] && !dataRetreived["relevance"]) {
        await this.search("relevance");
      }
      */
      //console.log("ytSearchResults", ytSearchResults);
      /*
      if (
        this.state.relevance &&
        !dataRetreived["relevance"] &&
        !ytSearchResults["relevance"]
      )
        await this.search("relevance");
        */
      /*
      FILTERS.forEach((filter) => {
        if (this.state[filter] && !ytSearchResults[filter]) this.search(filter);
      });
      */
      /*
      if (this.state.relevance && !ytSearchResults["relevance"])
        await this.search("relevance");
      else if (this.state.rating && !ytSearchResults["rating"])
        await this.search("rating");
      else if (this.state.date && !ytSearchResults["date"])
        await this.search("date");
        */
    }

    setTimeout(function () {
      window.AOS.refresh();
    }, 700);
  };

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target))
      this.setState({ filterToggle: false });
  };

  changeTab = (event) => {
    const selectedFilter = event.currentTarget.getAttribute("data-tab");

    FILTERS.forEach((filter) => {
      if (filter === selectedFilter) this.setState({ [filter]: true });
      else this.setState({ [filter]: false });
    });

    this.setState({ filterToggle: false });

    // pull data from cooresponding API if not already pulled
    const ytSearchResults = this.props.state.ytSearchResults;
    if (!ytSearchResults[selectedFilter]) this.search(selectedFilter);
  };

  toggle = async (state) => {
    await this.setState({ [state]: !this.state[state] });
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
    await this.props.setAppState("fetchError", false);

    return await axios
      .put("/youtube/search", {
        searchQuery: this.props.state.previousSearchQuery,
        order: filter,
      })
      .then(
        async (response) => {
          if ("items" in response.data) {
            let ytSearchResults = this.props.state.ytSearchResults;
            ytSearchResults[filter] = response.data;

            await this.props.setAppState("ytSearchResults", ytSearchResults);
          } else if ("error" in response.data)
            await this.props.setAppState("fetchError", true);

          await this.setState({ loading: false });
        },
        (error) => {
          console.log(error);
        }
      );
  };

  getTrendingVideos = async () => {
    const countryCode = this.props.state.geolocation.data.country_code;
    this.setState({ loading: true });

    return await axios
      .put("/youtube/get/trending", { region: countryCode })
      .then(
        async (response) => {
          if ("items" in response.data)
            await this.props.setAppState("ytTrendingVideos", response.data);

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
          className="youtube-post-link"
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

          <Grid container spacing={2} sx={{ paddingTop: 2 }}>
            <Grid item xs={10}>
              <span className="username">{post.snippet.channelTitle}</span>
              <span style={{ color: "#999999" }}> · </span>
              <Typography variant="caption" style={{ color: "#999999" }}>
                {moment(post.snippet.publishedAt).fromNow()}
              </Typography>
            </Grid>
          </Grid>

          <Typography variant="caption" style={{ color: "#999999" }}>
            {type}
          </Typography>

          <Box className="post-title" sx={{ paddingTop: 2 }}>
            <Typography variant="h5">
              {this.decodeText(post.snippet.title)}
            </Typography>
          </Box>
        </a>
      </Box>
    );
  };

  render() {
    //const layout = this.props.state.layout;
    const ytTrendingVideos = this.props.state.ytTrendingVideos;
    const ytSearchResults = this.props.state.ytSearchResults;

    return (
      <Box>
        {this.props.state.previousSearchQuery && !this.props.state.fetchError && (
          <Box id="filterRow">
            <Box className="filter">
              <div
                className="active-display"
                onClick={() => this.toggle("filterToggle")}
              >
                <span className="active-filter">Filter</span>
                <TuneRoundedIcon />
              </div>
              <ul
                className={
                  "filter-options " + (this.state.filterToggle && "active")
                }
                ref={this.wrapperRef}
              >
                {/*<li>All</li>*/}
                <li
                  className={this.state.relevance ? "active" : ""}
                  onClick={this.changeTab}
                  data-tab="relevance"
                >
                  Relevance
                  <Radio checked={this.state.relevance} size="small" />
                </li>
                <li
                  className={this.state.date ? "active" : ""}
                  onClick={this.changeTab}
                  data-tab="date"
                >
                  Recent
                  <Radio checked={this.state.date} size="small" />
                </li>
                <li
                  className={this.state.rating ? "active" : ""}
                  onClick={this.changeTab}
                  data-tab="rating"
                >
                  Rating
                  <Radio checked={this.state.rating} size="small" />
                </li>
              </ul>
            </Box>
            {/*<LayoutSelector
            state={this.props.state}
            updateLocalStorage={this.props.updateLocalStorage}
            setAppState={this.props.setAppState}
            />*/}
          </Box>
        )}

        {this.state.loading && (
          <Box className="ta-center" sx={{ paddingTop: "100px" }}>
            <CircularProgress color="inherit" />
          </Box>
        )}

        {"items" in ytTrendingVideos && !this.props.state.previousSearchQuery && (
          <Box className="topic posts">
            <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
              {ytTrendingVideos.items.map((post, index) => this.post(post))}
            </Masonry>
          </Box>
        )}

        {this.state.relevance &&
          ytSearchResults["relevance"] &&
          this.props.state.previousSearchQuery && (
            <Box className="topic posts">
              <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
                {ytSearchResults["relevance"].items.map((post, index) =>
                  this.post(post)
                )}
              </Masonry>
            </Box>
          )}

        {this.state.rating &&
          ytSearchResults["rating"] &&
          this.props.state.previousSearchQuery && (
            <Box className="topic posts">
              <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
                {ytSearchResults["rating"].items.map((post, index) =>
                  this.post(post)
                )}
              </Masonry>
            </Box>
          )}

        {this.state.date &&
          ytSearchResults["date"] &&
          this.props.state.previousSearchQuery && (
            <Box className="topic posts">
              <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
                {ytSearchResults["date"].items.map((post, index) =>
                  this.post(post)
                )}
              </Masonry>
            </Box>
          )}
      </Box>
    );
  }
}
