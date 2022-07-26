import React, { Component } from "react";
import moment from "moment";
import axios from "axios";
//import $ from "jquery";

import { Box, Typography } from "@mui/material";
import { Masonry } from "@mui/lab";

import "./Home.css";

const TOPICS = [
  "news",
  "technology",
  //"futurology",
  "science",
  "sports",
  "space",
  "nutrition",
];

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subreddits: [],
    };
  }

  componentDidMount = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    this.getPosts();
  };

  componentDidUpdate = () => {
    setTimeout(function () {
      window.AOS.refresh();
    }, 500);
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

  isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  getVideo = (post) => {
    if ("secure_media" in post.data) {
      if (post.data.secure_media) {
        if ("reddit_video" in post.data.secure_media) {
          //console.log(post.data);
          return (
            <Box className="reddit-video media" sx={{ marginTop: 2 }}>
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
            <Box className="youtube-video" sx={{ marginTop: 2 }}>
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

  getSubredditPosts = async (subreddit) => {
    return await axios
      .put("/reddit/get/subreddit/posts", {
        subreddit: subreddit,
        filter: "hot",
        limit: 10,
      })
      .then(
        (response) => {
          let subreddits = this.state.subreddits;
          subreddits[subreddit] = response.data.data.children;

          this.setState({ subreddits: subreddits });
        },
        (error) => console.log(error)
      );
  };

  getPosts = async () => {
    for (const topic of TOPICS) await this.getSubredditPosts(topic);
  };

  searchSubreddits = async (query) => {
    return await axios
      .put("/reddit/search/subreddits", {
        searchQuery: query,
      })
      .then(
        (response) => {
          //let subreddits = this.props.state.subreddits;
          //subreddits[subreddit] = response.data.data.children;

          console.log("subreddit search results", response.data.data.children);

          //this.props.setAppState("subreddits", subreddits);
        },
        (error) => console.log(error)
      );
  };

  post = (post) => {
    let classes = "";

    if (post.data.over_18) classes += "nsfw ";

    return (
      <Box className={"post " + classes} key={post.data.id} data-aos="fade-up">
        <a href={post.data.url} target="_blank" rel="noopener noreferrer">
          <Box className="details">
            {this.getVideo(post)
              ? this.getVideo(post)
              : this.getPreviewImage(post) && (
                  <Box className="media">
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
    const posts = this.state.subreddits;

    return (
      <Box sx={{ paddingTop: 2, paddingBottom: 2 }}>
        <ul className="fw-filter">
          {TOPICS.map((topic) => (
            <li
              key={"key-" + topic}
              className="topic"
              onClick={() => {
                document.getElementById(topic).scrollIntoView();
              }}
            >
              {topic}
            </li>
          ))}
        </ul>

        <Box>
          {Object.keys(posts).map((key) => (
            <Box id={key} className="topic posts" key={key}>
              <Typography className="section-title" variant="h4">
                {key}
              </Typography>

              <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
                {posts[key].map((post) => this.post(post))}
              </Masonry>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }
}
