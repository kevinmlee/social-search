require("dotenv").config();
const Twitter = require("twitter-v2");

// Initialize twitter client
const client = new Twitter({
  //consumer_key: process.env.TWITTER_API_KEY,
  //consumer_secret: process.env.TWITTER_API_KEY_SECRET,
  bearer_token: process.env.TWITTER_BEARER_TOKEN,
});

exports.handler = async (event, context) => {
  const { searchQuery } = JSON.parse(event.body);

  const searchTweetsParams = {
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

  const userTweetsParams = {
    expansions: "attachments.media_keys,author_id",
    "tweet.fields": "public_metrics,created_at",
    "media.fields": "preview_image_url,url",
    "user.fields": "profile_image_url",
    exclude: "replies,retweets",
    max_results: 20,
  };

  const userParams = {
    "user.fields":
      "public_metrics,profile_image_url,verified,description,location,created_at",
    expansions: "pinned_tweet_id",
  };

  // get user
  const user = await client.get("users/by/username/" + searchQuery, userParams);
  const userId = user.data.id;

  return {
    statusCode: 200,
    body: JSON.stringify({
      userTweets: await client.get(
        "users/" + userId + "/tweets",
        userTweetsParams
      ),
      searchResults: await client.get(
        "tweets/search/recent",
        searchTweetsParams
      ),
      user: user,
    }),
  };
};
