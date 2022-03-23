import React, { Component } from "react";

import { Box, Paper, Grid, Typography } from "@mui/material";

export default class Tweets extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = async () => {};

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
    return (
      <Box className="twitter-section" sx={{ marginTop: 4, marginBottom: 4 }}>
        {this.props.twitterResults.length > 0 && <h2>Twitter</h2>}

        <Grid className="tweets" container spacing={2}>
          {this.props.twitterResults.slice(0, 12).map((tweet, index) => {
            return this.tweet(tweet);
          })}
        </Grid>
      </Box>
    );
  }
}
