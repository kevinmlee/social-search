import React, { Component } from "react";
import moment from "moment";
import axios from "axios";

import { Box, Typography } from "@mui/material";
import { Masonry } from "@mui/lab";

import Loader from "../../../components/Loader/Loader";
import Filter from "../../../components/Filter/Filter";

//import LayoutSelector from "../../../LayoutSelector";

import "./Reddit.css";

const searchQuery = localStorage.getItem("searchQuery");
const filters = ["hot", "recent"];

export default class Reddit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hotPosts: [],
      loading: false,
    };
  }

  componentDidMount = () => {
    // create and set filter options
    filters.forEach((option, index) => {
      if (index === 0) this.state[option] = true;
      else this.state[option] = false;
    });

    this.getHotPosts();

    // on initial load, fetch the data if not already present
    if (this.state.hot && this.props.state.redditHot.length === 0)
      this.redditSearchHot();
  };

  componentDidUpdate = () => {
    if (searchQuery !== "") {
      if (this.state.hot && this.props.state.redditHot.length === 0)
        this.redditSearchHot();
      if (this.state.recent && this.props.state.redditNew.length === 0)
        this.redditSearchNew();
    }

    setTimeout(function () {
      window.AOS.refresh();
    }, 500);
  };

  handleFilter = (selectedOption) => {
    filters.forEach((option) => {
      if (option === selectedOption) this.setState({ [option]: true });
      else this.setState({ [option]: false });
    });

    // change views & pull data from cooresponding API if not already pulled
    if (selectedOption === "recent" && this.props.state.redditNew.length === 0)
      this.redditSearchNew();
    if (selectedOption === "hot" && this.props.state.redditHot.length === 0)
      this.redditSearchHot();
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

  render() {
    //const layout = this.props.state.layout;

    return (
      <Box sx={{ padding: "0 30px" }}>
        <Filter
          filters={filters}
          onSuccess={(response) => {
            this.handleFilter(response);
          }}
        />

        {this.state.loading && <Loader />}

        {/* General hottest posts */}
        {!searchQuery && this.state.hotPosts.length > 0 && (
          <Box className="topic posts">
            <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
              {this.state.hotPosts.map((post, index) => this.post(post))}
            </Masonry>
          </Box>
        )}

        {/* Recent posts by search query */}
        {this.state.recent && this.props.state.redditNew.length > 0 && (
          <Box className="topic posts">
            <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
              {this.props.state.redditNew
                .slice(0, 50)
                .map((post, index) => this.post(post))}
            </Masonry>
          </Box>
        )}

        {/* Hot posts by search query */}
        {this.state.hot && this.props.state.redditHot.length > 0 && (
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
