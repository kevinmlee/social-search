import React, { Component } from "react";
import moment from "moment";
import axios from "axios";

import { Box, Paper, Grid, Typography } from "@mui/material";
import { Masonry } from "@mui/lab";
import VerifiedIcon from "@mui/icons-material/Verified";

import Loader from "../../../components/Loader/Loader";
import Filter from "../../../components/Filter/Filter";

import "./Twitter.css";

let filters = ["user", "popular", "recent"];

export default class Twitter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      twitterUserID: "",
      queryWithoutSymbols: "",

      loading: false,
    };
  }

  setPromisedState = async (state) => {
    new Promise((resolve) => this.setState(state, resolve));
  };

  componentDidMount = async () => {
    /*window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    */

    // create and set filter options
    filters.forEach((option, index) => {
      if (index === 0) this.state[option] = true;
      else this.state[option] = false;
    });

    await this.twitterSearchByUsername();

    if (!("data" in this.props.state.tweetsByRecent))
      await this.twitterSearchByRecent();
  };

  componentDidUpdate = () => {
    setTimeout(function () {
      window.AOS.refresh();
    }, 500);
  };

  handleFilter = (selectedOption) => {
    filters.forEach((option) => {
      if (option === selectedOption) this.setState({ [option]: true });
      else this.setState({ [option]: false });
    });

    /*
    // change views & pull data from cooresponding API if not already pulled
    if (selectedOption === "recent" && this.props.state.redditNew.length === 0)
      this.redditSearchNew();
    if (selectedOption === "hot" && this.props.state.redditHot.length === 0)
      this.redditSearchHot();
      */
  };

  toggle = async (state) => {
    await this.setState({ [state]: !this.state[state] });
  };

  decodeText = (string) => {
    return string
      .replaceAll("&amp;", "&")
      .replaceAll("&lt;", "<")
      .replaceAll("&#39;", "'")
      .replaceAll("&quot;", '"')
      .replaceAll("&gt;", ">");
  };

  oneWord = (string) => {
    var regexp = /[a-zA-Z]+\s+[a-zA-Z]+/g;
    if (regexp.test(string)) return false;
    else return true;
  };

  objectEmpty = (obj) => {
    return (
      obj && // 👈 null and undefined check
      Object.keys(obj).length === 0 &&
      Object.getPrototypeOf(obj) === Object.prototype
    );
  };

  getHighQualityAvatar = (url) => {
    return url.replace("_normal", "_400x400");
  };

  twitterSearchByRecent = async (e) => {
    this.setState({ loading: true });

    return await axios
      .put("/twitter/search", {
        searchQuery: localStorage.getItem("searchQuery"),
      })
      .then(
        (response) => {
          if ("error" in response.data)
            this.props.setAppState({ twitterError: true });
          else this.props.setAppState({ tweetsByRecent: response.data.tweets });

          this.setState({ loading: false });
        },
        (error) => console.log(error)
      );
  };

  twitterSearchByUsername = async (e) => {
    const query = localStorage.getItem("searchQuery");

    // if search query is a username (has @ symbol in front), remove symbol and continue to get user
    if (this.oneWord(query)) {
      if (query.charAt(0) === "@")
        this.setState({ queryWithoutSymbols: query.substring(1) });
    }

    return await axios
      .put("/twitter/search/username", {
        searchQuery: query,
      })
      .then(
        async (response) => {
          if (response.data.error || this.objectEmpty(response.data))
            return false;
          else {
            await this.setPromisedState({
              twitterUserID: response.data.twitterResults.id,
              recent: false,
              popular: false,
              user: true,
            });

            await this.props.setAppState({
              twitterUser: response.data.twitterResults,
            });

            this.getTweetsByUserID(response.data.twitterResults.id);
            return true;
          }
        },
        (error) => console.log(error)
      );
  };

  getTweetsByUserID = async (twitterId) => {
    this.setState({ loading: true });

    return await axios
      .put("/twitter/get/tweets/id", {
        userId: twitterId,
      })
      .then(
        async (response) => {
          await this.props.setAppState({
            tweetsByUserId: response.data.tweets,
          });
          this.setState({ loading: false });
        },
        (error) => console.log(error)
      );
  };

  sortByPopularity = (tweets) => {
    if (tweets)
      return [...tweets].sort((a, b) => {
        let aPublicMetricsCount =
          a.public_metrics.retweet_count + a.public_metrics.like_count;
        let bPublicMetricsCount =
          b.public_metrics.retweet_count + b.public_metrics.like_count;

        return aPublicMetricsCount < bPublicMetricsCount ? 1 : -1;
      });
  };

  getAuthor = (tweet, type) => {
    let user = {};

    if (type === "user") {
      user = this.props.state.tweetsByUserId["includes"]["users"].filter(
        (user) => user.id === tweet.author_id
      );
    } else if (type === "recent")
      user = this.props.state.tweetsByRecent["includes"]["users"].filter(
        (user) => user.id === tweet.author_id
      );

    return user[0];
  };

  tweet = (tweet, type) => {
    let mediaUrl = "";
    const user = this.getAuthor(tweet, type);

    if (tweet.attachments) {
      let media = {};
      let mediaKey = tweet.attachments.media_keys[0];

      if (type === "user") {
        media = this.props.state.tweetsByUserId["includes"]["media"].filter(
          (media) => media.media_key === mediaKey
        );
      } else if (type === "recent")
        media = this.props.state.tweetsByRecent["includes"]["media"].filter(
          (media) => media.media_key === mediaKey
        );

      if (media && media[0]) {
        if (media[0].hasOwnProperty("url")) mediaUrl = media[0]["url"];
        else if (media[0].hasOwnProperty("preview_image_url"))
          mediaUrl = media[0]["preview_image_url"];
      }
    }

    return (
      <Box className="post twitter" key={tweet.id} data-aos="fade-up">
        <Box className="details">
          <a
            href={"https://twitter.com/twitter/status/" + tweet.id}
            target="_blank"
            rel="noopener noreferrer"
            className="text"
          >
            <Grid className="top" container spacing={2} sx={{ paddingTop: 2 }}>
              <Grid item sx={{ width: "60px" }}>
                <div className="avatar">
                  <img
                    src={user.profile_image_url}
                    alt={user.name + "'s profile image'"}
                  />
                </div>
              </Grid>

              <Grid item xs={10}>
                <Box className="author" sx={{ paddingBottom: 1 }}>
                  <div className="name">{user.name}</div>
                  <span className="username">@{user.username}</span>
                  <span style={{ color: "#999999" }}> · </span>
                  <Typography variant="caption" style={{ color: "#999999" }}>
                    {moment(tweet.created_at).fromNow()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box
              className="post-title"
              sx={{ paddingTop: 2, paddingBottom: 2 }}
            >
              <Typography variant="h5">
                {this.decodeText(tweet.text)}
              </Typography>
            </Box>
          </a>

          {mediaUrl && (
            <Box
              className="media"
              onClick={() => {
                this.props.setAppState({ backdropImage: mediaUrl });
                this.props.setAppState({ backdropToggle: true });
              }}
            >
              <div className="media-image">
                <img
                  className="featured-image"
                  src={mediaUrl}
                  alt={tweet.text}
                  loading="lazy"
                />
              </div>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  displayTweets = () => {
    return (
      <Box>
        {this.state.user && "data" in this.props.state.tweetsByUserId && (
          <Box className="topic posts">
            <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
              {this.props.state.tweetsByUserId["data"]
                .slice(0, 50)
                .map((tweet, index) => this.tweet(tweet, "user"))}
            </Masonry>
          </Box>
        )}

        {this.state.recent && "data" in this.props.state.tweetsByRecent && (
          <Box className="topic posts">
            <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
              {this.props.state.tweetsByRecent["data"]
                .slice(0, 50)
                .map((tweet, index) => this.tweet(tweet, "recent"))}
            </Masonry>
          </Box>
        )}

        {this.state.popular && "data" in this.props.state.tweetsByRecent && (
          <Box className="topic posts">
            <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
              {this.sortByPopularity(this.props.state.tweetsByRecent["data"])
                .slice(0, 50)
                .map((tweet, index) => this.tweet(tweet, "recent"))}
            </Masonry>
          </Box>
        )}
      </Box>
    );
  };

  displayErrorMessage = () => {
    return (
      <Box sx={{ paddingTop: 8, paddingBottom: 4 }}>
        {localStorage.getItem("searchQuery") ? (
          <Box>
            <Typography variant="h5">Hmm. Something went wrong.</Typography>
            <Typography variant="body1" sx={{ paddingTop: 2 }}>
              We could not retreive tweets for "{this.props.state.searchQuery}".
              Check other platforms for more results or try a different search
              query.
            </Typography>
          </Box>
        ) : (
          <Box>
            <Typography variant="h4">Hello!</Typography>
            <Typography variant="body1" sx={{ paddingTop: 2 }}>
              Please search for a topic or person to get started.
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  displayUserCard = () => {
    const user = this.props.state.twitterUser;

    return (
      <Paper elevation={3} className="tweet user" sx={{ marginTop: 6 }}>
        <a
          href={"https://twitter.com/" + user.username}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Box sx={{ padding: 2 }}>
            <div className="d-flex align-center m-no-flex">
              <div className="avatar">
                <img
                  src={this.getHighQualityAvatar(user.profile_image_url)}
                  alt={user.name + "'s profile image'"}
                />
              </div>

              <Box className="username" sx={{ paddingLeft: 2 }}>
                <div className="d-flex align-center">
                  <Typography variant="h5">{user.name}</Typography>

                  {user.verified && (
                    <div className="verified">
                      <VerifiedIcon />
                    </div>
                  )}
                </div>
                <div style={{ color: "#999999" }}>@{user.username}</div>
                <Typography variant="subtitle1" sx={{ paddingTop: 1 }}>
                  {user.description}
                </Typography>
                <Box className="public-metrics" container spacing={2} sx={{}}>
                  {user.public_metrics && (
                    <Typography
                      className="metric flex-container"
                      variant="overline"
                      sx={{ paddingRight: 4 }}
                      style={{ color: "#999999" }}
                    >
                      {user.public_metrics.followers_count.toLocaleString()}{" "}
                      followers
                    </Typography>
                  )}

                  {user.public_metrics && (
                    <Typography
                      className="metric flex-container"
                      variant="overline"
                      style={{ color: "#999999" }}
                    >
                      {user.public_metrics.following_count.toLocaleString()}{" "}
                      following
                    </Typography>
                  )}
                </Box>
              </Box>
            </div>
          </Box>
        </a>
      </Paper>
    );
  };

  render() {
    return (
      <Box sx={{ padding: "0 30px" }}>
        <Filter
          filters={filters}
          onSuccess={(response) => {
            this.handleFilter(response);
          }}
        />

        {this.state.loading && <Loader />}

        {!this.objectEmpty(this.props.state.twitterUser) &&
          this.state.user &&
          this.displayUserCard()}

        {this.props.state.twitterError
          ? this.displayErrorMessage()
          : this.displayTweets()}
      </Box>
    );
  }
}
