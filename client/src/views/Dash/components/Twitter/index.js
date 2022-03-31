import React, { Component } from "react";
import moment from "moment";
import axios from "axios";

import { Box, Paper, Grid, Typography, Radio } from "@mui/material";

import { Masonry } from "@mui/lab";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import LoopIcon from "@mui/icons-material/Loop";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default class Twitter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      twitterUserID: "",
      queryWithoutSymbols: "",

      filterToggle: false,

      recent: false,
      popular: true,
      userTweets: false,
    };
    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount = async () => {
    document.addEventListener("mousedown", this.handleClickOutside);

    if (!("data" in this.props.state.tweetsByRecent)) {
      await this.twitterSearchByRecent();
    }

    await this.twitterSearchByUsername();
  };

  componentWillUnmount = () => {
    document.removeEventListener("mousedown", this.handleClickOutside);
  };

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target))
      this.setState({ filterToggle: false });
  };

  toggle = async (state) => {
    await this.setState({ [state]: !this.state[state] });
  };

  changeTab = (event) => {
    const tabs = ["recent", "popular", "userTweets"];
    const selectedTab = event.target.getAttribute("data-tab");

    tabs.forEach((tab) => {
      if (tab === selectedTab) this.setState({ [tab]: true });
      else this.setState({ [tab]: false });
    });

    this.setState({ filterToggle: false });

    if (selectedTab === "userTweets") this.getTweetsByUserID();
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
    return await axios
      .put("/twitter/search", {
        searchQuery: this.props.state.previousSearchQuery,
      })
      .then(
        (response) => {
          if ("error" in response.data)
            this.props.setAppState("twitterError", true);
          else this.props.setAppState("tweetsByRecent", response.data.tweets);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  twitterSearchByUsername = async (e) => {
    const query = this.props.state.searchQuery;

    // if search query is a username (has @ symbol in front), remove symbol and continue to get user
    if (this.oneWord(query)) {
      if (query.charAt(0) === "@")
        this.setState({ queryWithoutSymbols: query.substring(1) });
    }

    return await axios
      .put("/twitter/search/username", {
        searchQuery: this.props.state.previousSearchQuery,
      })
      .then(
        (response) => {
          //console.log("searchByUsername", response);
          if (response.data.error || this.objectEmpty(response.data))
            return false;
          else {
            this.setState({ twitterUserID: response.data.twitterResults.id });
            this.props.setAppState("twitterUser", response.data.twitterResults);
            return true;
          }
        },
        (error) => {
          console.log(error);
        }
      );
  };

  getTweetsByUserID = async (e) => {
    return await axios
      .put("/twitter/get/tweets/id", {
        userId: this.state.twitterUserID,
      })
      .then(
        (response) => {
          //console.log("getTweetsByUserID", response);
          this.props.setAppState("tweetsByUserId", response.data.tweets);
        },
        (error) => {
          console.log(error);
        }
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

    if (type === "userTweets") {
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
    // console.log(tweet);
    let mediaUrl = "";
    const user = this.getAuthor(tweet, type);

    if (tweet.attachments) {
      let media = {};
      let mediaKey = tweet.attachments.media_keys[0];

      if (type === "userTweets") {
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
      <Paper elevation={3} className="tweet post-card" key={tweet.id}>
        <a
          href={"https://twitter.com/twitter/status/" + tweet.id}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Grid
            container
            spacing={2}
            sx={{ paddingTop: 2, paddingLeft: 2, paddingRight: 2 }}
          >
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
                <Typography variant="h6" style={{ color: "#ffffff" }}>
                  {user.name}
                </Typography>{" "}
                <span style={{ color: "#999999" }}>@{user.username}</span>
                <span style={{ color: "#999999" }}> · </span>
                <Typography variant="caption" style={{ color: "#999999" }}>
                  {moment(tweet.created_at).fromNow()}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box className="tweet-text" sx={{ padding: 2 }}>
            <Typography variant="body1">
              {this.decodeText(tweet.text)}
            </Typography>
          </Box>
        </a>

        {mediaUrl && (
          <Box
            className="media"
            sx={{ paddingBottom: 2, paddingLeft: 2, paddingRight: 2 }}
            onClick={() => {
              this.props.setAppState("backdropImage", mediaUrl);
              this.props.setAppState("backdropToggle", true);
            }}
          >
            <div className="media-image">
              <img src={mediaUrl} alt={tweet.text} loading="lazy" />
            </div>
          </Box>
        )}

        <a
          href={"https://twitter.com/twitter/status/" + tweet.id}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Box
            className="public-metrics"
            container
            spacing={2}
            sx={{ paddingLeft: 2, paddingRight: 2, paddingBottom: 2 }}
          >
            {tweet.public_metrics && (
              <Typography
                className="metric flex-container"
                variant="overline"
                sx={{ paddingRight: 4 }}
                style={{ color: "#999999" }}
              >
                <ThumbUpIcon />
                {tweet.public_metrics.like_count}
              </Typography>
            )}

            {tweet.public_metrics && (
              <Typography
                className="metric flex-container"
                variant="overline"
                style={{ color: "#999999" }}
              >
                <LoopIcon />
                {tweet.public_metrics.retweet_count}
              </Typography>
            )}
          </Box>
        </a>
      </Paper>
    );
  };

  displayTweets = () => {
    return (
      <Box sx={{ paddingTop: 4, paddingBottom: 4 }}>
        {this.state.userTweets && (
          <Box className="twitter-tab" sx={{ marginTop: 4, marginBottom: 4 }}>
            <Masonry
              className="tweets"
              columns={{ xs: 1, md: 2, lg: 3, xl: 4 }}
              spacing={2}
            >
              {this.props.state.tweetsByUserId["data"] &&
                this.props.state.tweetsByUserId["data"]
                  .slice(0, 50)
                  .map((tweet, index) => {
                    return this.tweet(tweet, "userTweets");
                  })}
            </Masonry>
          </Box>
        )}

        {this.state.recent && "data" in this.props.state.tweetsByRecent && (
          <Box className="twitter-tab" sx={{ marginTop: 4, marginBottom: 4 }}>
            <Masonry
              className="tweets"
              columns={{ xs: 1, md: 2, lg: 3, xl: 4 }}
              spacing={2}
            >
              {this.props.state.tweetsByRecent["data"] &&
                this.props.state.tweetsByRecent["data"]
                  .slice(0, 50)
                  .map((tweet, index) => {
                    return this.tweet(tweet, "recent");
                  })}
            </Masonry>
          </Box>
        )}

        {this.state.popular && "data" in this.props.state.tweetsByRecent && (
          <Box className="twitter-tab" sx={{ marginTop: 4, marginBottom: 4 }}>
            <Masonry
              className="tweets"
              columns={{ xs: 1, md: 2, lg: 3, xl: 4 }}
              spacing={2}
            >
              {this.props.state.tweetsByRecent["data"] &&
                this.sortByPopularity(this.props.state.tweetsByRecent["data"])
                  .slice(0, 50)
                  .map((tweet, index) => {
                    return this.tweet(tweet, "recent");
                  })}
            </Masonry>
          </Box>
        )}
      </Box>
    );
  };

  displayErrorMessage = () => {
    return (
      <Box sx={{ paddingTop: 8, paddingBottom: 4 }}>
        <Typography variant="h5">Hmm. Something went wrong.</Typography>
        <Typography variant="body1" sx={{ paddingTop: 2 }}>
          We could not retreive tweets for "{this.props.state.searchQuery}".
          Check other platforms for more results or try a different search
          query.
        </Typography>
      </Box>
    );
  };

  displayUserCard = () => {
    const user = this.props.state.twitterUser;

    return (
      <Paper elevation={3} className="tweet user" sx={{ marginTop: 6 }}>
        <Box sx={{ padding: 2 }}>
          <div className="d-flex align-center">
            <div className="avatar">
              <img
                src={this.getHighQualityAvatar(user.profile_image_url)}
                alt={user.name + "'s profile image'"}
              />
            </div>

            <Box className="username" sx={{ paddingLeft: 2 }}>
              <div class="d-flex align-center">
                <Typography variant="h5">{user.name}</Typography>

                {user.verified && (
                  <div class="verified">
                    <VerifiedIcon />
                  </div>
                )}
              </div>
              <span style={{ color: "#999999" }}>@{user.username}</span>
            </Box>
          </div>
        </Box>

        <Box className="hide-when-closed" sx={{ padding: 2 }}>
          <Typography variant="subtitle1">{user.description}</Typography>
        </Box>

        <Grid
          className="hide-when-closed"
          container
          spacing={2}
          sx={{ paddingTop: 2, paddingLeft: "25px", paddingRight: "25px" }}
        >
          <Typography
            className="d-flex align-center"
            variant="body2"
            style={{ color: "#999999" }}
          >
            <LocationOnIcon style={{ marginRight: "5px" }} />
            {user.location}
          </Typography>
          <Typography
            className="d-flex align-center"
            variant="body2"
            style={{ marginLeft: "15px", color: "#999999" }}
          >
            <CalendarMonthIcon style={{ marginRight: "5px" }} />
            Joined {moment(user.created_at).format("MMMM YYYY")}
          </Typography>
        </Grid>

        <Box
          className="public-metrics"
          container
          spacing={2}
          sx={{ padding: 2 }}
        >
          {user.public_metrics && (
            <Typography
              className="metric flex-container"
              variant="overline"
              sx={{ paddingRight: 4 }}
              style={{ color: "#999999" }}
            >
              {user.public_metrics.followers_count.toLocaleString()} followers
            </Typography>
          )}

          {user.public_metrics && (
            <Typography
              className="metric flex-container"
              variant="overline"
              style={{ color: "#999999" }}
            >
              {user.public_metrics.following_count.toLocaleString()} following
            </Typography>
          )}
        </Box>
        <a
          href={"https://twitter.com/" + user.username}
          target="_blank"
          rel="noopener noreferrer"
        ></a>
      </Paper>
    );
  };

  render() {
    //const filteredTweets = this.filterTweets(this.props.tweetsByRecent);

    return (
      <Box>
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
            {this.state.twitterUserID && (
              <li
                className={this.state.userTweets ? "active" : ""}
                onClick={this.changeTab}
                data-tab="userTweets"
              >
                @{this.props.state.twitterUser.username}
                <Radio
                  checked={this.state.userTweets && "checked"}
                  size="small"
                />
              </li>
            )}
            <li
              className={this.state.recent ? "active" : ""}
              onClick={this.changeTab}
              data-tab="recent"
            >
              Recent
              <Radio checked={this.state.recent && "checked"} size="small" />
            </li>
            <li
              className={this.state.popular ? "active" : ""}
              onClick={this.changeTab}
              data-tab="popular"
            >
              Popular
              <Radio checked={this.state.popular && "checked"} size="small" />
            </li>
          </ul>
        </Box>

        {/*!this.objectEmpty(this.props.state.twitterUser) &&
          this.displayUserCard()*/}

        {this.props.state.twitterError
          ? this.displayErrorMessage()
          : this.displayTweets()}
      </Box>
    );
  }
}
