import React, { Component } from "react";

import {
  Box,
  ButtonGroup,
  Button,
  Paper,
  Grid,
  Typography,
} from "@mui/material";

export default class Tweets extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recent: true,
      popular: false,
    };
  }

  componentDidMount = async () => {};

  changeTab = (event) => {
    const tab = event.target.getAttribute("data-tab");

    if (tab === "recent") this.setState({ recent: true, popular: false });
    else if (tab === "popular") this.setState({ recent: false, popular: true });
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
    return [...tweets].sort((a, b) => {
      let aPublicMetricsCount =
        a.public_metrics.retweet_count + a.public_metrics.like_count;
      let bPublicMetricsCount =
        b.public_metrics.retweet_count + b.public_metrics.like_count;

      return aPublicMetricsCount < bPublicMetricsCount ? 1 : -1;
    });
  };

  tweet = (tweet) => {
    console.log(tweet);
    return (
      <Grid item xs={6} md={6} key={tweet.id}>
        <Paper elevation={3} className="tweet">
          <Box className="created">
            <Typography variant="caption" style={{ color: "#999999" }}>
              <strong>{new Date(tweet.created_at).toString()}</strong>
            </Typography>
          </Box>

          <Box className="tweet-text" sx={{ marginTop: 2 }}>
            <Typography variant="body2">{tweet.text}</Typography>
          </Box>

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
              <strong>Likes: {tweet.public_metrics.like_count}</strong>
            </Typography>

            <Typography variant="overline" style={{ color: "#999999" }}>
              <strong>Retweets: {tweet.public_metrics.retweet_count}</strong>
            </Typography>
          </Box>
        </Paper>
      </Grid>
    );
  };

  render() {
    const filteredTweets = this.filterTweets(this.props.twitterResults);
    const twitterResultsByPopularity = this.sortByPopularity(filteredTweets);

    return (
      <Box sx={{ paddingTop: 4, paddingBottom: 4 }}>
        <h2>Twitter</h2>

        <ButtonGroup variant="outlined" aria-label="outlined button group">
          <Button
            className={this.state.recent ? "active" : ""}
            onClick={this.changeTab}
            data-tab="recent"
          >
            Most recent
          </Button>
          <Button
            className={this.state.popular ? "active" : ""}
            onClick={this.changeTab}
            data-tab="popular"
          >
            Popular
          </Button>
        </ButtonGroup>

        {this.state.recent && (
          <Box className="twitter-tab" sx={{ marginTop: 4, marginBottom: 4 }}>
            <Grid className="tweets" container spacing={2}>
              {filteredTweets.slice(0, 10).map((tweet, index) => {
                return this.tweet(tweet);
              })}
            </Grid>
          </Box>
        )}

        {this.state.popular && (
          <Box className="twitter-tab" sx={{ marginTop: 4, marginBottom: 4 }}>
            <Grid className="tweets" container spacing={2}>
              {twitterResultsByPopularity.slice(0, 10).map((tweet, index) => {
                return this.tweet(tweet);
              })}
            </Grid>
          </Box>
        )}
      </Box>
    );
  }
}
