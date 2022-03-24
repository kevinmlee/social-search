import React, { Component } from "react";

import {
  Box,
  ButtonGroup,
  Button,
  Paper,
  Grid,
  Typography,
  Tooltip,
} from "@mui/material";

export default class Tweets extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recent: true,
      popular: false,
      username: false,
    };
  }

  componentDidMount = async () => {};

  changeTab = (event) => {
    const tab = event.target.getAttribute("data-tab");

    if (tab === "recent")
      this.setState({ recent: true, popular: false, username: false });
    else if (tab === "popular")
      this.setState({ recent: false, popular: true, username: false });
    else if (tab === "username")
      this.setState({ recent: false, popular: false, username: true });
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

  tweet = (tweet, type) => {
    let mediaUrl = "";

    if (tweet.attachments) {
      let media = {};
      let mediaKey = tweet.attachments.media_keys[0];

      if (type === "username") {
        media = this.props.tweetsByUserId["includes"]["media"].filter(
          (media) => media.media_key === mediaKey
        );
      } else if (type === "recent")
        media = this.props.tweetsByRecent["includes"]["media"].filter(
          (media) => media.media_key === mediaKey
        );

      if (media && media[0]) {
        if (media[0].hasOwnProperty("url")) mediaUrl = media[0]["url"];
        else if (media[0].hasOwnProperty("preview_image_url"))
          mediaUrl = media[0]["preview_image_url"];
      }
    }

    return (
      <Grid item xs={6} md={6} key={tweet.id}>
        <a
          href={"https://twitter.com/twitter/status/" + tweet.id}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Paper elevation={3} className="tweet">
            <Box className="created">
              <Typography variant="caption" style={{ color: "#999999" }}>
                <strong>{new Date(tweet.created_at).toString()}</strong>
              </Typography>
            </Box>

            <Box className="tweet-text" sx={{ marginTop: 2 }}>
              <Typography variant="body1">{tweet.text}</Typography>
            </Box>

            {mediaUrl && (
              <Box className="media" sx={{ marginTop: 2 }}>
                <a href={mediaUrl} target="_blank" rel="noreferrer">
                  <img src={mediaUrl} alt={tweet.text} />
                </a>
              </Box>
            )}

            <Box
              className="public-metrics"
              container
              spacing={2}
              xs={12}
              sx={{ paddingTop: 4 }}
            >
              <Typography
                variant="overline"
                sx={{ paddingRight: 4 }}
                style={{ color: "#999999" }}
              >
                {tweet.public_metrics && (
                  <strong>Likes: {tweet.public_metrics.like_count}</strong>
                )}
              </Typography>

              <Typography variant="overline" style={{ color: "#999999" }}>
                {tweet.public_metrics && (
                  <strong>
                    Retweets: {tweet.public_metrics.retweet_count}
                  </strong>
                )}
              </Typography>
            </Box>
          </Paper>
        </a>
      </Grid>
    );
  };

  render() {
    //const filteredTweets = this.filterTweets(this.props.tweetsByRecent);
    const twitterResultsByPopularity = this.sortByPopularity(
      this.props.tweetsByRecent["data"]
    );

    console.log("twitterUser", this.props.twitterUser);

    return (
      <Box sx={{ paddingTop: 4, paddingBottom: 4 }}>
        <h2>Twitter</h2>

        <ButtonGroup variant="outlined" aria-label="outlined button group">
          <Tooltip
            title={
              "Most recent tweets related to '" + this.props.searchQuery + "'"
            }
          >
            <Button
              className={this.state.recent ? "active" : ""}
              onClick={this.changeTab}
              data-tab="recent"
            >
              Most recent
            </Button>
          </Tooltip>

          <Tooltip
            title={"Popular tweets related to '" + this.props.searchQuery + "'"}
          >
            <Button
              className={this.state.popular ? "active" : ""}
              onClick={this.changeTab}
              data-tab="popular"
            >
              Popular
            </Button>
          </Tooltip>

          {this.props.tweetsByUserId["data"] && (
            <Tooltip
              title={
                "Most recent tweets by @" + this.props.twitterUser.username
              }
            >
              <Button
                className={this.state.username ? "active" : ""}
                onClick={this.changeTab}
                data-tab="username"
              >
                @{this.props.twitterUser.username}
              </Button>
            </Tooltip>
          )}
        </ButtonGroup>

        {this.state.username && (
          <Box className="twitter-tab" sx={{ marginTop: 4, marginBottom: 4 }}>
            <Grid className="tweets" container spacing={2}>
              {this.props.tweetsByUserId["data"] &&
                this.props.tweetsByUserId["data"]
                  .slice(0, 50)
                  .map((tweet, index) => {
                    return this.tweet(tweet, "username");
                  })}
            </Grid>
          </Box>
        )}

        {this.state.recent && (
          <Box className="twitter-tab" sx={{ marginTop: 4, marginBottom: 4 }}>
            <Grid className="tweets" container spacing={2}>
              {this.props.tweetsByRecent["data"] &&
                this.props.tweetsByRecent["data"]
                  .slice(0, 50)
                  .map((tweet, index) => {
                    return this.tweet(tweet, "recent");
                  })}
            </Grid>
          </Box>
        )}

        {this.state.popular && (
          <Box className="twitter-tab" sx={{ marginTop: 4, marginBottom: 4 }}>
            <Grid className="tweets" container spacing={2}>
              {twitterResultsByPopularity &&
                twitterResultsByPopularity.slice(0, 50).map((tweet, index) => {
                  return this.tweet(tweet, "recent");
                })}
            </Grid>
          </Box>
        )}
      </Box>
    );
  }
}
