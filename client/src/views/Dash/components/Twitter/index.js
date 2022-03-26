import React, { Component } from "react";
import moment from "moment";

import {
  Box,
  ButtonGroup,
  Button,
  Paper,
  Grid,
  Typography,
  Tooltip,
} from "@mui/material";

import { Masonry } from "@mui/lab";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import LoopIcon from "@mui/icons-material/Loop";

export default class Twitter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recent: true,
      popular: false,
      userTweets: false,
    };
  }

  componentDidMount = async () => {};

  changeTab = (event) => {
    const tab = event.target.getAttribute("data-tab");

    if (tab === "recent")
      this.setState({ recent: true, popular: false, userTweets: false });
    else if (tab === "popular")
      this.setState({ recent: false, popular: true, userTweets: false });
    else if (tab === "userTweets")
      this.setState({ recent: false, popular: false, userTweets: true });
  };

  decodeText = (string) => {
    return string.replaceAll("&amp;", "&").replaceAll("&lt;", "<");
  };

  filterTweets = (tweets) => {
    // remove retweets
    const removedRetweets = tweets.filter(
      (tweet) => !tweet.text.includes("RT ")
    );

    // remove quoted tweets
    const removedQuotedTweets = removedRetweets.filter(
      (tweet) => tweet.referenced_tweets === undefined
    );

    // remove replies and return the filtered tweets
    return removedQuotedTweets.filter(
      (tweet) => tweet.in_reply_to_user_id === undefined
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
      <Paper elevation={3} className="tweet" key={tweet.id}>
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

  render() {
    //const filteredTweets = this.filterTweets(this.props.tweetsByRecent);

    return (
      <Box sx={{ paddingTop: 4, paddingBottom: 4 }}>
        <ButtonGroup variant="outlined" aria-label="outlined button group">
          <Tooltip
            title={
              "Most recent tweets of the week related to '" +
              this.props.state.searchQuery +
              "'"
            }
          >
            <Button
              className={this.state.recent ? "active" : ""}
              onClick={this.changeTab}
              data-tab="recent"
            >
              Recent
            </Button>
          </Tooltip>

          <Tooltip
            title={
              "Popular tweets of the week related to '" +
              this.props.state.searchQuery +
              "'"
            }
          >
            <Button
              className={this.state.popular ? "active" : ""}
              onClick={this.changeTab}
              data-tab="popular"
            >
              Popular
            </Button>
          </Tooltip>

          {this.props.state.tweetsByUserId["data"] && (
            <Tooltip
              title={
                "Most recent tweets by @" +
                this.props.state.twitterUser.username
              }
            >
              <Button
                className={this.state.userTweets ? "active" : ""}
                onClick={this.changeTab}
                data-tab="userTweets"
              >
                @{this.props.state.twitterUser.username}
              </Button>
            </Tooltip>
          )}
        </ButtonGroup>

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

        {this.state.recent && (
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

        {this.state.popular && (
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
  }
}
