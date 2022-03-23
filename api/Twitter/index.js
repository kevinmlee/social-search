require("dotenv").config();
const Twitter = require("twitter-v2");

// Initialize twitter client
const client = new Twitter({
  //consumer_key: process.env.TWITTER_API_KEY,
  //consumer_secret: process.env.TWITTER_API_KEY_SECRET,
  bearer_token: process.env.TWITTER_BEARER_TOKEN,
});

module.exports = {
  search: async function (req, res, next) {
    const { searchQuery } = req.body;

    const params = {
      query: searchQuery,
      //"-is": "retweet",
      //"-filter": "replies",
      expansions: "in_reply_to_user_id,referenced_tweets.id",
      max_results: 100,
      "tweet.fields": "public_metrics,created_at",
    };

    try {
      const { data } = await client.get("tweets/search/recent", params);
      return res.json({ twitterResults: data });
    } catch (e) {
      console.log(e);
      return res.json({ error: e, twitterResults: [] });
    }
  },
};
