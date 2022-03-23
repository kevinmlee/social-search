import React, { Component } from "react";

export default class Tweets extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = async () => {};

  tweet = (tweet) => {
    return (
      <div className="tweet" key={tweet.id}>
        {tweet.text}
      </div>
    );
  };

  render() {
    return (
      <div className="twitter-section">
        {this.props.twitterResults.length > 0 && <h2>Twitter</h2>}

        <div className="tweets d-flex flex-wrap">
          {this.props.twitterResults.map((tweet, index) => {
            return this.tweet(tweet);
          })}
        </div>
      </div>
    );
  }
}
