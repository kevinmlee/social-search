import React, { Component } from "react";

import { Box, Paper, Grid, Typography } from "@mui/material";

export default class Tweets extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = async () => {};

  tweet = (tweet) => {
    return (
      <Grid item xs={6} md={6} key={tweet.id}>
        <Paper elevation={3} className="tweet">
          <Typography variant="body2">{tweet.text}</Typography>

          <Box
            className="public-metrics"
            container
            spacing={2}
            xs={12}
            sx={{ paddingTop: 4 }}
          >
            <Typography variant="overline" sx={{ paddingRight: 4 }}>
              <strong>Likes: {tweet.public_metrics.like_count}</strong>
            </Typography>

            <Typography variant="overline">
              <strong>Retweets: {tweet.public_metrics.retweet_count}</strong>
            </Typography>
          </Box>
        </Paper>
      </Grid>
    );
  };

  render() {
    return (
      <Box className="twitter-section" sx={{ paddingTop: 4, paddingBottom: 4 }}>
        {this.props.twitterResults.length > 0 && <h2>Twitter</h2>}

        <Grid className="tweets" container spacing={2} xs={12}>
          {this.props.twitterResults.slice(0, 12).map((tweet, index) => {
            return this.tweet(tweet);
          })}
        </Grid>
      </Box>
    );
  }
}
