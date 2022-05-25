import React, { Component } from "react";
import moment from "moment";
import axios from "axios";

//import LayoutSelector from "../../../LayoutSelector";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Typography, Radio, Grid } from "@mui/material";

/*import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";*/
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { Masonry } from "@mui/lab";

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

  componentDidMount = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    document.addEventListener("mousedown", this.handleClickOutside);

    /*
    this.getTrendingVideos();
    console.log(this.props.state.ytTrendingVideos);
    */

    if (!("items" in this.props.state.youtubeVideosRelevance))
      this.searchVideosRelevance();
  };

  componentWillUnmount = () => {
    document.removeEventListener("mousedown", this.handleClickOutside);
  };

  componentDidUpdate = () => {
    setTimeout(function () {
      window.AOS.refresh();
    }, 500);
  };

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target))
      this.setState({ filterToggle: false });
  };

  changeTab = (event) => {
    const tabs = ["date", "rating", "relevance"];
    const selectedTab = event.currentTarget.getAttribute("data-tab");

    tabs.forEach((tab) => {
      if (tab === selectedTab) this.setState({ [tab]: true });
      else this.setState({ [tab]: false });
    });

    this.setState({ filterToggle: false });

    // pull data from cooresponding API if not already pulled
    if (
      selectedTab === "rating" &&
      !("items" in this.props.state.youtubeVideosRating)
    )
      this.searchVideosRating();
    if (
      selectedTab === "date" &&
      !("items" in this.props.state.youtubeVideosDate)
    )
      this.searchVideosDate();
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

  searchVideosRelevance = async () => {
    return await axios
      .put("/youtube/search", {
        searchQuery: this.props.state.previousSearchQuery,
        order: "relevance",
      })
      .then(
        (response) => {
          if ("items" in response.data)
            this.props.setAppState("youtubeVideosRelevance", response.data);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  searchVideosRating = async () => {
    return await axios
      .put("/youtube/search", {
        searchQuery: this.props.state.previousSearchQuery,
        order: "rating",
      })
      .then(
        (response) => {
          if ("items" in response.data)
            this.props.setAppState("youtubeVideosRating", response.data);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  searchVideosDate = async () => {
    return await axios
      .put("/youtube/search", {
        searchQuery: this.props.state.previousSearchQuery,
        order: "date",
      })
      .then(
        (response) => {
          if ("items" in response.data)
            this.props.setAppState("youtubeVideosDate", response.data);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  getTrendingVideos = async () => {
    this.setState({ loading: true });
    return await axios.put("/youtube/get/trending", {}).then(
      (response) => {
        if ("items" in response.data)
          this.props.setAppState("ytTrendingVideos", response.data);

        this.setState({ loading: false });
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
    } else if (post.id.kind === "youtube#channel") {
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
    const layout = this.props.state.layout;

    return (
      <Box>
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

        {this.state.loading && (
          <Box className="ta-center" sx={{ paddingTop: "100px" }}>
            <CircularProgress color="inherit" />
          </Box>
        )}

        {this.state.relevance &&
          "items" in this.props.state.youtubeVideosRelevance && (
            <Box className="topic posts">
              <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
                {this.props.state.youtubeVideosRelevance.items.map(
                  (post, index) => {
                    return this.post(post);
                  }
                )}
              </Masonry>
            </Box>
          )}

        {this.state.rating && "items" in this.props.state.youtubeVideosRating && (
          <Box className="topic posts">
            <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
              {this.props.state.youtubeVideosRating.items.map((post, index) => {
                return this.post(post);
              })}
            </Masonry>
          </Box>
        )}

        {this.state.date && "items" in this.props.state.youtubeVideosDate && (
          <Box className="topic posts">
            <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
              {this.props.state.youtubeVideosDate.items.map((post, index) => {
                return this.post(post);
              })}
            </Masonry>
          </Box>
        )}
      </Box>
    );
  }
}
