import React, { Component } from "react";
import moment from "moment";
import axios from "axios";

import { Box, Typography, Radio } from "@mui/material";
import { Masonry } from "@mui/lab";
import CircularProgress from "@mui/material/CircularProgress";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

//import LayoutSelector from "../../../LayoutSelector";

/*
 * perhaps on first load, get recent hot posts from reddit
 * or worldnews
 * or provide option for both
 */

const searchQuery = localStorage.getItem("searchQuery");

export default class Reddit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hotPosts: [],

      filterToggle: false,
      loading: false,

      recent: false,
      popular: true,
    };

    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    //let userSettings = JSON.parse(localStorage.getItem("userSettings"));
    document.addEventListener("mousedown", this.handleClickOutside);

    this.getHotPosts();

    // on initial load, fetch the data if not already present
    if (this.state.popular && this.props.state.redditHot.length === 0)
      this.redditSearchHot();
  };

  componentWillUnmount = () => {
    document.removeEventListener("mousedown", this.handleClickOutside);
  };

  componentDidUpdate = () => {
    if (searchQuery !== "") {
      if (this.state.popular && this.props.state.redditHot.length === 0)
        this.redditSearchHot();
      if (this.state.recent && this.props.state.redditNew.length === 0)
        this.redditSearchNew();
    }

    setTimeout(function () {
      window.AOS.refresh();
    }, 500);
  };

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target))
      this.setState({ filterToggle: false });
  };

  changeTab = (event) => {
    const tabs = ["recent", "popular"];
    const selectedTab = event.currentTarget.getAttribute("data-tab");

    tabs.forEach((tab) => {
      if (tab === selectedTab) this.setState({ [tab]: true });
      else this.setState({ [tab]: false });
    });

    this.setState({ filterToggle: false });

    // pull data from cooresponding API if not already pulled
    if (selectedTab === "recent" && this.props.state.redditNew.length === 0)
      this.redditSearchNew();
    if (selectedTab === "popular" && this.props.state.redditHot.length === 0)
      this.redditSearchHot();
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

  getVideo = (post) => {
    if ("secure_media" in post.data) {
      if (post.data.secure_media) {
        if ("reddit_video" in post.data.secure_media) {
          //console.log(post.data);
          return (
            <Box className="reddit-video media" sx={{ marginBottom: 2 }}>
              <video
                preload="none"
                width="100%"
                height="auto"
                controls
                poster={this.getPreviewImage(post)}
              >
                <source
                  src={post.data.secure_media.reddit_video.fallback_url}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </Box>
          );
        }
        if ("secure_media_embed" in post.data) {
          let updatedString = post.data.secure_media.oembed.html.replace(
            "src=",
            'loading="lazy" src='
          );

          return (
            <Box className="youtube-video media" sx={{ marginBottom: 2 }}>
              <div
                dangerouslySetInnerHTML={{
                  __html: this.htmlDecode(updatedString),
                }}
              />
            </Box>
          );
        }
      }
    }
  };

  getPreviewImage = (post) => {
    if (post.data.preview)
      return post.data.preview.images[0].source.url.replaceAll("&amp;", "&");
  };

  redditSearchNew = async (e) => {
    return await axios
      .put("/reddit/search", {
        searchQuery: searchQuery,
        filter: "new",
      })
      .then(
        (response) => {
          this.props.setAppState({ redditNew: response.data.data.children });
        },
        (error) => console.log(error)
      );
  };

  redditSearchHot = async (e) => {
    return await axios
      .put("/reddit/search", {
        searchQuery: searchQuery,
        filter: "hot",
      })
      .then(
        (response) => {
          this.props.setAppState({ redditHot: response.data.data.children });
        },
        (error) => console.log(error)
      );
  };

  getHotPosts = async (e) => {
    this.setState({ loading: true });

    return await axios.put("/reddit/get/hot/posts", {}).then(
      (response) => {
        this.setState({
          hotPosts: response.data.data.children,
          loading: false,
        });
      },
      (error) => console.log(error)
    );
  };

  post = (post) => {
    return (
      <Box className="post" key={post.data.id} data-aos="fade-up">
        <a href={post.data.url} target="_blank" rel="noopener noreferrer">
          <Box className="details">
            {this.getVideo(post)
              ? this.getVideo(post)
              : this.getPreviewImage(post) && (
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
                        src={this.getPreviewImage(post)}
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
                  {moment.unix(post.data.created).utc().fromNow()}
                </Typography>
              </Box>

              <Box className="post-title">
                <Typography variant="h5">
                  {this.decodeText(post.data.title)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </a>
      </Box>
    );
  };

  filter = () => {
    return (
      <Box id="filterRow">
        <Box className="filter">
          <div
            className="active-display"
            onClick={() => this.toggle("filterToggle")}
          >
            <span className="active-filter">Filter</span>
            <FilterAltIcon />
          </div>
          <ul
            className={
              "filter-options " + (this.state.filterToggle && "active")
            }
            ref={this.wrapperRef}
          >
            <li
              className={this.state.recent ? "active" : ""}
              onClick={this.changeTab}
              data-tab="recent"
            >
              Recent
              <Radio checked={this.state.recent} size="small" />
            </li>
            <li
              className={this.state.popular ? "active" : ""}
              onClick={this.changeTab}
              data-tab="popular"
            >
              Hot
              <Radio checked={this.state.popular} size="small" />
            </li>
          </ul>
        </Box>
      </Box>
    );
  };

  render() {
    //const layout = this.props.state.layout;

    return (
      <Box sx={{ padding: "0 30px" }}>
        {this.filter()}

        {this.state.loading && (
          <Box className="ta-center" sx={{ paddingTop: "100px" }}>
            <CircularProgress color="inherit" />
          </Box>
        )}

        {!searchQuery && this.state.hotPosts.length > 0 && (
          <Box className="topic posts">
            <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
              {this.state.hotPosts.map((post, index) => this.post(post))}
            </Masonry>
          </Box>
        )}

        {this.state.recent && this.props.state.redditNew.length > 0 && (
          <Box className="topic posts">
            <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
              {this.props.state.redditNew
                .slice(0, 50)
                .map((post, index) => this.post(post))}
            </Masonry>
          </Box>
        )}

        {this.state.popular && this.props.state.redditHot.length > 0 && (
          <Box className="topic posts">
            <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
              {this.props.state.redditHot
                .slice(0, 50)
                .map((post, index) => this.post(post))}
            </Masonry>
          </Box>
        )}
      </Box>
    );
  }
}
