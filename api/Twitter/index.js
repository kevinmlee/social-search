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
      expansions:
        "in_reply_to_user_id,referenced_tweets.id,attachments.media_keys,author_id",
      max_results: 100,
      "tweet.fields": "public_metrics,created_at",
      "media.fields": "preview_image_url,url",
      "user.fields": "profile_image_url",
    };

    try {
      return res.json({
        tweets: await client.get("tweets/search/recent", params),
      });
    } catch (e) {
      console.log(e);
      return res.json({ error: e, twitterResults: [] });
    }
  },
  searchByUsername: async function (req, res, next) {
    const { searchQuery } = req.body;

    const params = {
      "user.fields":
        "public_metrics,profile_image_url,verified,description,location,created_at",
      expansions: "pinned_tweet_id",
    };

    try {
      const { data } = await client.get(
        "users/by/username/" + searchQuery,
        params
      );
      return res.json({ twitterResults: data });
    } catch (e) {
      console.log(e);
      return res.json({ error: e, twitterResults: [] });
    }
  },
  getTweetsByUserId: async function (req, res, next) {
    const { userId } = req.body;

    const params = {
      expansions: "attachments.media_keys,author_id",
      "tweet.fields": "public_metrics,created_at",
      "media.fields": "preview_image_url,url",
      "user.fields": "profile_image_url",
      exclude: "replies,retweets",
      max_results: 20,
    };

    try {
      //const { data, includes } = ;
      return res.json({
        tweets: await client.get("users/" + userId + "/tweets", params),
      });
    } catch (e) {
      console.log(e);
      return res.json({ error: e, twitterResults: [] });
    }
  },
};
